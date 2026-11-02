import Image from "next/image";
import Link from "next/link";
import { postsByDate } from "@/content/posts";
import { zine } from "@/content/zine";
import { formatDate } from "@/lib/format";
import styles from "./page.module.css";

export default function HomePage() {
  const essay = postsByDate()[0];
  const cover = zine.pages[0];

  return (
    <>
      <section className={`wrap page ${styles.hero}`}>
        <p className="kicker">Studio</p>
        <h1>
          Photographs, <em>short films,</em> and prints.
        </h1>
        <p className={styles.dek}>
          complicated-media. The work on the table is {zine.title}.
        </p>
      </section>

      <section className={`wrap ${styles.zine}`} aria-labelledby="zine-title">
        <Link className={styles.cover} href="/zine">
          <Image
            src={cover.src}
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            priority
            sizes="(max-width: 720px) 70vw, 280px"
          />
        </Link>
        <div className={styles.journal}>
          <p className="kicker">Zine</p>
          <h2 id="zine-title">{zine.title}</h2>
          <p className="measure">{zine.dek}</p>
          <Link className="text-link" href="/zine">
            Turn the pages
          </Link>
        </div>
      </section>

      {essay ? (
        <section className={`wrap ${styles.journalBlock}`} aria-labelledby="journal-title">
          <p className="kicker">Journal — {formatDate(essay.date)}</p>
          <h2 id="journal-title">{essay.title}</h2>
          <p className="measure">{essay.dek}</p>
          <Link className="text-link" href={`/journal/${essay.slug}`}>
            Read the note
          </Link>
        </section>
      ) : null}
    </>
  );
}
