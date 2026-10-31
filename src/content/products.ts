import type { Product } from "@/content/types";

const printDetails = (series: string, paper = "Hahnemühle Photo Rag") => [
  { label: "Medium", value: "Archival pigment print" },
  { label: "Paper", value: paper },
  { label: "Signature", value: "Signed and numbered on the verso" },
  { label: "Series", value: series },
];

export const products: Product[] = [
  {
    slug: "salt-line-plate-i",
    title: "Salt Line, plate I",
    seriesSlug: "salt-line",
    year: "2024",
    kind: "print",
    summary: "The first morning the line held still.",
    description:
      "The first morning the salt line held still long enough to measure, before the boats came in. Printed on rag paper and signed on the verso. Each size is its own small edition.",
    image: {
      src: "/media/salt-01.jpg",
      alt: "A pale grey-green sea under a hazy sky, with a thin bright line along the shore and a dark pier at the right.",
      width: 2000,
      height: 1334,
      caption: "Salt Line, plate I",
    },
    details: printDetails("Salt Line"),
    sizes: [
      { id: "small", label: "8 × 10 in", dimensions: "20 × 25 cm", priceCents: 9000, edition: 15 },
      { id: "medium", label: "11 × 14 in", dimensions: "28 × 36 cm", priceCents: 18000, edition: 12 },
      { id: "large", label: "16 × 20 in", dimensions: "41 × 51 cm", priceCents: 32000, edition: 8 },
    ],
  },
  {
    slug: "salt-line-wet-plate",
    title: "Salt Line, wet plate",
    seriesSlug: "salt-line",
    year: "2024",
    kind: "print",
    summary: "The morning the tide erased the line.",
    description:
      "Later that week the tide came over the line and left the sand as one dark plate. Same paper, same signing, a shorter edition. The picture is mostly water.",
    image: {
      src: "/media/salt-03.jpg",
      alt: "A narrow band of pale sky over a wide field of dark, reflective water.",
      width: 2000,
      height: 1250,
      caption: "Salt Line, wet plate",
    },
    details: printDetails("Salt Line"),
    sizes: [
      { id: "small", label: "8 × 10 in", dimensions: "20 × 25 cm", priceCents: 9000, edition: 12 },
      { id: "medium", label: "11 × 14 in", dimensions: "28 × 36 cm", priceCents: 18000, edition: 10 },
      { id: "large", label: "16 × 20 in", dimensions: "41 × 51 cm", priceCents: 32000, edition: 6 },
    ],
  },
  {
    slug: "stall-rented-light",
    title: "Stall, rented light",
    seriesSlug: "night-market-geometry",
    year: "2023",
    kind: "print",
    summary: "Half an hour after the generators start.",
    description:
      "Half an hour after the generators start, the aisle is still mostly empty and the bulb is doing all the work. Printed warm, so the night stays brown rather than blue.",
    image: {
      src: "/media/market-01.jpg",
      alt: "A dark stall interior lit by one warm bulb, with horizontal bands of amber light where the shelves are.",
      width: 1500,
      height: 1900,
      caption: "Stall, rented light",
    },
    details: printDetails("Night Market Geometry"),
    sizes: [
      { id: "small", label: "8 × 10 in", dimensions: "20 × 25 cm", priceCents: 9000, edition: 15 },
      { id: "medium", label: "11 × 14 in", dimensions: "28 × 36 cm", priceCents: 18000, edition: 12 },
      { id: "large", label: "16 × 20 in", dimensions: "41 × 51 cm", priceCents: 32000, edition: 8 },
    ],
  },
  {
    slug: "room-one-window",
    title: "Room, one window",
    seriesSlug: "rooms-without-furniture",
    year: "2022",
    kind: "print",
    summary: "Sun on the floor the afternoon the furniture left.",
    description:
      "Made in a rented room the afternoon the furniture left. The sun lasted about forty minutes on that patch of floor. The edition is small because the negative is unforgiving in the highlights.",
    image: {
      src: "/media/room-01.jpg",
      alt: "An empty plaster room with one bright window and a trapezoid of sun across the floor.",
      width: 1600,
      height: 2000,
      caption: "Room, one window",
    },
    details: printDetails("Rooms Without Furniture"),
    sizes: [
      { id: "small", label: "8 × 10 in", dimensions: "20 × 25 cm", priceCents: 11000, edition: 10 },
      { id: "medium", label: "11 × 14 in", dimensions: "28 × 36 cm", priceCents: 22000, edition: 8 },
      { id: "large", label: "16 × 20 in", dimensions: "41 × 51 cm", priceCents: 38000, edition: 5 },
    ],
  },
  {
    slug: "paper-stack",
    title: "Paper stack",
    seriesSlug: "paper-ink-weather",
    year: "2025",
    kind: "original",
    summary: "One print. The stack kept the warp from the rain.",
    description:
      "A unique print, not an edition. The stack sat in the studio window through an afternoon storm and kept the warp. Printed once, signed, and not repeated.",
    image: {
      src: "/media/studio-01.jpg",
      alt: "A stack of pale sheets on a wooden table, with window light falling from the left.",
      width: 1800,
      height: 1450,
      caption: "Paper stack",
    },
    details: [
      { label: "Medium", value: "Unique pigment print" },
      { label: "Paper", value: "Hahnemühle Photo Rag" },
      { label: "Signature", value: "Signed on the verso" },
      { label: "Series", value: "Paper, Ink, Weather" },
    ],
    sizes: [
      {
        id: "unique",
        label: "16 × 20 in",
        dimensions: "41 × 51 cm",
        priceCents: 140000,
        edition: 1,
      },
    ],
  },
  {
    slug: "proofs-on-the-line",
    title: "Proofs on the line",
    seriesSlug: "paper-ink-weather",
    year: "2025",
    kind: "print",
    summary: "Four proofs, the afternoon the air dried out.",
    description:
      "Four proofs from the studio series, hanging the afternoon the humidity finally dropped. The photograph is of the drying, not of a finished wall.",
    image: {
      src: "/media/studio-02.jpg",
      alt: "Four pale prints hanging from a line against a dim studio wall.",
      width: 2000,
      height: 1400,
      caption: "Proofs on the line",
    },
    details: printDetails("Paper, Ink, Weather"),
    sizes: [
      { id: "small", label: "8 × 10 in", dimensions: "20 × 25 cm", priceCents: 9000, edition: 8 },
      { id: "medium", label: "11 × 14 in", dimensions: "28 × 36 cm", priceCents: 18000, edition: 6 },
      { id: "large", label: "16 × 20 in", dimensions: "41 × 51 cm", priceCents: 32000, edition: 4 },
    ],
  },
];

export function getProduct(slug: string) {
  return products.find((item) => item.slug === slug);
}

export function productsInSeries(seriesSlug: string) {
  return products.filter((item) => item.seriesSlug === seriesSlug);
}

export function fromPrice(product: Product) {
  return Math.min(...product.sizes.map((size) => size.priceCents));
}
