import type { Metadata } from "next";
import { MagazineTile } from "@/components/MagazineTile";
import { fromPrice, productKindLabel, products, showsFromPrice } from "@/content/products";
import { money } from "@/lib/format";
import styles from "./shop.module.css";

export const metadata: Metadata = {
  title: "Shop",
  description: "Vinyl stickers and small editions of prints by complicated-media.",
};

export default function ShopPage() {
  return (
    <>
      <header className={`wrap ${styles.mast}`}>
        <p className="kicker">Editions</p>
        <h1>Shop</h1>
        <p className="lede">Vinyl stickers, and prints when they are ready. Prices in USD.</p>
      </header>
      {products.length === 0 ? (
        <div className={`wrap ${styles.empty}`}>
          <p className="lede">The shelf is empty.</p>
          <p className="quiet measure">Prints and originals will be listed here when they are ready.</p>
        </div>
      ) : (
        <div className="mosaic">
          {products.map((product, index) => (
            <MagazineTile
              key={product.slug}
              href={`/shop/${product.slug}`}
              size={products.length % 3 !== 0 && index >= products.length - (products.length % 3) ? "half" : "third"}
              priority={index === 0}
              kicker={`${productKindLabel(product.kind)} — ${
                showsFromPrice(product) ? `From ${money(fromPrice(product))}` : money(fromPrice(product))
              }`}
              title={product.title}
              image={{
                src: product.image.src,
                alt: product.image.alt,
                width: product.image.width,
                height: product.image.height,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
