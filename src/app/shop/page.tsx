import type { Metadata } from "next";
import Link from "next/link";
import { fromPrice, products } from "@/content/products";
import { money } from "@/lib/format";
import styles from "./shop.module.css";

export const metadata: Metadata = {
  title: "Shop",
  description: "Small editions of prints and one unique work by complicated-media.",
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
          <p className="lede">Archival pigment prints in small editions. Prices in USD.</p>
          <div className={styles.grid}>
            {products.map((product) => (
              <Link key={product.slug} className={styles.card} href={`/shop/${product.slug}`}>
                <p className="kicker">
                  {product.kind === "original" ? "Original" : "Print"} — {product.year}
                </p>
                <h2>{product.title}</h2>
                <p>{product.summary}</p>
                <p className="quiet">
                  {product.kind === "original"
                    ? money(fromPrice(product))
                    : `From ${money(fromPrice(product))}`}
                </p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
