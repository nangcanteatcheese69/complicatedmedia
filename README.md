# Nang

A studio site for photographs, short films, and prints by Nang Suan Mung.

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

## Sample content

- Series, journal, films, and shop data: `src/content/`
- Plates: `public/media/`
- Silent reel loops and posters: `public/media/reels/`

`npm run plates` rebuilds the plates and loops (needs `sharp` and `ffmpeg`). To use a real film, drop an mp4 in `public/media/reels` and set `src` on the entry in `src/content/videos.ts`.

## Checkout

Checkout is simulated. No card is collected and no payment provider is called. The receipt is saved in the browser.

Stripe (or a similar provider) plugs in at `src/lib/payments.ts`, called from `src/app/api/checkout/route.ts`. Prices are computed on the server in `src/lib/quote.ts`.
