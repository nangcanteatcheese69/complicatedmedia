/**
 * Payment boundary for the shop.
 *
 * Valid orders are settled locally. No card data is collected and no
 * payment provider is called.
 *
 * To plug in Stripe later:
 * 1. Install `stripe` and set STRIPE_SECRET_KEY on the server only.
 *    Never prefix the secret with NEXT_PUBLIC_.
 * 2. Replace the body of `settlePayment` with a PaymentIntent (or a
 *    Checkout Session) created for `amountCents` and `orderId`.
 * 3. Confirm the payment on a webhook — `payment_intent.succeeded` or
 *    `checkout.session.completed` — before recording the order as paid.
 * 4. Collect card details with Stripe Elements or Checkout. Do not post
 *    card numbers to /api/checkout.
 * 5. Keep using `quoteOrder` so the amount charged is the amount the
 *    server computed, not a price sent by the browser.
 */
export type PaymentResult = {
  provider: "simulated";
  status: "paid";
  reference: string;
};

export async function settlePayment(input: {
  orderId: string;
  amountCents: number;
}): Promise<PaymentResult> {
  if (!Number.isInteger(input.amountCents) || input.amountCents < 0) {
    throw new Error("Amount must be zero or more.");
  }

  // Simulated settlement. There is intentionally no network request.
  // Replace this return with the Stripe call described above.
  return {
    provider: "simulated",
    status: "paid",
    reference: `sim_${input.orderId}`,
  };
}
