export const NAV = [
  { href: "/work", label: "Work" },
  { href: "/journal", label: "Journal" },
  { href: "/reels", label: "Reels" },
  { href: "/shop", label: "Shop" },
] as const;

export function isCurrent(pathname: string | null, href: string) {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}
