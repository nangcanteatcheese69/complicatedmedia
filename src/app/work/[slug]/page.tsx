import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SeriesGallery } from "@/components/SeriesGallery";
import { fromPrice, productKindLabel, productsInSeries, showsFromPrice } from "@/content/products";
import { getSeries, series } from "@/content/series";
import { money } from "@/lib/format";
import styles from "../work.module.css";

type Props = { params: Promise<{ slug: string }> };

export const instant = false;

export function generateStaticParams() {
  return series.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getSeries(slug);
  if (!item) return { title: "Work" };
  return { title: item.title, description: item.lede };
}

export default async function SeriesPage({ params }: Props) {
  const { slug } = await params;
  const item = getSeries(slug);
  if (!item) notFound();
  const prints = productsInSeries(item.slug);

  return (
    <article className="wrap page">
      <nav aria-label="Breadcrumb">
        <ol className="crumbs">
          <li>
            <Link href="/work">Work</Link>
          </li>
          <li aria-current="page">{item.title}</li>
        </ol>
      </nav>
      <header className={styles.seriesHead}>
        <p className="kicker">
          {item.year} — {item.location}
        </p>
        <h1>{item.title}</h1>
        <p className="lede">{item.lede}</p>
        <div className={styles.statement}>
          {item.statement.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </header>
      <SeriesGallery images={item.images} />
      {prints.length > 0 ? (
        <section className={styles.prints} aria-labelledby="prints-title">
          <h2 id="prints-title">
            {prints.every((product) => product.kind === "sticker")
              ? "Stickers"
              : "Prints from this series"}
          </h2>
          <ul>
            {prints.map((product) => (
              <li key={product.slug}>
                <Link href={`/shop/${product.slug}`}>
                  <span>
                    {product.title}
                    <span className="sr-only">, {productKindLabel(product.kind)}</span>
                  </span>
                  <span className="quiet">
                    {showsFromPrice(product)
                      ? `From ${money(fromPrice(product))}`
                      : money(fromPrice(product))}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
