import { Suspense } from "react";
import { Header } from "@/components/Header";
import { HeaderView } from "@/components/HeaderView";

export function SiteHeader() {
  return (
    <Suspense fallback={<HeaderView pathname={null} count={0} />}>
      <Header />
    </Suspense>
  );
}
