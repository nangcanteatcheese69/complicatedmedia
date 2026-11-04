import type { Metadata } from "next";
import { ZineBook } from "@/components/ZineBook";
import { zine } from "@/content/zine";

export const metadata: Metadata = {
  title: zine.title,
  description: zine.dek,
};

export default function ZinePage() {
  return (
    <article className="page">
      <div className="wrap">
        <p className="kicker">Zine</p>
        <h1>{zine.title}</h1>
        <p className="lede">{zine.dek}</p>
      </div>
      <ZineBook title={zine.title} pages={zine.pages} />
    </article>
  );
}
