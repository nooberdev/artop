"use client";

import Link from "next/link";

export function ArtopLogo() {
  return (
    <Link href="/camino" aria-label="artop inicio" className="group inline-flex items-center">
      <img
        src="/brand/logo-rosa.svg"
        alt="artop"
        width={243}
        height={110}
        className="h-[34px] w-auto transition-transform duration-200 group-hover:scale-[1.03] group-active:scale-95"
      />
    </Link>
  );
}
