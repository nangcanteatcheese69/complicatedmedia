import { NextResponse } from "next/server";
import { COUNTRIES } from "@/lib/delivery";
import { settlePayment } from "@/lib/payments";
import { quoteOrder } from "@/lib/quote";
import type { FieldError, Order } from "@/lib/types";

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { errors: [{ field: "form", message: "The order could not be read." }] satisfies FieldError[] },
      { status: 400 },
    );
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { errors: [{ field: "form", message: "The order could not be read." }] satisfies FieldError[] },
      { status: 400 },
    );
  }

  const record = body as Record<string, unknown>;
  const errors: FieldError[] = [];

  const name = text(record.name);
  const email = text(record.email);
  const line1 = text(record.line1);
  const city = text(record.city);
  const region = text(record.region);
  const postal = text(record.postal);
  const country = text(record.country);
  const note = text(record.note).slice(0, 500);
  const delivery = text(record.delivery);

  if (name.length < 2) errors.push({ field: "name", message: "Enter the name for the receipt." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ field: "email", message: "Enter a valid email address." });
  }
  if (line1.length < 4) errors.push({ field: "line1", message: "Enter a street address." });
  if (city.length < 2) errors.push({ field: "city", message: "Enter a city." });
  if (region.length < 2) errors.push({ field: "region", message: "Enter a region." });
  if (postal.length < 3) errors.push({ field: "postal", message: "Enter a postal code." });
  if (!COUNTRIES.includes(country as (typeof COUNTRIES)[number])) {
    errors.push({ field: "country", message: "Choose a country." });
  }
  if (note.length > 500) errors.push({ field: "note", message: "Keep the note under 500 characters." });

  const rawItems = Array.isArray(record.items) ? record.items : [];
  const items = rawItems.flatMap((item) => {
    if (typeof item !== "object" || item === null) return [];
    const line = item as Record<string, unknown>;
    if (typeof line.productSlug !== "string" || typeof line.sizeId !== "string") return [];
    const quantity = typeof line.quantity === "number" ? line.quantity : Number.NaN;
    return [{ productSlug: line.productSlug, sizeId: line.sizeId, quantity }];
  });

  const quoted = quoteOrder({ items, delivery: delivery || null }, { requireDelivery: true });
  errors.push(...quoted.errors);

  if (errors.length || !quoted.quote || quoted.quote.delivery === null || quoted.quote.totalCents === null) {
    return NextResponse.json({ errors }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  const orderId = `complicated-media-${crypto.randomUUID().replaceAll("-", "").slice(0, 6).toUpperCase()}`;
  const payment = await settlePayment({
    orderId,
    amountCents: quoted.quote.totalCents,
  });

  const order: Order = {
    id: orderId,
    createdAt: new Date().toISOString(),
    email,
    name,
    address: { line1, city, region, postal, country },
    delivery: quoted.quote.delivery,
    note,
    items: quoted.quote.lines,
    subtotalCents: quoted.quote.subtotalCents,
    shippingCents: quoted.quote.shippingCents ?? 0,
    totalCents: quoted.quote.totalCents,
    payment,
  };

  return NextResponse.json(order, { headers: { "Cache-Control": "no-store" } });
}
