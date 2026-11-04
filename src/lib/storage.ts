"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { getProduct } from "@/content/products";
import type { CartLine, Order } from "@/lib/types";

const CART_KEY = "nang-cart-v1";
const ORDER_KEY = "nang-orders-v1";
const EVENT = "nang-store";

const EMPTY_CART: CartLine[] = [];
const EMPTY_ORDERS: Order[] = [];

let cartRaw = "[]";
let cartSnap: CartLine[] = EMPTY_CART;
let orderRaw = "[]";
let orderSnap: Order[] = EMPTY_ORDERS;

function emit() {
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function parseCart(raw: string): CartLine[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((line) => {
      if (typeof line !== "object" || line === null) return [];
      const record = line as Record<string, unknown>;
      if (
        typeof record.productSlug !== "string" ||
        typeof record.sizeId !== "string" ||
        typeof record.quantity !== "number"
      ) {
        return [];
      }
      return [
        {
          productSlug: record.productSlug,
          sizeId: record.sizeId,
          quantity: record.quantity,
        },
      ];
    });
  } catch {
    return [];
  }
}

function parseOrders(raw: string): Order[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (order): order is Order =>
        typeof order === "object" &&
        order !== null &&
        typeof (order as Order).id === "string" &&
        Array.isArray((order as Order).items),
    );
  } catch {
    return [];
  }
}

function readCart(): CartLine[] {
  const raw = localStorage.getItem(CART_KEY) ?? "[]";
  if (raw === cartRaw) return cartSnap;
  cartRaw = raw;
  cartSnap = parseCart(raw);
  return cartSnap;
}

function readOrders(): Order[] {
  const raw = localStorage.getItem(ORDER_KEY) ?? "[]";
  if (raw === orderRaw) return orderSnap;
  orderRaw = raw;
  orderSnap = parseOrders(raw);
  return orderSnap;
}

function writeCart(lines: CartLine[]) {
  const copy = lines.map((line) => ({ ...line }));
  const raw = JSON.stringify(copy);
  localStorage.setItem(CART_KEY, raw);
  cartRaw = raw;
  cartSnap = copy;
  emit();
}

function writeOrders(orders: Order[]) {
  const raw = JSON.stringify(orders);
  localStorage.setItem(ORDER_KEY, raw);
  orderRaw = raw;
  orderSnap = orders;
  emit();
}

export function useCart() {
  return useSyncExternalStore(subscribe, readCart, () => EMPTY_CART);
}

export function useOrders() {
  return useSyncExternalStore(subscribe, readOrders, () => EMPTY_ORDERS);
}

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // Cart and orders live in localStorage. The server render has to show a
    // placeholder, then this flips once, after hydration, so totals are real.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);
  return hydrated;
}

function soldCount(orders: Order[], productSlug: string, sizeId: string) {
  return orders.reduce(
    (sum, order) =>
      sum +
      order.items
        .filter((item) => item.productSlug === productSlug && item.sizeId === sizeId)
        .reduce((lineSum, item) => lineSum + item.quantity, 0),
    0,
  );
}

export function remainingOf(
  productSlug: string,
  sizeId: string,
  lines: CartLine[],
  orders: Order[],
) {
  const size = getProduct(productSlug)?.sizes.find((option) => option.id === sizeId);
  if (!size) return 0;
  const held = lines
    .filter((line) => line.productSlug === productSlug && line.sizeId === sizeId)
    .reduce((sum, line) => sum + line.quantity, 0);
  return Math.max(0, size.edition - soldCount(orders, productSlug, sizeId) - held);
}

export function addToCart(
  productSlug: string,
  sizeId: string,
  quantity: number,
): string | null {
  const product = getProduct(productSlug);
  const size = product?.sizes.find((option) => option.id === sizeId);
  if (!product || !size) return "That work is no longer listed.";
  if (!Number.isInteger(quantity) || quantity < 1) return "Choose a quantity.";

  const lines = readCart();
  const orders = readOrders();
  const left = remainingOf(productSlug, sizeId, lines, orders);
  if (quantity > left) {
    return left <= 0 ? "This size is sold out." : `Only ${left} remaining in this size.`;
  }

  const next = lines.map((line) => ({ ...line }));
  const index = next.findIndex(
    (line) => line.productSlug === productSlug && line.sizeId === sizeId,
  );
  if (index >= 0) next[index].quantity += quantity;
  else next.push({ productSlug, sizeId, quantity });
  writeCart(next);
  return null;
}

export function setLineQuantity(productSlug: string, sizeId: string, quantity: number) {
  const lines = readCart();
  if (quantity <= 0) {
    writeCart(lines.filter((line) => line.productSlug !== productSlug || line.sizeId !== sizeId));
    return null;
  }
  const others = lines.filter(
    (line) => line.productSlug !== productSlug || line.sizeId !== sizeId,
  );
  const left = remainingOf(productSlug, sizeId, others, readOrders());
  if (quantity > left) {
    return left <= 0 ? "This size is sold out." : `Only ${left} remaining in this size.`;
  }
  writeCart([...others, { productSlug, sizeId, quantity }]);
  return null;
}

export function removeLine(productSlug: string, sizeId: string) {
  writeCart(
    readCart().filter((line) => line.productSlug !== productSlug || line.sizeId !== sizeId),
  );
}

export function clearCart() {
  writeCart([]);
}

export function saveOrder(order: Order) {
  writeOrders([order, ...readOrders()].slice(0, 30));
  writeCart([]);
}
