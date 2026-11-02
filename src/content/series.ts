import type { Series } from "@/content/types";

/** Photographic series. Empty until real pictures are added. */
export const series: Series[] = [];

export function getSeries(slug: string) {
  return series.find((item) => item.slug === slug);
}
