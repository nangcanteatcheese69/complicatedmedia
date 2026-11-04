import type { Metadata } from "next";
import { ReelFeed } from "@/components/ReelFeed";
import { videos } from "@/content/videos";
import styles from "@/components/ReelFeed.module.css";

export const metadata: Metadata = {
  title: "Reels",
  description: "Silent short films by complicated-media. Vertical studies of tide, light, rooms, and drying prints.",
};

export default function ReelsPage() {
  return (
    <div className="wrap page">
      <header className={styles.intro}>
        <p className="kicker">Vertical studies</p>
        <h1>Short films</h1>
        {videos.length === 0 ? (
          <p className="lede">No films are up yet.</p>
        ) : (
          <p>
            Silent until you ask otherwise. Press play. They pause when you scroll on.
          </p>
        )}
      </header>
      {videos.length > 0 ? <ReelFeed videos={videos} /> : null}
    </div>
  );
}
