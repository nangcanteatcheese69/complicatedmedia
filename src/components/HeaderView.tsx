import Image from "next/image";
import Link from "next/link";
import { isCurrent, NAV } from "@/components/nav";
import styles from "./Header.module.css";

export function HeaderView({
  pathname,
  count,
}: {
  pathname: string | null;
  count: number;
}) {
  return (
    <header className={styles.header}>
      <div className={`wrap ${styles.bar}`}>
        <Link
          href="/"
          className={styles.brand}
          aria-current={pathname === "/" ? "page" : undefined}
        >
          <Image
            src="/logo.png"
            alt="complicated"
            width={1080}
            height={1080}
            priority
          />
        </Link>
        <nav aria-label="Primary" className={styles.nav}>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/cart"
            aria-current={pathname === "/cart" ? "page" : undefined}
            aria-label={
              count > 0 ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : undefined
            }
          >
            Cart
            {count > 0 ? <span className={styles.count}>{count}</span> : null}
          </Link>
        </nav>
      </div>
    </header>
  );
}
