"use client";

import { usePathname } from "next/navigation";

export function SiteBetaBadge() {
  const pathname = usePathname();
  const label = pathname === "/portal" ? "Beta Live" : "Beta";

  return (
    <div className="site-beta-version-badge" aria-label={label}>
      <span className="site-beta-version-badge__dot" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
