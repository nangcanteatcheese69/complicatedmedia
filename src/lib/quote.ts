import { getProduct } from "@/content/products";
import { getDelivery, type DeliveryId } from "@/lib/delivery";
import type { FieldError, OrderItem } from "@/lib/types";

export type Quote = {
  lines: OrderItem[];
  subtotalCents: number;
  shippingCents: number | null;
  totalCents: number | null;
  delivery: DeliveryId | null;
};

export function quoteOrder(
  input: {
    items: { productSlug: string; sizeId: string; quantity: number }[];
    delivery: string | null;
  },
  options?: { requireDelivery?: boolean },
): { quote: Quote | null; errors: FieldError[] } {
  const errors: FieldError[] = [];
  const lines: OrderItem[] = [];

  if (!input.items.length) {
    errors.push({ field: "items", message: "The cart is empty." });
  }

  input.items.forEach((item, index) => {
    const product = getProduct(item.productSlug);
    if (!product) {
      errors.push({
        field: `items.${index}`,
        message: "A work in the cart is no longer listed.",
      });
      return;
    }
    const size = product.sizes.find((option) => option.id === item.sizeId);
    if (!size) {
      errors.push({
        field: `items.${index}`,
        message: `Choose a size for ${product.title}.`,
      });
      return;
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 8) {
      errors.push({
        field: `items.${index}`,
        message: `Quantity for ${product.title} must be between 1 and 8.`,
      });
      return;
    }
    lines.push({
      productSlug: product.slug,
      title: product.title,
      kind: product.kind,
      sizeId: size.id,
      sizeLabel: `${size.label} · ${size.dimensions}`,
      quantity: item.quantity,
      unitCents: size.priceCents,
      lineCents: size.priceCents * item.quantity,
    });
  });

  let delivery: DeliveryId | null = null;
  let shippingCents: number | null = null;
  if (input.delivery) {
    const chosen = getDelivery(input.delivery);
    if (!chosen) {
      errors.push({ field: "delivery", message: "Choose a delivery method." });
    } else {
      delivery = chosen.id;
      shippingCents = chosen.cents;
    }
  } else if (options?.requireDelivery) {
    errors.push({ field: "delivery", message: "Choose a delivery method." });
  }

  if (errors.length) return { quote: null, errors };

  const subtotalCents = lines.reduce((sum, line) => sum + line.lineCents, 0);
  return {
    quote: {
      lines,
      subtotalCents,
      shippingCents,
      totalCents: shippingCents === null ? null : subtotalCents + shippingCents,
      delivery,
    },
    errors: [],
  };
}
