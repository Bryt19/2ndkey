"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  HelpCircle,
  KeyRound,
  LayoutDashboard,
  Plus,
  Settings,
  X,
} from "lucide-react";

import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    group: "Menu",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/vault/create", label: "Create vault", icon: Plus },
      { href: "/beneficiary", label: "Claims", icon: FileText },
    ],
  },
  {
    group: "Manage",
    items: [
      { href: "/settings", label: "Settings", icon: Settings },
      { href: "/help", label: "Help & Support", icon: HelpCircle },
    ],
  },
] as const;

export interface AppSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  /** Called when a nav link is clicked (e.g. to close the mobile overlay). */
  onNavigate?: () => void;
  className?: string;
}

/**
 * App shell sidebar: logo, grouped navigation, and the testnet promo card.
 * Collapses to an icon rail on desktop; the mobile overlay controls its own
 * width from the parent.
 */
export function AppSidebar({
  collapsed = false,
  onToggleCollapse,
  onNavigate,
  className,
}: AppSidebarProps) {
  const pathname = usePathname();
  const [promoVisible, setPromoVisible] = useState(true);

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-card",
        collapsed ? "w-20" : "w-56 lg:w-64",
        className
      )}
    >
      {/* Logo row */}
      <div className={cn("flex items-center justify-between px-4 py-4 sm:py-5 border-b border-border/40", collapsed && "flex-col gap-3 px-2 py-4")}>
        {collapsed ? (
          <>
            <Link href="/" onClick={onNavigate} aria-label="2ndKey Home">
              <Logo markOnly />
            </Link>
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label="Expand sidebar"
                className="grid size-8 place-items-center rounded-lg border border-border bg-muted/30 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                title="Expand sidebar"
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            )}
          </>
        ) : (
          <>
            <Link href="/" onClick={onNavigate} aria-label="2ndKey Home" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <Logo />
            </Link>
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label="Collapse sidebar"
                className="grid size-8 place-items-center rounded-lg border border-border bg-muted/30 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                title="Collapse sidebar"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </button>
            )}
            {onNavigate && !onToggleCollapse && (
              <button
                type="button"
                onClick={onNavigate}
                aria-label="Close sidebar"
                className="ml-auto grid size-7 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-2" aria-label="App">
        {NAV_GROUPS.map((group) => (
          <div key={group.group}>
            {!collapsed && (
              <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.group}
              </p>
            )}
            <ul className="flex flex-col gap-1">
              {group.items.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      title={collapsed ? item.label : undefined}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs sm:text-sm transition-colors",
                        active
                          ? "bg-raised font-medium text-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        collapsed && "justify-center px-0"
                      )}
                    >
                      <Icon
                        className={cn("size-4 sm:size-5 shrink-0", active && "text-primary")}
                        aria-hidden="true"
                      />
                      {!collapsed && item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Testnet promo card */}
      {promoVisible && !collapsed && (
        <div className="mx-3 mb-4 rounded-2xl border border-primary/30 bg-primary/10 p-3.5">
          <div className="flex items-start justify-between gap-2">
            <KeyRound className="size-4 text-primary" aria-hidden="true" />
            <button
              type="button"
              onClick={() => setPromoVisible(false)}
              aria-label="Dismiss"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </div>
          <p className="mt-2 text-xs font-semibold text-foreground">Testnet phase</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
            No real money involved.
          </p>
        </div>
      )}
    </aside>
  );
}
