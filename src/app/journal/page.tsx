import type { Metadata } from "next";
import Link from "next/link";
import { postsByDate } from "@/content/posts";
import { formatDate, readingTime } from "@/lib/format";
import styles from "./journal.module.css";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes on process, a borrowed exhibition room, and fieldwork on the coast.",
};

export default function JournalPage() {
  const posts = postsByDate();
  return (
    <div className="wrap page">
      <p className="kicker">Notes</p>
      <h1>Journal</h1>
      <p className="lede">Process, a small exhibition, and the coast.</p>
      <ul className={styles.list}>
        {posts.map((post) => (
          <li key={post.slug}>
            <article className={styles.item}>
              <p className="kicker">
                {formatDate(post.date)} — {readingTime(post)}
              </p>
              <h2>
                <Link href={`/journal/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="measure">{post.dek}</p>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
