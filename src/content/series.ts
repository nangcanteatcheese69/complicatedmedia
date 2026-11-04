import { stickers } from "@/content/graphics";
import type { Series } from "@/content/types";

/** Photographic series, plus the graphics sticker set. */
export const series: Series[] = [
  {
    slug: "graphics",
    title: "Graphics",
    year: "2026",
    location: "Stickers",
    lede: "Twelve stickers. Words, flowers, and a bowl of malatang.",
    statement: [
      "Drawn and lettered as stickers. Each one is also on the shop, in a small vinyl run.",
    ],
    images: stickers.map((sticker) => ({
      src: sticker.src,
      alt: `Sticker, ${sticker.title}`,
      width: sticker.width,
      height: sticker.height,
      caption: sticker.title,
    })),
  },
];

export function getSeries(slug: string) {
  return series.find((item) => item.slug === slug);
}
