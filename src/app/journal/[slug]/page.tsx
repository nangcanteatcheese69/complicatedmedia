import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
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
    <article className="wrap page">
      <nav aria-label="Breadcrumb">
        <ol className="crumbs">
          <li>
            <Link href="/journal">Journal</Link>
          </li>
          <li aria-current="page">{post.title}</li>
        </ol>
      </nav>
      <header className={styles.head}>
        <p className="kicker">
          {formatDate(post.date)} — {readingTime(post)}
        </p>
        <h1>{post.title}</h1>
        <p className="lede">{post.dek}</p>
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
                  sizes="(max-width: 800px) 100vw, 40rem"
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
        <section className={styles.related} aria-labelledby="more-notes">
          <h2 id="more-notes">More notes</h2>
          <ul className="crumbs" style={{ marginTop: "0.8rem" }}>
            {more.map((item) => (
              <li key={item.slug}>
                <Link href={`/journal/${item.slug}`}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
