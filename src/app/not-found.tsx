import type { Metadata } from "next";
import { LinkButton } from "@/components/ui/Button";
import { LogoMark } from "@/components/brand/Logo";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <LogoMark className="size-12" />
      <p className="mt-6 font-mono text-sm text-ink-faint">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">This page has wilted</h1>
      <p className="mt-2 max-w-md text-sm text-ink-muted">
        The page you are looking for does not exist or has moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <LinkButton href="/">Back to home</LinkButton>
        <LinkButton href="/scanner" variant="secondary">
          Scan a plant
        </LinkButton>
      </div>
    </main>
  );
}
