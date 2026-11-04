"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Plate } from "@/content/types";
import styles from "./Lightbox.module.css";

export function Lightbox({
  images,
  index,
  onIndex,
  onClose,
}: {
  images: Plate[];
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);
  const pendingClose = useRef(0);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    const reopen = () => {
      if (!dialog.isConnected || dialog.open) return;
      dialog.showModal();
    };

    // React Strict Mode runs this effect, cleans it up, then runs it again.
    // dialog.close() fires `close` after the call returns, so the remounted
    // listener would treat that cleanup as Escape and unmount the lightbox.
    const handleClose = () => {
      if (pendingClose.current > 0) {
        pendingClose.current -= 1;
        reopen();
        return;
      }
      onCloseRef.current();
    };
    dialog.addEventListener("close", handleClose);
    if (!dialog.open) dialog.showModal();

    return () => {
      dialog.removeEventListener("close", handleClose);
      if (!dialog.open) return;
      // close() clears `open` immediately and dispatches `close` later.
      // Count only the events that have not already been delivered.
      let delivered = false;
      const mark = () => {
        delivered = true;
      };
      dialog.addEventListener("close", mark);
      dialog.close();
      dialog.removeEventListener("close", mark);
      if (!delivered) pendingClose.current += 1;
    };
  }, []);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    function onKey(event: KeyboardEvent) {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      onIndex((index + direction + images.length) % images.length);
    }

    dialog.addEventListener("keydown", onKey);
    return () => dialog.removeEventListener("keydown", onKey);
  }, [images.length, index, onIndex]);

  const image = images[index];
  if (!image) return null;

  function go(direction: number) {
    const count = images.length;
    onIndex((index + direction + count) % count);
  }

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-label={image.caption || image.alt}
      onPointerUp={(event) => {
        if ((event.target as HTMLElement).closest("button")) return;
        const start = Number(event.currentTarget.dataset.x ?? "");
        if (!Number.isFinite(start)) return;
        const delta = event.clientX - start;
        if (delta > 48) go(-1);
        else if (delta < -48) go(1);
        delete event.currentTarget.dataset.x;
      }}
      onPointerDown={(event) => {
        if ((event.target as HTMLElement).closest("button")) return;
        event.currentTarget.dataset.x = String(event.clientX);
      }}
    >
      <div className={styles.bar}>
        <p className={styles.count}>
          {index + 1} of {images.length}
        </p>
        <button type="button" onClick={onClose} autoFocus>
          Close
        </button>
      </div>
      <div className={styles.stage}>
        <button type="button" className={`${styles.side} ${styles.prev}`} onClick={() => go(-1)}>
          Prev
        </button>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="100vw"
          priority
        />
        <button type="button" className={`${styles.side} ${styles.next}`} onClick={() => go(1)}>
          Next
        </button>
      </div>
      <div className={styles.captionRow}>
        <p className={styles.caption}>{image.caption}</p>
        <p className={styles.hint}>Use the arrow keys to move between pictures. Escape closes.</p>
      </div>
    </dialog>
  );
}
