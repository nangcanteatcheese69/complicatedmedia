import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = {
  title: "Cart",
  description: "Prints and originals waiting to be checked out.",
};

export default function CartPage() {
  return <CartView />;
}
