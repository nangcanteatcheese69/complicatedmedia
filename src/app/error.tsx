"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="wrap page">
      <p className="kicker">Error</p>
      <h1>The page did not load.</h1>
      <p className="quiet measure" style={{ marginTop: "1rem" }}>
        Try again. The rest of the studio is still open.
      </p>
      <p style={{ marginTop: "1.5rem" }}>
        <button type="button" className="btn" onClick={reset}>
          Try again
        </button>
      </p>
    </div>
  );
}
