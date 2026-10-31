import type { DeliveryId } from "@/lib/delivery";

export type CartLine = {
  productSlug: string;
  sizeId: string;
  quantity: number;
};

export type OrderItem = {
  productSlug: string;
  title: string;
  kind: "print" | "original";
  sizeId: string;
  sizeLabel: string;
  quantity: number;
  unitCents: number;
  lineCents: number;
};

export type Order = {
  id: string;
  createdAt: string;
  email: string;
  name: string;
  address: {
    line1: string;
    city: string;
    region: string;
    postal: string;
    country: string;
  };
  delivery: DeliveryId;
  note: string;
  items: OrderItem[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  payment: {
    provider: "simulated";
    status: "paid";
    reference: string;
  };
};

export type FieldError = {
  field: string;
  message: string;
};
