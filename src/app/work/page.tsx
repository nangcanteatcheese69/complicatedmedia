import type { Metadata } from "next";
import Link from "next/link";
import { series } from "@/content/series";
import styles from "./work.module.css";

export const metadata: Metadata = {
  title: "Work",
  description: "Photographic series by complicated-media.",
};

export default function WorkPage() {
  return (
    <div className="wrap page">
      <p className="kicker">Series</p>
      <h1>Work</h1>
      {series.length === 0 ? (
        <div className={styles.empty}>
          <p className="lede">Nothing is hung yet.</p>
          <p className="quiet measure">
            New pictures will be listed here. The zine is the piece you can read now.
          </p>
          <Link className="text-link" href="/zine">
            Open the zine
          </Link>
        </div>
      ) : (
        <div className={styles.list}>
          {series.map((item) => (
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
      )}
    </div>
  );
}
