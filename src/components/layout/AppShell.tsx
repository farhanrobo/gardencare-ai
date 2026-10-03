"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AlertTriangle, Menu, ShieldCheck, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { useAppData } from "@/lib/data/DataContext";

function SidebarFooter() {
  return (
    <div className="space-y-3 border-t border-line p-4">
      <p className="flex items-start gap-2 text-xs leading-relaxed text-ink-muted">
        <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-moss-600" aria-hidden="true" />
        Photos are analyzed locally in your browser — they are never uploaded to an AI service.
      </p>
      <p className="text-[11px] leading-relaxed text-ink-faint">
        Prototype for plant health indication only — not a professional agricultural diagnosis.
      </p>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { storageError } = useAppData();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[264px_1fr]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded-xl focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink focus:shadow-lift"
      >
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line bg-surface lg:flex">
        <div className="px-5 py-5">
          <a href="/dashboard" className="rounded-lg" aria-label="GardenCare AI — dashboard">
            <Logo />
          </a>
        </div>
        <SidebarNav />
        <SidebarFooter />
      </aside>

      <div className="flex min-h-dvh flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-surface/95 px-4 backdrop-blur lg:hidden">
          <a href="/dashboard" aria-label="GardenCare AI — dashboard">
            <Logo markClassName="size-7" />
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            className="rounded-xl p-2.5 text-ink-soft transition-colors hover:bg-moss-50 hover:text-ink"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
        </header>

        {/* Mobile drawer */}
        {menuOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-line bg-surface shadow-lift"
            >
              <div className="flex items-center justify-between px-4 py-3.5">
                <Logo markClassName="size-7" />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="rounded-xl p-2.5 text-ink-soft transition-colors hover:bg-moss-50 hover:text-ink"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>
              <SidebarNav onNavigate={() => setMenuOpen(false)} />
              <SidebarFooter />
            </div>
          </div>
        ) : null}

        <main id="main-content" className="flex-1">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
            {storageError ? (
              <div
                className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
                role="alert"
              >
                <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <p>{storageError}</p>
              </div>
            ) : null}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
