import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { CARE_TIPS } from "@/lib/content/tips";

export const metadata: Metadata = { title: "Care Tips" };

export default function TipsPage() {
  return (
    <div>
      <PageHeader
        title="Care Tips"
        description="Everyday good practice that prevents most plant problems before they start. General guidance for this prototype — adapt it to your plants and local conditions."
      />

      <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {CARE_TIPS.map(({ id, title, icon: Icon, intro, points }) => (
          <li key={id}>
            <Card className="flex h-full flex-col p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-moss-100 text-moss-700">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h2 className="text-sm font-semibold text-ink">{title}</h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{intro}</p>
              <ul className="mt-4 space-y-2.5">
                {points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-soft">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-moss-400" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </Card>
          </li>
        ))}
      </ul>

      <p className="mt-8 max-w-3xl text-xs leading-relaxed text-ink-faint">
        These tips are hand-written general information for this prototype — they are not AI-generated and not a
        substitute for local, professional agricultural advice. If a problem persists or spreads quickly, contact a
        local agricultural extension service or an experienced grower.
      </p>
    </div>
  );
}
