import Link from "next/link";
import { NAV } from "@/components/nav";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.grid}`}>
        <div className="stack">
          <p className={styles.name}>complicated-media</p>
          <p className="quiet">Photographs, short films, and prints.</p>
        </div>
        <nav aria-label="Footer" className={styles.links}>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link href="/about">About</Link>
        </nav>
        <p className={styles.fine}>
          © 2026 complicated-media. Orders on this preview are simulated and stay in
          this browser.
        </p>
      </div>
    </footer>
  );
}
