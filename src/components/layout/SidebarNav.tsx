"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ClipboardList,
  History,
  LayoutDashboard,
  ScanSearch,
  Settings,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV_ITEMS: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/scanner", label: "Plant Scanner", icon: ScanSearch },
  { href: "/plants", label: "My Plants", icon: Sprout },
  { href: "/history", label: "Scan History", icon: History },
  { href: "/reports", label: "Problem Reports", icon: ClipboardList },
  { href: "/tips", label: "Care Tips", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="flex-1 space-y-1 px-3">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-moss-100 text-moss-900" : "text-ink-soft hover:bg-moss-50 hover:text-ink",
            )}
          >
            <Icon className={cn("size-[18px]", active ? "text-moss-700" : "text-ink-faint")} aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
