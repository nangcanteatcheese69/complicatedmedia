import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { series } from "@/content/series";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description: "Nang Suan Mung is a software engineer and an artist working in photographs, short films, and prints.",
};

export default function AboutPage() {
  const portrait = series[3].images[2];
  return (
    <article className="wrap page">
      <p className="kicker">Studio</p>
      <h1>About</h1>
      <div className={styles.layout}>
        <figure className={styles.portrait}>
          <Image
            src={portrait.src}
            alt={portrait.alt}
            width={portrait.width}
            height={portrait.height}
            sizes="(max-width: 860px) 100vw, 40vw"
          />
        </figure>
        <div className={styles.copy}>
          <p className="lede">Nang Suan Mung makes photographs, short films, and small editions of prints.</p>
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
            <a className="text-link" href="mailto:studio@nang.example">
              studio@nang.example
            </a>
            .
          </p>
          <p>
            <Link className="text-link" href="/work">
              See the work
            </Link>
          </p>
        </div>
      </div>
    </article>
  );
}
