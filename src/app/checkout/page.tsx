import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Simulated checkout for prints and originals. No payment is taken.",
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
