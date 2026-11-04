export type Sticker = {
  slug: string;
  title: string;
  src: string;
  width: number;
  height: number;
  priceCents: number;
  dimensions: string;
};

/** Sticker art. Files live in public/graphics/. Order here is the Work and shop order. */
export const stickers: Sticker[] = [
  {
    slug: "be-brave-try-everything",
    title: "Be brave, try everything",
    src: "/graphics/be-brave-try-everything.png",
    width: 5921,
    height: 5921,
    priceCents: 600,
    dimensions: "3 × 3 in",
  },
  {
    slug: "beautiful-souls",
    title: "Beautiful souls",
    src: "/graphics/beautiful-souls.png",
    width: 1080,
    height: 1080,
    priceCents: 600,
    dimensions: "3 × 3 in",
  },
  {
    slug: "bloom-in-your-own-time",
    title: "Bloom in your own time",
    src: "/graphics/bloom-in-your-own-time.png",
    width: 1244,
    height: 680,
    priceCents: 800,
    dimensions: "4 × 2 in",
  },
  {
    slug: "bright-ideas",
    title: "Bright ideas",
    src: "/graphics/bright-ideas.png",
    width: 3645,
    height: 3645,
    priceCents: 600,
    dimensions: "3 × 3 in",
  },
  {
    slug: "i-feel-the-bpm",
    title: "I feel the bpm",
    src: "/graphics/i-feel-the-bpm.png",
    width: 4358,
    height: 3023,
    priceCents: 800,
    dimensions: "4 × 3 in",
  },
  {
    slug: "i-miss-being-a-kid",
    title: "I miss being a kid",
    src: "/graphics/i-miss-being-a-kid.png",
    width: 1080,
    height: 1080,
    priceCents: 600,
    dimensions: "3 × 3 in",
  },
  {
    slug: "seeing-it-all-again",
    title: "I'm seeing it all again, just with a different perspective",
    src: "/graphics/seeing-it-all-again.png",
    width: 4358,
    height: 3023,
    priceCents: 800,
    dimensions: "4 × 3 in",
  },
  {
    slug: "i-wish-i-was-a-fairy",
    title: "I wish I was a fairy",
    src: "/graphics/i-wish-i-was-a-fairy.png",
    width: 2048,
    height: 2048,
    priceCents: 600,
    dimensions: "3 × 3 in",
  },
  {
    slug: "keep-it-whimsy",
    title: "Keep it whimsy",
    src: "/graphics/keep-it-whimsy.png",
    width: 2048,
    height: 2048,
    priceCents: 600,
    dimensions: "3 × 3 in",
  },
  {
    slug: "malatang",
    title: "Malatang",
    src: "/graphics/malatang.png",
    width: 2417,
    height: 2417,
    priceCents: 600,
    dimensions: "3 × 3 in",
  },
  {
    slug: "perspective-is-everything",
    title: "Perspective is everything",
    src: "/graphics/perspective-is-everything.png",
    width: 2048,
    height: 2048,
    priceCents: 600,
    dimensions: "3 × 3 in",
  },
  {
    slug: "what-is-forever-for",
    title: "What is forever for",
    src: "/graphics/what-is-forever-for.png",
    width: 3226,
    height: 2160,
    priceCents: 800,
    dimensions: "4 × 3 in",
  },
];
