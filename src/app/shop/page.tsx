import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { fromPrice, productKindLabel, products, showsFromPrice } from "@/content/products";
import { money } from "@/lib/format";
import styles from "./shop.module.css";

export const metadata: Metadata = {
  title: "Shop",
  description: "Vinyl stickers and small editions of prints by complicated-media.",
};

export default function ShopPage() {
  return (
    <div className="wrap page">
      <p className="kicker">Editions</p>
      <h1>Prints and originals</h1>
      {products.length === 0 ? (
        <div className={styles.empty}>
          <p className="lede">The shelf is empty.</p>
          <p className="quiet measure">Prints and originals will be listed here when they are ready.</p>
        </div>
      ) : (
        <>
          <p className="lede">Vinyl stickers, and prints when they are ready. Prices in USD.</p>
          <div className={styles.grid}>
            {products.map((product) => (
              <Link key={product.slug} className={styles.card} href={`/shop/${product.slug}`}>
                <Image
                  src={product.image.src}
                  alt={product.image.alt}
                  width={product.image.width}
                  height={product.image.height}
                  sizes="(max-width: 720px) 100vw, 40vw"
                />
                <p className="kicker">
                  {productKindLabel(product.kind)} — {product.year}
                </p>
                <h2>{product.title}</h2>
                <p>{product.summary}</p>
                <p className="quiet">
                  {showsFromPrice(product)
                    ? `From ${money(fromPrice(product))}`
                    : money(fromPrice(product))}
                </p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
