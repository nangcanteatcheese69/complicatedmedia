import type { Metadata } from "next";
import Link from "next/link";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description: "complicated-media is a software engineer and an artist working in photographs, short films, and prints.",
};

export default function AboutPage() {
  return (
    <article className="wrap page">
      <p className="kicker">Studio</p>
      <h1>About</h1>
      <div className={styles.layout}>
        <div className={styles.copy}>
          <p className="lede">complicated-media makes photographs, short films, and small editions of prints.</p>
          <p>
            The day job is software. The pictures are the slower work: early walks,
            borrowed rooms, a studio table near a window. The camera usually comes out
            on the second pass, after the first walk has decided what is actually there.
          </p>
          <p>
            Prints are archival pigment on rag paper, signed and numbered. Each size is
            its own edition. Originals are printed once. The shop on this site is the
            studio counter.
          </p>
          <p>
            For a print that is not listed, write to{" "}
            <a className="text-link" href="mailto:complicated-media@example.com">
              complicated-media@example.com
            </a>
            .
          </p>
          <p>
            <Link className="text-link" href="/zine">
              Read the zine
            </Link>
          </p>
        </div>
      </div>
    </article>
  );
}
