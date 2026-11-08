import type { Metadata } from "next";
import { MagazineTile } from "@/components/MagazineTile";
import { stickers } from "@/content/graphics";
import { series } from "@/content/series";
import styles from "./work.module.css";

export const metadata: Metadata = {
  title: "Work",
  description: "Stickers and photographic series by complicated-media.",
};

function tileSize(index: number, total: number): "lead" | "half" | "third" {
  if (index === 0) return "lead";
  const rest = total - 1;
  const remainder = rest % 3;
  if (remainder !== 0 && index >= total - remainder) return "half";
  return "third";
}

export default function WorkPage() {
  const photographs = series.filter((item) => item.slug !== "graphics");

  return (
    <>
      <header className={`wrap ${styles.mast}`}>
        <p className="kicker">complicated-media</p>
        <h1>Graphics</h1>
      </header>
      <div className="mosaic">
        {stickers.map((sticker, index) => (
          <MagazineTile
            key={sticker.slug}
            href={`/shop/${sticker.slug}`}
            size={tileSize(index, stickers.length)}
            priority={index === 0}
            kicker="Sticker"
            title={sticker.title}
            image={{
              src: sticker.src,
              alt: `Sticker, ${sticker.title}`,
              width: sticker.width,
              height: sticker.height,
            }}
          />
        ))}
      </div>
      {photographs.length > 0 ? (
        <div className={`mosaic ${styles.more}`}>
          {photographs.map((item) => (
            <MagazineTile
              key={item.slug}
              href={`/work/${item.slug}`}
              size="half"
              kicker={`${item.year} — ${item.location}`}
              title={item.title}
              dek={item.lede}
              image={
                item.images[0]
                  ? {
                      src: item.images[0].src,
                      alt: item.images[0].alt,
                      width: item.images[0].width,
                      height: item.images[0].height,
                    }
                  : undefined
              }
            />
          ))}
        </div>
      ) : null}
    </>
  );
}
