import type { Metadata } from "next";
import { Suspense } from "react";
import { Confirmation } from "@/components/Confirmation";

export const metadata: Metadata = {
  title: "Order",
  description: "Simulated order receipt, saved in this browser.",
};

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="wrap page">
          <p className="kicker">Shop</p>
          <h1>Order</h1>
          <p className="quiet">Opening the receipt…</p>
        </div>
      }
    >
      <Confirmation />
    </Suspense>
  );
}
