"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { COUNTRIES, DELIVERIES } from "@/lib/delivery";
import { money } from "@/lib/format";
import { quoteOrder } from "@/lib/quote";
import { saveOrder, useCart, useHydrated } from "@/lib/storage";
import type { FieldError, Order } from "@/lib/types";
import styles from "./CheckoutForm.module.css";

type Fields = {
  name: string;
  email: string;
  line1: string;
  city: string;
  region: string;
  postal: string;
  country: string;
  note: string;
};

const empty: Fields = {
  name: "",
  email: "",
  line1: "",
  city: "",
  region: "",
  postal: "",
  country: "",
  note: "",
};

function mapErrors(errors: FieldError[]) {
  const map: Record<string, string> = {};
  for (const error of errors) {
    if (!map[error.field]) map[error.field] = error.message;
  }
  return map;
}

export function CheckoutForm() {
  const router = useRouter();
  const lines = useCart();
  const hydrated = useHydrated();
  const [fields, setFields] = useState<Fields>(empty);
  const [delivery, setDelivery] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const preview = quoteOrder({ items: lines, delivery: delivery || null });
  const quote = preview.quote;

  function setField(key: keyof Fields, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setFormError(null);
    setErrors({});
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          delivery,
          items: lines,
        }),
      });
      const payload: unknown = await response.json();
      if (!response.ok) {
        const record = payload as { errors?: FieldError[] };
        const next = mapErrors(record.errors ?? []);
        setErrors(next);
        const first = Object.keys(next)[0];
        if (first) document.getElementById(first)?.focus();
        setPending(false);
        return;
      }
      const order = payload as Order;
      saveOrder(order);
      router.push(`/checkout/confirmation?order=${encodeURIComponent(order.id)}`);
    } catch {
      setFormError("The order could not be placed. Nothing was saved.");
      setPending(false);
    }
  }

  return (
    <div className="wrap page">
      <p className="kicker">Shop</p>
      <h1>Checkout</h1>
      <p className={`quiet ${styles.intro}`}>
        No card is collected. Placing the order simulates a paid checkout and saves the
        receipt in this browser.
      </p>

      {!hydrated ? <p className="quiet">Preparing checkout…</p> : null}

      {hydrated && lines.length === 0 ? (
        <div className={styles.empty}>
          <p>The cart is empty.</p>
          <Link className="btn" href="/shop">
            Browse prints
          </Link>
        </div>
      ) : null}

      {hydrated && lines.length > 0 ? (
        <form className={styles.layout} onSubmit={onSubmit} noValidate>
          <div className={styles.form}>
            {Object.keys(errors).length > 0 ? (
              <div className={styles.alert} role="alert">
                <p>Please check the form.</p>
                <ul>
                  {Object.entries(errors).map(([field, message]) => (
                    <li key={field}>{message}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {formError ? (
              <p className={styles.alert} role="alert">
                {formError}
              </p>
            ) : null}

            <div className={styles.fields}>
              <Field
                id="name"
                label="Name"
                autoComplete="name"
                value={fields.name}
                error={errors.name}
                onChange={(value) => setField("name", value)}
              />
              <Field
                id="email"
                label="Email"
                type="email"
                autoComplete="email"
                value={fields.email}
                error={errors.email}
                onChange={(value) => setField("email", value)}
              />
              <Field
                id="line1"
                label="Address"
                autoComplete="address-line1"
                value={fields.line1}
                error={errors.line1}
                onChange={(value) => setField("line1", value)}
              />
              <Field
                id="city"
                label="City"
                autoComplete="address-level2"
                value={fields.city}
                error={errors.city}
                onChange={(value) => setField("city", value)}
              />
              <div className={styles.pair}>
                <Field
                  id="region"
                  label="Region"
                  autoComplete="address-level1"
                  value={fields.region}
                  error={errors.region}
                  onChange={(value) => setField("region", value)}
                />
                <Field
                  id="postal"
                  label="Postal code"
                  autoComplete="postal-code"
                  value={fields.postal}
                  error={errors.postal}
                  onChange={(value) => setField("postal", value)}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  value={fields.country}
                  aria-invalid={errors.country ? true : undefined}
                  aria-describedby={errors.country ? "country-error" : undefined}
                  onChange={(event) => setField("country", event.target.value)}
                >
                  <option value="">Select a country</option>
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                {errors.country ? (
                  <p id="country-error" className={styles.error}>
                    {errors.country}
                  </p>
                ) : null}
              </div>
            </div>

            <fieldset className={styles.delivery}>
              <legend className="kicker">Delivery</legend>
              {DELIVERIES.map((option) => (
                <label key={option.id} className={styles.option}>
                  <input
                    type="radio"
                    name="delivery"
                    value={option.id}
                    checked={delivery === option.id}
                    onChange={() => setDelivery(option.id)}
                  />
                  <span>
                    <span className={styles.optionLabel}>{option.label}</span>
                    <span className={styles.optionDetail}>{option.detail}</span>
                  </span>
                  <span>{option.cents === 0 ? "Free" : money(option.cents)}</span>
                </label>
              ))}
              {errors.delivery ? <p className={styles.error}>{errors.delivery}</p> : null}
            </fieldset>

            <div className={styles.field}>
              <label htmlFor="note">Note</label>
              <textarea
                id="note"
                name="note"
                rows={3}
                value={fields.note}
                onChange={(event) => setField("note", event.target.value)}
              />
              <p className={styles.hint}>Optional. A dedication, or a time for pickup.</p>
            </div>

            <button className="btn" type="submit" disabled={pending} aria-busy={pending}>
              {pending ? "Placing order…" : "Place order"}
            </button>
          </div>

          <aside className={styles.summary} aria-label="Order summary">
            <h2>Your order</h2>
            <ul>
              {quote?.lines.map((item) => (
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
              <span>{quote ? money(quote.subtotalCents) : "—"}</span>
            </p>
            <p>
              <span>Shipping</span>
              <span>{quote?.shippingCents === null || quote?.shippingCents === undefined ? "—" : money(quote.shippingCents)}</span>
            </p>
            <p className={styles.total}>
              <span>Total</span>
              <span>{quote?.totalCents === null || quote?.totalCents === undefined ? "—" : money(quote.totalCents)}</span>
            </p>
            {errors.items ? <p className={styles.error}>{errors.items}</p> : null}
          </aside>
        </form>
      ) : null}
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
