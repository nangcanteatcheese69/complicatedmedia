import type { Series } from "@/content/types";

export const series: Series[] = [
  {
    slug: "salt-line",
    title: "Salt Line",
    year: "2024",
    location: "Tanintharyi coast",
    lede: "Nine days on the same four kilometers of shore.",
    statement: [
      "The tide here is a worker. It draws a line of salt, takes it back, and draws it again a little higher or a little nowhere. I walked the same four kilometers for nine days, early and late, and photographed the line as if it were a measurement.",
      "The nets and the boats stay at the edges. The subject is the mark the water leaves when the work is out of the frame.",
    ],
    images: [
      {
        src: "/media/salt-01.jpg",
        alt: "A pale grey-green sea under a hazy sky, with a thin bright line along the shore and a dark pier at the right.",
        width: 2000,
        height: 1334,
        caption: "First line, before the nets",
      },
      {
        src: "/media/salt-02.jpg",
        alt: "Vertical bands of wet sand in bone, grey, and muted green, crossed by a thin pale line.",
        width: 1400,
        height: 1800,
        caption: "Sand, after the turn",
      },
      {
        src: "/media/salt-03.jpg",
        alt: "A narrow band of pale sky over a wide field of dark, reflective water.",
        width: 2000,
        height: 1250,
        caption: "The morning the line disappeared",
      },
      {
        src: "/media/salt-04.jpg",
        alt: "Soft horizontal bands of foam and shallow water, nearly white on warm grey.",
        width: 1800,
        height: 1500,
        caption: "Foam, staying",
      },
    ],
  },
  {
    slug: "night-market-geometry",
    title: "Night Market Geometry",
    year: "2023",
    location: "Yangon",
    lede: "Rooms with no walls, after the generators start.",
    statement: [
      "After the generators start, the market becomes rooms with no walls. Light is rented by the bulb. I was after the intervals: the dark gap between two stalls, the plastic sheet that turns rain into a lens, the stool that stays empty because someone is busy.",
      "Nothing in these pictures is arranged. The geometry was already there, doing its job.",
    ],
    images: [
      {
        src: "/media/market-01.jpg",
        alt: "A dark stall interior lit by one warm bulb, with horizontal bands of amber light where the shelves are.",
        width: 1500,
        height: 1900,
        caption: "Rented light",
      },
      {
        src: "/media/market-02.jpg",
        alt: "Night rain streaking across a wide pool of tungsten light.",
        width: 1900,
        height: 1400,
        caption: "Rain on the sheet",
      },
      {
        src: "/media/market-03.jpg",
        alt: "Several warm lamps seen from above against a nearly black ground.",
        width: 1700,
        height: 1700,
        caption: "Lamps, from above",
      },
      {
        src: "/media/market-04.jpg",
        alt: "A narrow vertical shaft of warm light between dark walls, ending in a small lamp.",
        width: 1400,
        height: 1860,
        caption: "The gap between stalls",
      },
    ],
  },
  {
    slug: "rooms-without-furniture",
    title: "Rooms Without Furniture",
    year: "2022",
    location: "Various interiors",
    lede: "The hour after someone leaves, or the hour before someone arrives.",
    statement: [
      "A room is more honest in the hour after someone moves out, or the hour before someone moves in. I asked for twenty minutes in places that were between lives. What stays is light, scuff, the height of a window, the size of a day on the floor.",
      "I did not move objects. There were almost none left to move.",
    ],
    images: [
      {
        src: "/media/room-01.jpg",
        alt: "An empty plaster room with one bright window and a trapezoid of sun across the floor.",
        width: 1600,
        height: 2000,
        caption: "One window, the hour after",
      },
      {
        src: "/media/room-02.jpg",
        alt: "A view through a doorway into a brighter empty room, with a rectangle of window light beyond.",
        width: 2000,
        height: 1400,
        caption: "Looking through",
      },
      {
        src: "/media/room-03.jpg",
        alt: "A bare warm-grey wall with a single small dark mark and its soft shadow.",
        width: 1500,
        height: 1900,
        caption: "What the nail left",
      },
      {
        src: "/media/room-04.jpg",
        alt: "A tall pale curtain of light against a dimmer wall, edged by a darker frame.",
        width: 2000,
        height: 1500,
        caption: "Curtain",
      },
    ],
  },
  {
    slug: "paper-ink-weather",
    title: "Paper, Ink, Weather",
    year: "2025",
    location: "Studio",
    lede: "Prints dry differently when the rain starts.",
    statement: [
      "Some pictures never leave the studio. Paper reacts to the monsoon. Ink sits up on the tooth. A print that looked finished at noon can go dull when the rain starts. This series is that weather.",
      "A few of the plates became the editions in the shop. Others were only a record of a day the window was better than I was.",
    ],
    images: [
      {
        src: "/media/studio-01.jpg",
        alt: "A stack of pale sheets on a wooden table, with window light falling from the left.",
        width: 1800,
        height: 1450,
        caption: "Stack, left in the weather",
      },
      {
        src: "/media/studio-02.jpg",
        alt: "Four pale prints hanging from a line against a dim studio wall.",
        width: 2000,
        height: 1400,
        caption: "Proofs on the line",
      },
      {
        src: "/media/studio-03.jpg",
        alt: "A bright studio window above a dark oval dish and a brush on the table.",
        width: 1500,
        height: 1850,
        caption: "Ink, and the window",
      },
      {
        src: "/media/studio-04.jpg",
        alt: "A studio window covered with soft drops of rain, framed in dark wood.",
        width: 1800,
        height: 1400,
        caption: "Rain on the studio glass",
      },
    ],
  },
];

export function getSeries(slug: string) {
  return series.find((item) => item.slug === slug);
}
