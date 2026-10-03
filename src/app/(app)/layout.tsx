import { AppShell } from "@/components/layout/AppShell";
import { AppDataProvider } from "@/lib/data/DataContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppDataProvider>
      <AppShell>{children}</AppShell>
    </AppDataProvider>
  );
}
