import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { fromPrice, products } from "@/content/products";
import { money } from "@/lib/format";
import styles from "./shop.module.css";

export const metadata: Metadata = {
  title: "Shop",
  description: "Small editions of prints and one unique work by Nang.",
};

export default function ShopPage() {
  return (
    <div className="wrap page">
      <p className="kicker">Editions</p>
      <h1>Prints and originals</h1>
      <p className="lede">
        Archival pigment prints in small editions, and one unique print. Prices in USD.
      </p>
      <p className="quiet measure">
        Checkout on this preview completes without a charge. The receipt stays in your
        browser.
      </p>
      <div className={styles.grid}>
        {products.map((product) => (
          <Link key={product.slug} className={styles.card} href={`/shop/${product.slug}`}>
            <Image
              src={product.image.src}
              alt=""
              width={product.image.width}
              height={product.image.height}
              sizes="(max-width: 720px) 100vw, 50vw"
            />
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
    </div>
  );
}
