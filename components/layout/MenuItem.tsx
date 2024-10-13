"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MenuItem({ type = "desktop", href = "", children }: {
    type?: "desktop" | "mobile",
    href: string,
    children: React.ReactNode,
}) {
    const pathname = usePathname();

    let className = "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary";

    if (pathname.endsWith(href)) {
        className = "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary";
    }

    if (type === "mobile") {
        className = "flex items-center gap-2 text-lg font-semibold";
    }

    return <Link
        href={href}
        className={className}
    >
        {children}
    </Link>;
}