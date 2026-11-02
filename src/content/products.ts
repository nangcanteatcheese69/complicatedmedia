import { stickers } from "@/content/graphics";
import type { Product } from "@/content/types";

/** Prints, originals, and stickers. */
export const products: Product[] = stickers.map((sticker) => ({
  slug: sticker.slug,
  title: sticker.title,
  seriesSlug: "graphics",
  year: "2026",
  kind: "sticker",
  summary: `Vinyl sticker, ${sticker.dimensions}.`,
  description: `${sticker.title}. A vinyl sticker from the graphics set, ${sticker.dimensions}.`,
  image: {
    src: sticker.src,
    alt: `Sticker, ${sticker.title}`,
    width: sticker.width,
    height: sticker.height,
    caption: sticker.title,
  },
  details: [
    { label: "Format", value: "Vinyl sticker" },
    { label: "Graphics", value: "Stickers" },
  ],
  sizes: [
    {
      id: "sticker",
      label: "Sticker",
      dimensions: sticker.dimensions,
      priceCents: sticker.priceCents,
      edition: 40,
    },
  ],
}));

export function getProduct(slug: string) {
  return products.find((item) => item.slug === slug);
}

export function productsInSeries(seriesSlug: string) {
  return products.filter((item) => item.seriesSlug === seriesSlug);
}

export function fromPrice(product: Product) {
  return Math.min(...product.sizes.map((size) => size.priceCents));
}

export function productKindLabel(kind: Product["kind"]) {
  if (kind === "original") return "Original";
  if (kind === "sticker") return "Sticker";
  return "Print";
}

export function showsFromPrice(product: Product) {
  return product.kind === "print" && product.sizes.length > 1;
}
