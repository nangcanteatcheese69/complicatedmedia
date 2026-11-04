"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ZinePage } from "@/content/zine";
import styles from "./ZineBook.module.css";

const FLIP_MS = 720;

type Turn = { from: number; to: number; dir: 1 | -1 };

function pairAt(index: number, total: number): [number, number | null] {
  if (index <= 0) return [0, null];
  const left = 1 + (index - 1) * 2;
  const right = left + 1 < total ? left + 1 : null;
  return [left, right];
}

function isPair(index: number, total: number) {
  return pairAt(index, total)[1] != null;
}

function lastSpread(total: number) {
  if (total <= 1) return 0;
  return Math.ceil((total - 1) / 2);
}

function spreadLabel(index: number, total: number) {
  const [left, right] = pairAt(index, total);
  if (index === 0) return `Cover, page 1 of ${total}`;
  if (right == null) return `Page ${left + 1} of ${total}`;
  return `Pages ${left + 1} and ${right + 1} of ${total}`;
}

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={dir === "prev" ? "M14.5 5.5 8 12l6.5 6.5" : "M9.5 5.5 16 12l-6.5 6.5"} />
    </svg>
  );
}

function Face({
  pages,
  index,
  labelled,
}: {
  pages: ZinePage[];
  index: number;
  labelled: boolean;
}) {
  const [left, right] = pairAt(index, pages.length);
  const leaves = [pages[left], right == null ? undefined : pages[right]].filter(
    (leaf): leaf is ZinePage => Boolean(leaf),
  );
  return (
    <div className={right == null ? styles.single : styles.spread}>
      {leaves.map((leaf) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={leaf.src}
          src={leaf.src}
          alt={labelled ? leaf.alt : ""}
          width={leaf.width}
          height={leaf.height}
        />
      ))}
    </div>
  );
}

export function ZineBook({ title, pages }: { title: string; pages: ZinePage[] }) {
  const [index, setIndex] = useState(0);
  const [turn, setTurn] = useState<Turn | null>(null);
  const [reduced, setReduced] = useState(false);
  const [edges, setEdges] = useState<{ left: number; right: number } | null>(null);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const busy = useRef(false);
  const drag = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const end = lastSpread(pages.length);
  const stateRef = useRef({ index, end, reduced });
  const shown = turn ? turn.to : index;

  useEffect(() => {
    stateRef.current = { index, end, reduced };
  });

  useEffect(() => {
    // The page transition animates a transform, which would trap a fixed arrow
    // inside the page instead of the screen. Portaling puts it on the viewport.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPortalRoot(document.body);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      const rect = stage.getBoundingClientRect();
      setEdges({ left: rect.left, right: rect.right });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, [shown, turn]);

  useEffect(() => {
    const want = new Set<number>();
    for (const cursor of [index - 1, index, index + 1]) {
      if (cursor < 0 || cursor > end) continue;
      const [left, right] = pairAt(cursor, pages.length);
      want.add(left);
      if (right != null) want.add(right);
    }
    for (const pageIndex of want) {
      const page = pages[pageIndex];
      if (!page) continue;
      const image = new Image();
      image.src = page.src;
    }
  }, [end, index, pages]);

  useEffect(() => {
    if (!turn) return;
    const current = turn;
    const timer = window.setTimeout(() => {
      setIndex(current.to);
      setTurn(null);
      busy.current = false;
    }, FLIP_MS + 80);
    return () => window.clearTimeout(timer);
  }, [turn]);

  function go(dir: 1 | -1) {
    const { index: current, end: last, reduced: quiet } = stateRef.current;
    if (busy.current) return;
    const to = current + dir;
    if (to < 0 || to > last) return;
    if (quiet) {
      setIndex(to);
      return;
    }
    busy.current = true;
    setTurn({ from: current, to, dir });
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const wide = turn ? isPair(turn.from, pages.length) || isPair(turn.to, pages.length) : isPair(shown, pages.length);
  const outgoingPair = turn ? isPair(turn.from, pages.length) : false;
  const label = spreadLabel(turn ? turn.to : index, pages.length);

  const arrows = (
    <>
      <button
        type="button"
        className={`${styles.arrow} ${styles.prev}`}
        style={edges ? { left: Math.max(8, edges.left - 58) } : undefined}
        onClick={() => go(-1)}
        disabled={index === 0 || turn !== null}
        aria-label="Previous pages"
      >
        <Arrow dir="prev" />
      </button>
      <button
        type="button"
        className={`${styles.arrow} ${styles.next}`}
        style={edges ? { left: edges.right + 10, right: "auto" } : undefined}
        onClick={() => go(1)}
        disabled={index >= end || turn !== null}
        aria-label="Next pages"
      >
        <Arrow dir="next" />
      </button>
    </>
  );

  return (
    <div className={styles.reader}>
      {portalRoot ? createPortal(arrows, portalRoot) : arrows}

      <div
        className={`${styles.stage} ${wide ? styles.wide : ""}`}
        ref={stageRef}
        onPointerDown={(event) => {
          if ((event.target as HTMLElement).closest("button")) return;
          drag.current = event.clientX;
        }}
        onPointerUp={(event) => {
          if (drag.current == null) return;
          const delta = event.clientX - drag.current;
          drag.current = null;
          if (delta > 56) go(-1);
          else if (delta < -56) go(1);
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        <div className={wide && !isPair(shown, pages.length) ? styles.centerHalf : undefined}>
          <Face pages={pages} index={shown} labelled={!turn} />
        </div>
        {turn ? (
          <div
            className={`${styles.sheet} ${outgoingPair ? styles.sheetFull : styles.sheetHalf} ${
              turn.dir > 0 ? styles.forward : styles.backward
            }`}
          >
            <Face pages={pages} index={turn.from} labelled={false} />
          </div>
        ) : null}
      </div>

      <p className={styles.status} aria-live="polite">
        {label}
        <span className="sr-only">. {title}</span>
      </p>
      <p className={styles.hint}>Arrow keys turn the spread. On a touch screen, drag the page.</p>
    </div>
  );
}
