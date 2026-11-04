export type ZinePage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

const width = 1191;
const height = 1684;
const count = 52;

export const zine = {
  title: "conversations of the 20s",
  dek: "Conversations with people in their twenties, photographed and bound as a zine.",
  pages: Array.from({ length: count }, (_, index) => {
    const number = index + 1;
    return {
      src: `/zine/${String(number).padStart(2, "0")}.jpg`,
      alt: `Page ${number} of conversations of the 20s`,
      width,
      height,
    };
  }),
};
