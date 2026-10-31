"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/content/types";
import { money } from "@/lib/format";
import { addToCart, remainingOf, useCart, useOrders } from "@/lib/storage";
import styles from "./BuyBox.module.css";

export function BuyBox({ product }: { product: Product }) {
  const [sizeId, setSizeId] = useState(product.sizes[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lines = useCart();
  const orders = useOrders();
  const size = product.sizes.find((option) => option.id === sizeId) ?? product.sizes[0];
  const left = size ? remainingOf(product.slug, size.id, lines, orders) : 0;
  const maxAdd = Math.min(8, left);

  function chooseSize(nextId: string) {
    setSizeId(nextId);
    const nextLeft = remainingOf(product.slug, nextId, lines, orders);
    const cap = Math.min(8, nextLeft);
    setQuantity((current) => Math.max(1, Math.min(current, Math.max(cap, 1))));
    setMessage(null);
    setError(null);
  }

  function add() {
    if (!size) return;
    const result = addToCart(product.slug, size.id, quantity);
    if (result) {
      setError(result);
      setMessage(null);
      return;
    }
    setError(null);
    setMessage(
      quantity === 1 ? "Added to cart." : `Added ${quantity} to cart.`,
    );
  }

  if (!size) return null;

  return (
    <div className={styles.box}>
      <fieldset className={styles.sizes}>
        <legend className="kicker">Size</legend>
        {product.sizes.map((option) => {
          const optionLeft = remainingOf(product.slug, option.id, lines, orders);
          return (
            <label key={option.id} className={styles.size}>
              <input
                type="radio"
                name={`${product.slug}-size`}
                value={option.id}
                checked={option.id === size.id}
                onChange={() => chooseSize(option.id)}
              />
              <span>{option.label}</span>
              <span className={styles.dim}>{option.dimensions}</span>
              <span>{money(option.priceCents)}</span>
              <span className="sr-only">
                {optionLeft === 0 ? "Sold out" : `${optionLeft} of ${option.edition} remaining`}
              </span>
            </label>
          );
        })}
      </fieldset>

      <p className={styles.edition}>
        {left === 0
          ? "This size is sold out."
          : `Edition of ${size.edition}. ${left} remaining.`}
      </p>

      {maxAdd > 0 ? (
        <div className={styles.qtyRow}>
          <span id={`${product.slug}-qty`}>Quantity</span>
          <div className={styles.qty} role="group" aria-labelledby={`${product.slug}-qty`}>
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span aria-live="polite">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.min(maxAdd, value + 1))}
              aria-label="Increase quantity"
              disabled={quantity >= maxAdd}
            >
              +
            </button>
          </div>
        </div>
      ) : null}

      <button type="button" className="btn" onClick={add} disabled={maxAdd < 1}>
        {maxAdd < 1 ? "Sold out" : `Add to cart · ${money(size.priceCents * Math.max(quantity, 1))}`}
      </button>

      <p className={styles.status} role="status" aria-live="polite">
        {error ?? message ?? ""}
        {message ? (
          <>
            {" "}
            <Link href="/cart" className="text-link">
              View cart
            </Link>
          </>
        ) : null}
      </p>
      <p className={styles.note}>Shipping is chosen at checkout. Studio pickup is free.</p>
    </div>
  );
}
