# complicated-media

A studio site for photographs, short films, and prints by complicated-media.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run typecheck
npm run build
npm start
```

## Content

- Journal, shop, and film data: `src/content/`
- Zine pages: `public/zine/` (`/zine` turns them)
- Logo: `public/logo.png` (transparent mark)

## Checkout

Checkout is simulated. No card is collected and no payment provider is called. The receipt is saved in the browser.

Stripe (or a similar provider) plugs in at `src/lib/payments.ts`, called from `src/app/api/checkout/route.ts`. Prices are computed on the server in `src/lib/quote.ts`.
