import Image from "next/image";
import Link from "next/link";
import { postsByDate } from "@/content/posts";
import { fromPrice, products } from "@/content/products";
import { series } from "@/content/series";
import { videos } from "@/content/videos";
import { formatDate, money } from "@/lib/format";
import styles from "./page.module.css";

export default function HomePage() {
  const featured = series[0];
  const cover = featured.images[0];
  const essay = postsByDate()[0];
  const film = videos[0];
  const shelf = [products[0], products[4]];

  return (
    <>
      <section className={`wrap page ${styles.hero}`}>
        <p className="kicker">Studio</p>
        <h1>
          Photographs, <em>short films,</em> and prints.
        </h1>
        <p className={styles.dek}>
          Nang Suan Mung. Pictures from the coast, the night market, empty rooms, and the
          table where they are printed.
        </p>
      </section>

      <figure className={styles.heroFrame}>
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </figure>

      <div className={`wrap ${styles.feature}`}>
        <p className="kicker">
          01 — {featured.year} — {featured.location}
        </p>
        <h2>{featured.title}</h2>
        <p className="measure">{featured.lede}</p>
        <Link className="text-link" href={`/work/${featured.slug}`}>
          View the series
        </Link>
      </div>

      <section className={`wrap ${styles.index}`} aria-labelledby="index-title">
        <h2 id="index-title" className={styles.indexTitle}>
          Index
        </h2>
        <ol className={styles.rows}>
          {series.map((item, index) => (
            <li key={item.slug}>
              <Link className={styles.row} href={`/work/${item.slug}`}>
                <span className={styles.num}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.name}>{item.title}</span>
                <span className={styles.year}>{item.year}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <div className={`wrap ${styles.split}`}>
        <section className={styles.journal} aria-labelledby="journal-title">
          <p className="kicker">Journal — {formatDate(essay.date)}</p>
          <h2 id="journal-title">{essay.title}</h2>
          <p className="measure">{essay.dek}</p>
          <Link className="text-link" href={`/journal/${essay.slug}`}>
            Read the note
          </Link>
        </section>
        <section aria-labelledby="films-title">
          <p className="kicker">Reels</p>
          <h2 id="films-title" className="sr-only">
            Short films
          </h2>
          <Link className={styles.films} href={`/reels#${film.slug}`}>
            <span className={styles.poster}>
              <Image
                src={film.poster}
                alt={film.posterAlt}
                fill
                sizes="220px"
                style={{ objectFit: "cover" }}
              />
            </span>
            <span>
              <span className={styles.name}>{film.title}</span>
              <span className={`quiet ${styles.dek}`}>
                {film.duration} · {film.caption}
              </span>
            </span>
          </Link>
        </section>
      </div>

      <section className={`wrap ${styles.shop}`} aria-labelledby="shop-title">
        <div className={styles.journal}>
          <p className="kicker">Shop</p>
          <h2 id="shop-title">Prints and one original</h2>
        </div>
        <div className={styles.prints}>
          {shelf.map((product) => (
            <Link key={product.slug} className={styles.print} href={`/shop/${product.slug}`}>
              <Image
                src={product.image.src}
                alt=""
                width={product.image.width}
                height={product.image.height}
                sizes="(max-width: 800px) 100vw, 40vw"
              />
              <p className="kicker">{product.kind === "original" ? "Original" : "Print"}</p>
              <h3>{product.title}</h3>
              <p className="quiet">
                {product.kind === "original"
                  ? money(fromPrice(product))
                  : `From ${money(fromPrice(product))}`}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
