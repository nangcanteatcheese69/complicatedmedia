"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { VideoWork } from "@/content/types";
import styles from "./ReelFeed.module.css";

function Reel({ video }: { video: VideoWork }) {
  const frameRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [motion, setMotion] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    function onOther(event: Event) {
      const slug = (event as CustomEvent<string>).detail;
      if (slug === video.slug) return;
      videoRef.current?.pause();
      setPlaying(false);
      setMotion(false);
    }
    window.addEventListener("nang-reel", onOther);
    return () => window.removeEventListener("nang-reel", onOther);
  }, [video.slug]);

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry || entry.intersectionRatio >= 0.45) return;
        videoRef.current?.pause();
        setPlaying(false);
        setMotion(false);
      },
      { threshold: [0, 0.45] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  async function toggle() {
    window.dispatchEvent(new CustomEvent("nang-reel", { detail: video.slug }));
    if (!video.src) {
      setMotion((value) => !value);
      setPlaying((value) => !value);
      return;
    }
    const element = videoRef.current;
    if (!element) return;
    if (element.paused) {
      try {
        await element.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      element.pause();
      setPlaying(false);
    }
  }

  return (
    <article id={video.slug} className={styles.reel}>
      <figure>
        <div className={styles.frame}>
          {video.src ? (
            <video
              ref={videoRef}
              poster={video.poster}
              src={video.src}
              muted={muted}
              playsInline
              loop
              preload="metadata"
              width={video.width}
              height={video.height}
              aria-hidden="true"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />
          ) : (
            <Image
              src={video.poster}
              alt={video.posterAlt}
              width={video.width}
              height={video.height}
              className={motion ? styles.drift : undefined}
            />
          )}
          <button
            type="button"
            className={`${styles.play} ${playing ? styles.playing : ""}`}
            aria-label={playing ? `Pause ${video.title}` : `Play ${video.title}`}
            onClick={toggle}
          >
            <span>{playing ? "Pause" : "Play"}</span>
          </button>
          {video.src && !video.silent ? (
            <button
              type="button"
              className={styles.sound}
              aria-pressed={!muted}
              onClick={() => {
                setMuted((value) => !value);
              }}
            >
              {muted ? "Sound" : "Mute"}
            </button>
          ) : null}
        </div>
        <figcaption className={styles.caption}>
          <p className="kicker">
            {video.year}
            {video.silent ? " · Silent" : ""}
          </p>
          <h2>{video.title}</h2>
          <p className={styles.meta}>{video.duration}</p>
          <p>{video.caption}</p>
        </figcaption>
      </figure>
    </article>
  );
}

export function ReelFeed({ videos }: { videos: VideoWork[] }) {
  return (
    <div className={styles.feed}>
      {videos.map((video) => (
        <Reel key={video.slug} video={video} />
      ))}
    </div>
  );
}
