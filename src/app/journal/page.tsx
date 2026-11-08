import type { Metadata } from "next";
import { MagazineTile } from "@/components/MagazineTile";
import { postsByDate } from "@/content/posts";
import { formatDate, readingTime } from "@/lib/format";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes on process, a borrowed exhibition room, and fieldwork on the coast.",
};

export default function JournalPage() {
  const posts = postsByDate();
  return (
    <div className="mosaic">
      {posts.map((post, index) => (
        <MagazineTile
          key={post.slug}
          href={`/journal/${post.slug}`}
          size={index === 0 ? "lead" : "half"}
          heading={index === 0 ? "h1" : "h2"}
          priority={index === 0}
          kicker={`Journal — ${formatDate(post.date)} — ${readingTime(post)}`}
          title={post.title}
          dek={post.dek}
        />
      ))}
    </div>
  );
}
