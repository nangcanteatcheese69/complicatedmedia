"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getDelivery } from "@/lib/delivery";
import { formatDate, money } from "@/lib/format";
import { useHydrated, useOrders } from "@/lib/storage";
import styles from "./CheckoutForm.module.css";

export function Confirmation() {
  const params = useSearchParams();
  const id = params.get("order");
  const orders = useOrders();
  const hydrated = useHydrated();
  const order = orders.find((item) => item.id === id);
  const delivery = order ? getDelivery(order.delivery) : undefined;

  return (
    <div className="wrap page">
      <p className="kicker">Shop</p>
      {!hydrated ? (
        <>
          <h1>Order</h1>
          <p className="quiet">Opening the receipt…</p>
        </>
      ) : null}
      {hydrated && !order ? (
        <>
          <h1>No receipt here</h1>
          <p className={`quiet measure ${styles.intro}`}>
            That order is not saved in this browser. Receipts stay on the device that
            placed them.
          </p>
          <p className={styles.intro}>
            <Link className="btn" href="/shop">
              Back to the shop
            </Link>
          </p>
        </>
      ) : null}
      {hydrated && order ? (
        <>
          <h1>Order {order.id}</h1>
          <p className={`lede ${styles.intro}`}>Thank you. The order is saved on this device.</p>
          <p className="quiet measure">
            This is a simulated order. No payment was taken. A live shop would confirm
            the charge before this page, in the payment step marked in the code.
          </p>
          <div className={styles.layout}>
            <div className={styles.summary}>
              <h2>Receipt</h2>
              <p>
                <span>Placed</span>
                <span>{formatDate(order.createdAt.slice(0, 10))}</span>
              </p>
              <p>
                <span>Reference</span>
                <span>{order.payment.reference}</span>
              </p>
              <ul>
                {order.items.map((item) => (
                  <li key={`${item.productSlug}-${item.sizeId}`}>
                    <span>
                      {item.title}
                      <span className={styles.itemMeta}>
                        {item.sizeLabel} · {item.quantity}
                      </span>
                    </span>
                    <span>{money(item.lineCents)}</span>
                  </li>
                ))}
              </ul>
              <p>
                <span>Subtotal</span>
                <span>{money(order.subtotalCents)}</span>
              </p>
              <p>
                <span>Shipping</span>
                <span>{money(order.shippingCents)}</span>
              </p>
              <p className={styles.total}>
                <span>Total</span>
                <span>{money(order.totalCents)}</span>
              </p>
            </div>
            <div className="stack">
              <h2>Sent to</h2>
              <p>{order.name}</p>
              <p>{order.email}</p>
              <p>
                {order.address.line1}
                <br />
                {order.address.city}, {order.address.region} {order.address.postal}
                <br />
                {order.address.country}
              </p>
              <p className="quiet">{delivery?.label}</p>
              {order.note ? <p>{order.note}</p> : null}
              <Link className="btn btn-line" href="/work">
                Continue looking
              </Link>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
