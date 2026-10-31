import type { VideoWork } from "@/content/types";

/**
 * Short films.
 * Each entry can play a local mp4 (`src`) or, if `src` is omitted, the poster.
 * Posters and loops live in public/media/reels. To add a film, drop the file
 * in that folder and point `src` at it. Set `silent` to false when the file
 * has sound — the player stays muted until the visitor asks for it.
 */
export const videos: VideoWork[] = [
  {
    slug: "tide-study",
    title: "Tide study",
    year: "2024",
    duration: "0:05",
    caption: "The salt line, held for a few seconds longer than the eye keeps it.",
    poster: "/media/reels/tide-study.jpg",
    posterAlt: "A slow vertical study of wet sand in bands of bone and grey.",
    src: "/media/reels/tide-study.mp4",
    silent: true,
    width: 720,
    height: 1280,
  },
  {
    slug: "stall-light",
    title: "Stall light",
    year: "2023",
    duration: "0:05",
    caption: "One bulb, rented, doing the work of a room.",
    poster: "/media/reels/stall-light.jpg",
    posterAlt: "A vertical study of a dark stall and a single warm light.",
    src: "/media/reels/stall-light.mp4",
    silent: true,
    width: 720,
    height: 1280,
  },
  {
    slug: "one-window",
    title: "One window",
    year: "2022",
    duration: "0:05",
    caption: "Sun crossing an empty floor. The furniture had already gone.",
    poster: "/media/reels/one-window.jpg",
    posterAlt: "A vertical study of window light on the floor of an empty room.",
    src: "/media/reels/one-window.mp4",
    silent: true,
    width: 720,
    height: 1280,
  },
  {
    slug: "proofs-drying",
    title: "Proofs drying",
    year: "2025",
    duration: "0:05",
    caption: "Four sheets on a line, the afternoon the humidity dropped.",
    poster: "/media/reels/proofs-drying.jpg",
    posterAlt: "A vertical study of pale prints hanging in a dim studio.",
    src: "/media/reels/proofs-drying.mp4",
    silent: true,
    width: 720,
    height: 1280,
  },
  {
    slug: "alley-lamp",
    title: "Alley lamp",
    year: "2023",
    duration: "0:05",
    caption: "The gap between two stalls, which is also a kind of room.",
    poster: "/media/reels/alley-lamp.jpg",
    posterAlt: "A vertical study of a narrow shaft of warm light in a dark alley.",
    src: "/media/reels/alley-lamp.mp4",
    silent: true,
    width: 720,
    height: 1280,
  },
];
