import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { series } from "@/content/series";
import styles from "./work.module.css";

export const metadata: Metadata = {
  title: "Work",
  description: "Photographic series by Nang: coast, night market, empty rooms, and the studio.",
};

export default function WorkPage() {
  return (
    <div className="wrap page">
      <p className="kicker">Series</p>
      <h1>Work</h1>
      <p className="lede">Four series. The pictures are made slowly, mostly on foot.</p>
      <div className={styles.list}>
        {series.map((item) => {
          const cover = item.images[0];
          return (
            <Link key={item.slug} className={styles.feature} href={`/work/${item.slug}`}>
              <span className={styles.media}>
                <Image
                  src={cover.src}
                  alt=""
                  width={cover.width}
                  height={cover.height}
                  sizes="(max-width: 860px) 100vw, 60vw"
                />
              </span>
              <span className={styles.copy}>
                <span className="kicker">
                  {item.year} — {item.location}
                </span>
                <h2>{item.title}</h2>
                <span>{item.lede}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
