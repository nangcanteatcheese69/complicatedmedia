import type { Product } from "@/content/types";

/** Prints and originals. Empty until a real edition is listed. */
export const products: Product[] = [];

export function getProduct(slug: string) {
  return products.find((item) => item.slug === slug);
}

export function productsInSeries(seriesSlug: string) {
  return products.filter((item) => item.seriesSlug === seriesSlug);
}

export function fromPrice(product: Product) {
  return Math.min(...product.sizes.map((size) => size.priceCents));
}
