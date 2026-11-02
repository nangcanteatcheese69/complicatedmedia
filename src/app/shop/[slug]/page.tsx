import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyBox } from "@/components/BuyBox";
import { getProduct, productKindLabel, products } from "@/content/products";
import { getSeries } from "@/content/series";
import styles from "./product.module.css";

type Props = { params: Promise<{ slug: string }> };

export const instant = false;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Shop" };
  return { title: product.title, description: product.summary };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const series = getSeries(product.seriesSlug);

  return (
    <article className="wrap page">
      <nav aria-label="Breadcrumb">
        <ol className="crumbs">
          <li>
            <Link href="/shop">Shop</Link>
          </li>
          <li aria-current="page">{product.title}</li>
        </ol>
      </nav>
      <div className={styles.layout}>
        <figure className={styles.frame}>
          <Image
            src={product.image.src}
            alt={product.image.alt}
            width={product.image.width}
            height={product.image.height}
            sizes="(max-width: 900px) 100vw, 55vw"
            priority
          />
        </figure>
        <div className={styles.info}>
          <p className="kicker">
            {productKindLabel(product.kind)} — {product.year}
          </p>
          <h1>{product.title}</h1>
          <p className="measure">{product.description}</p>
          <dl className={styles.facts}>
            {product.details.map((detail) => (
              <div key={detail.label}>
                <dt>{detail.label}</dt>
                <dd>
                  {detail.label === "Series" && series ? (
                    <Link className="text-link" href={`/work/${series.slug}`}>
                      {detail.value}
                    </Link>
                  ) : (
                    detail.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <BuyBox product={product} />
        </div>
      </div>
    </article>
  );
}
