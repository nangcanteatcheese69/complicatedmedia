import Image from "next/image";
import Link from "next/link";
import styles from "./MagazineTile.module.css";

type Heading = "h1" | "h2";

export function MagazineTile({
  href,
  kicker,
  title,
  dek,
  heading = "h2",
  size = "half",
  image,
  priority = false,
}: {
  href?: string;
  kicker: string;
  title: string;
  dek?: string;
  heading?: Heading;
  size?: "lead" | "half" | "third";
  image?: { src: string; alt: string; width: number; height: number };
  priority?: boolean;
}) {
  const Title = heading;
  const className = `${styles.tile} ${styles[size]} ${image ? styles.hasImage : ""}`;
  const body = (
    <>
      {image ? (
        <span className={styles.media}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={priority}
            sizes={
              size === "lead" ? "100vw" : size === "half" ? "(max-width: 800px) 100vw, 50vw" : "(max-width: 800px) 100vw, 33vw"
            }
          />
        </span>
      ) : null}
      <span className={styles.copy}>
        <span className="kicker">{kicker}</span>
        <Title className={styles.title}>{title}</Title>
        {dek ? <span className={styles.dek}>{dek}</span> : null}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {body}
      </Link>
    );
  }

  return <div className={className}>{body}</div>;
}
