import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MagazineTile } from "@/components/MagazineTile";
import { getPost, posts, postsByDate } from "@/content/posts";
import { getSeries } from "@/content/series";
import { formatDate, readingTime } from "@/lib/format";
import styles from "./article.module.css";

type Props = { params: Promise<{ slug: string }> };

export const instant = false;

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Journal" };
  return { title: post.title, description: post.dek };
}

export default async function JournalArticle({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const related = post.seriesSlug ? getSeries(post.seriesSlug) : undefined;
  const more = postsByDate().filter((item) => item.slug !== post.slug);

  return (
    <article>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className="kicker">
            <Link href="/journal">Journal</Link>
            {" — "}
            {formatDate(post.date)}
            {" — "}
            {readingTime(post)}
          </p>
          <h1>{post.title}</h1>
          <p className={styles.standfirst}>{post.dek}</p>
        </div>
      </header>
      <div className={styles.body}>
        {post.blocks.map((block, index) => {
          if (block.type === "h2") return <h2 key={block.text}>{block.text}</h2>;
          if (block.type === "quote") {
            return (
              <blockquote key={block.text} className={styles.quote}>
                {block.text}
              </blockquote>
            );
          }
          if (block.type === "figure") {
            return (
              <figure key={block.src} className={styles.figure}>
                <Image
                  src={block.src}
                  alt={block.alt}
                  width={block.width}
                  height={block.height}
                  sizes="100vw"
                />
                <figcaption>{block.caption}</figcaption>
              </figure>
            );
          }
          return <p key={`${index}-${block.text.slice(0, 24)}`}>{block.text}</p>;
        })}
        {related ? (
          <p className={styles.related}>
            <Link className="text-link" href={`/work/${related.slug}`}>
              View {related.title}
            </Link>
          </p>
        ) : null}
      </div>
      {more.length > 0 ? (
        <section className={styles.more} aria-labelledby="more-notes">
          <h2 id="more-notes" className={styles.moreLabel}>
            More notes
          </h2>
          <div className="mosaic">
            {more.map((item) => (
              <MagazineTile
                key={item.slug}
                href={`/journal/${item.slug}`}
                size="half"
                kicker={`Journal — ${formatDate(item.date)}`}
                title={item.title}
                dek={item.dek}
              />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
