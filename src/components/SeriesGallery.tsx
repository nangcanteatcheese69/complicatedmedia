"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Plate } from "@/content/types";
import { Lightbox } from "@/components/Lightbox";
import styles from "./SeriesGallery.module.css";

export function SeriesGallery({ images }: { images: Plate[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const trigger = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (index === null && trigger.current) {
      trigger.current.focus();
      trigger.current = null;
    }
  }, [index]);

  return (
    <>
      <div className={styles.grid}>
        {images.map((image, imageIndex) => (
          <figure key={image.src} className={styles.item}>
            <button
              type="button"
              className={styles.frame}
              onClick={(event) => {
                trigger.current = event.currentTarget;
                setIndex(imageIndex);
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes={imageIndex % 3 === 0 ? "100vw" : "(max-width: 720px) 100vw, 50vw"}
                priority={imageIndex === 0}
              />
            </button>
            <figcaption className={styles.caption}>{image.caption}</figcaption>
          </figure>
        ))}
      </div>
      {index !== null ? (
        <Lightbox
          images={images}
          index={index}
          onIndex={setIndex}
          onClose={() => setIndex(null)}
        />
      ) : null}
    </>
  );
}
