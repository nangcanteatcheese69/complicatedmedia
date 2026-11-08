import { MagazineTile } from "@/components/MagazineTile";
import { stickers } from "@/content/graphics";
import { postsByDate } from "@/content/posts";
import { zine } from "@/content/zine";
import { formatDate, readingTime } from "@/lib/format";

export default function HomePage() {
  const posts = postsByDate();
  const cover = zine.pages[0];

  return (
    <>
      <MagazineTile
        href="/zine"
        size="lead"
        heading="h1"
        priority
        kicker="Zine"
        title={zine.title}
        dek={zine.dek}
        image={{
          src: cover.src,
          alt: cover.alt,
          width: cover.width,
          height: cover.height,
        }}
      />
      <div className="mosaic">
        {posts.map((post, index) => (
          <MagazineTile
            key={post.slug}
            href={`/journal/${post.slug}`}
            size={index === posts.length - 1 && posts.length % 2 === 1 ? "lead" : "half"}
            kicker={`Journal — ${formatDate(post.date)} — ${readingTime(post)}`}
            title={post.title}
            dek={post.dek}
          />
        ))}
        {stickers.slice(0, 3).map((sticker) => (
          <MagazineTile
            key={sticker.slug}
            href={`/shop/${sticker.slug}`}
            size="third"
            kicker="Graphics"
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
    </>
  );
}
