import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { stickers } from "@/content/graphics";
import { series } from "@/content/series";
import styles from "./work.module.css";

export const metadata: Metadata = {
  title: "Work",
  description: "Stickers and photographic series by complicated-media.",
};

export default function WorkPage() {
  const photographs = series.filter((item) => item.slug !== "graphics");

  return (
    <div className="wrap page">
      <p className="kicker">Studio</p>
      <h1>Work</h1>

      <section className={styles.graphics} aria-labelledby="graphics-title">
        <div className={styles.graphicsHead}>
          <p className="kicker">Work</p>
          <h2 id="graphics-title">Graphics</h2>
          <p className="measure">
            Twelve stickers. Open the set, or go straight to a sticker in the shop.
          </p>
          <Link className="text-link" href="/work/graphics">
            Open the set
          </Link>
        </div>
        <ul className={styles.stickerGrid}>
          {stickers.map((sticker) => (
            <li key={sticker.slug}>
              <Link className={styles.sticker} href={`/shop/${sticker.slug}`}>
                <Image
                  src={sticker.src}
                  alt={`Sticker, ${sticker.title}`}
                  width={sticker.width}
                  height={sticker.height}
                  sizes="(max-width: 720px) 45vw, 220px"
                />
                <span>{sticker.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {photographs.length > 0 ? (
        <div className={styles.list}>
          {photographs.map((item) => (
            <Link key={item.slug} className={styles.feature} href={`/work/${item.slug}`}>
              <span className={styles.copy}>
                <span className="kicker">
                  {item.year} — {item.location}
                </span>
                <h2>{item.title}</h2>
                <span>{item.lede}</span>
              </span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
