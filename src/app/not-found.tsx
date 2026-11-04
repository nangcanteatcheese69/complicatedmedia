import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not found",
};

export default function NotFound() {
  return (
    <div className="wrap page">
      <p className="kicker">404</p>
      <h1>This page is not in the studio.</h1>
      <p className="quiet measure" style={{ marginTop: "1rem" }}>
        The picture, note, or print may have moved.
      </p>
      <p style={{ marginTop: "1.5rem" }}>
        <Link className="btn" href="/">
          Back home
        </Link>
      </p>
    </div>
  );
}
