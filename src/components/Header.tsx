"use client";

import { usePathname } from "next/navigation";
import { HeaderView } from "@/components/HeaderView";
import { useCart } from "@/lib/storage";

export function Header() {
  const pathname = usePathname();
  const count = useCart().reduce((sum, line) => sum + line.quantity, 0);
  return <HeaderView pathname={pathname} count={count} />;
}
