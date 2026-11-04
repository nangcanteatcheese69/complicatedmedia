"use client";

import Image from "next/image";
import Link from "next/link";
import { getProduct } from "@/content/products";
import { money } from "@/lib/format";
import {
  remainingOf,
  removeLine,
  setLineQuantity,
  useCart,
  useHydrated,
  useOrders,
} from "@/lib/storage";
import styles from "./CartView.module.css";

export function CartView() {
  const lines = useCart();
  const orders = useOrders();
  const hydrated = useHydrated();

  const rows = lines.map((line) => {
    const product = getProduct(line.productSlug);
    const size = product?.sizes.find((option) => option.id === line.sizeId);
    return { line, product, size };
  });

  const subtotal = rows.reduce((sum, row) => {
    if (!row.size) return sum;
    return sum + row.size.priceCents * row.line.quantity;
  }, 0);

  return (
    <div className="wrap page">
      <p className="kicker">Shop</p>
      <h1>Cart</h1>
      {!hydrated ? <p className="quiet">Opening the cart…</p> : null}
      {hydrated && rows.length === 0 ? (
        <div className={styles.empty}>
          <p>The cart is empty.</p>
          <Link className="btn" href="/shop">
            Browse prints
          </Link>
        </div>
      ) : null}
      {hydrated && rows.length > 0 ? (
        <div className={styles.layout}>
          <ul className={styles.lines}>
            {rows.map(({ line, product, size }) => {
              const key = `${line.productSlug}-${line.sizeId}`;
              if (!product || !size) {
                return (
                  <li key={key} className={styles.line}>
                    <p>This work is no longer listed.</p>
                    <button
                      type="button"
                      className={styles.remove}
                      onClick={() => removeLine(line.productSlug, line.sizeId)}
                    >
                      Remove
                    </button>
                  </li>
                );
              }
              const others = lines.filter(
                (item) => item.productSlug !== line.productSlug || item.sizeId !== line.sizeId,
              );
              const ceiling = remainingOf(line.productSlug, line.sizeId, others, orders);
              return (
                <li key={key} className={styles.line}>
                  <Link href={`/shop/${product.slug}`} className={styles.thumb}>
                    <Image
                      src={product.image.src}
                      alt=""
                      width={product.image.width}
                      height={product.image.height}
                      sizes="120px"
                    />
                  </Link>
                  <div className={styles.info}>
                    <h2>
                      <Link href={`/shop/${product.slug}`}>{product.title}</Link>
                    </h2>
                    <p className="quiet">
                      {size.label}
                      <span className={styles.dot}>·</span>
                      {size.dimensions}
                    </p>
                    <div className={styles.actions}>
                      <div className={styles.qty} role="group" aria-label={`Quantity for ${product.title}`}>
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${product.title}`}
                          onClick={() =>
                            setLineQuantity(line.productSlug, line.sizeId, line.quantity - 1)
                          }
                        >
                          −
                        </button>
                        <span>{line.quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${product.title}`}
                          disabled={line.quantity >= ceiling}
                          onClick={() =>
                            setLineQuantity(line.productSlug, line.sizeId, line.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className={styles.remove}
                        onClick={() => removeLine(line.productSlug, line.sizeId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className={styles.price}>{money(size.priceCents * line.quantity)}</p>
                </li>
              );
            })}
          </ul>
          <aside className={styles.summary} aria-label="Order summary">
            <p className={styles.row}>
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </p>
            <p className="quiet">Shipping is added at checkout. Pickup is free.</p>
            <Link className="btn" href="/checkout">
              Checkout
            </Link>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
