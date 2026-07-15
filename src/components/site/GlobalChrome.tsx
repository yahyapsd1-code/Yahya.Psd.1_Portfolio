"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Cursor } from "./Cursor";
import { Loader } from "./Loader";
import { ScrollProgress } from "./ScrollProgress";

export function GlobalChrome({
  children,
  cursor = true,
  loader = true,
  brand,
  initials,
}: {
  children: ReactNode;
  cursor?: boolean;
  loader?: boolean;
  brand: string;
  initials: string;
}) {
  const path = usePathname();
  const onHome = path === "/";
  const isAdmin = path?.startsWith("/admin") ?? false;

  return (
    <>
      {!isAdmin && cursor && <Cursor />}
      {!isAdmin && <ScrollProgress />}
      {loader && onHome && !isAdmin && (
        <Loader brand={brand} initials={initials} />
      )}
      {children}
    </>
  );
}
