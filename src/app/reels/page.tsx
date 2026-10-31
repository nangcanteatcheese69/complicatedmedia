import type { Metadata } from "next";
import { ReelFeed } from "@/components/ReelFeed";
import { videos } from "@/content/videos";
import styles from "@/components/ReelFeed.module.css";

export const metadata: Metadata = {
  title: "Reels",
  description: "Silent short films by Nang. Vertical studies of tide, light, rooms, and drying prints.",
};

export default function ReelsPage() {
  return (
    <div className="wrap page">
      <header className={styles.intro}>
        <p className="kicker">Vertical studies</p>
        <h1>Short films</h1>
        <p>
          Silent, a few seconds each. Press play. They stay muted, and they pause when
          you scroll on.
        </p>
      </header>
      <ReelFeed videos={videos} />
    </div>
  );
}
