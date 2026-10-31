export type Plate = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
};

export type Series = {
  slug: string;
  title: string;
  year: string;
  location: string;
  lede: string;
  statement: string[];
  images: Plate[];
};

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | {
      type: "figure";
      src: string;
      alt: string;
      caption: string;
      width: number;
      height: number;
    };

export type Post = {
  slug: string;
  title: string;
  date: string;
  dek: string;
  seriesSlug?: string;
  blocks: Block[];
};

export type VideoWork = {
  slug: string;
  title: string;
  year: string;
  duration: string;
  caption: string;
  poster: string;
  posterAlt: string;
  /**
   * Public path to an mp4. Leave unset to play the poster as a still study.
   * Drop a file in public/media/reels and set this to its path.
   */
  src?: string;
  /** Sample studies are silent. Set false when the file has a soundtrack. */
  silent: boolean;
  width: number;
  height: number;
};

export type SizeOption = {
  id: string;
  label: string;
  dimensions: string;
  priceCents: number;
  edition: number;
};

export type Product = {
  slug: string;
  title: string;
  seriesSlug: string;
  year: string;
  kind: "print" | "original";
  summary: string;
  description: string;
  image: Plate;
  details: { label: string; value: string }[];
  sizes: SizeOption[];
};
