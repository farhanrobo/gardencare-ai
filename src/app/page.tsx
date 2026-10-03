import Link from "next/link";
import {
  ArrowRight,
  Camera,
  ClipboardList,
  Cpu,
  Leaf,
  ListChecks,
  ScanSearch,
  ShieldCheck,
  Sprout,
} from "lucide-react";
import { LinkButton, buttonStyles } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Logo, LogoMark } from "@/components/brand/Logo";
import {
  APP_DESCRIPTION,
  APP_TAGLINE,
  DISCLAIMER,
  MODEL_INFO,
  SAMPLE_IMAGES,
} from "@/lib/constants";

const FEATURES = [
  {
    icon: ScanSearch,
    title: "AI Plant Scanner",
    description: "Analyze a plant image and identify possible health conditions.",
    detail: "A MobileNetV2 model checks the leaf against 38 common plant conditions and reports what it found.",
  },
  {
    icon: ListChecks,
    title: "Clear Recommendations",
    description: "Understand what the result means and what you can do next.",
    detail: "Every result comes with a plain-language explanation, a confidence estimate and practical next steps.",
  },
  {
    icon: Sprout,
    title: "Plant Records",
    description: "Keep track of your scanned plants and previous results.",
    detail: "Attach scans to plant records, follow each plant's history and spot problems before they spread.",
  },
];

const STEPS = [
  {
    icon: Camera,
    title: "Take or upload a photo",
    description: "A close-up of one affected leaf in natural light works best — JPG, PNG or WEBP.",
  },
  {
    icon: Cpu,
    title: "The model analyzes it on your device",
    description:
      "A MobileNetV2 plant-disease classifier runs locally with ONNX Runtime Web. Your photo never leaves the browser.",
  },
  {
    icon: ClipboardList,
    title: "Get results, guidance and history",
    description:
      "See the possible condition, an honest confidence score and recommended next steps — then keep the record for later.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-line/70 bg-canvas/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="GardenCare AI — home">
            <Logo />
          </Link>
          <nav aria-label="Landing" className="hidden items-center gap-7 md:flex">
            <a href="#features" className="text-sm text-ink-soft transition-colors hover:text-ink">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-ink-soft transition-colors hover:text-ink">
              How it works
            </a>
            <Link href="/tips" className="text-sm text-ink-soft transition-colors hover:text-ink">
              Care tips
            </Link>
          </nav>
          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline-flex">
              <Link href="/dashboard" className={buttonStyles("secondary", "sm")}>
                View Dashboard
              </Link>
            </span>
            <Link href="/scanner" className={buttonStyles("primary", "sm")}>
              Scan a Plant
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content">
        {/* Hero */}
        <section className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-4 pt-14 pb-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-8 lg:pt-20 lg:pb-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-medium text-ink-soft shadow-soft">
              <ShieldCheck className="size-3.5 text-moss-600" aria-hidden="true" />
              Free prototype — all analysis happens in your browser
            </p>
            <h1 className="mt-6 text-4xl leading-tight font-semibold tracking-tight text-ink sm:text-5xl">
              GardenCare <span className="text-moss-600">AI</span>
            </h1>
            <p className="mt-4 text-lg font-medium text-ink-soft">{APP_DESCRIPTION}</p>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-muted">
              {APP_TAGLINE} Upload a leaf photo and get a quick indication of possible plant health problems — with a
              confidence score, a plain-language explanation and simple next steps.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <LinkButton href="/scanner" size="lg">
                Scan a Plant
                <ArrowRight className="size-4" aria-hidden="true" />
              </LinkButton>
              <LinkButton href="/dashboard" variant="secondary" size="lg">
                View Dashboard
              </LinkButton>
            </div>
            <p className="mt-6 text-xs text-ink-faint">
              No account · No API keys · Works offline after the first load
            </p>
          </div>

          {/* Hero visual */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative overflow-hidden rounded-3xl border border-line bg-moss-50 p-4 shadow-soft sm:p-6">
              <svg
                viewBox="0 0 420 380"
                className="w-full"
                role="img"
                aria-label="Illustration of a plant leaf inside a scanner frame with a moving scan line"
              >
                <circle cx="336" cy="76" r="86" fill="#e2ecdf" />
                <circle cx="74" cy="322" r="64" fill="#e9f1e6" />
                <g transform="translate(210 192) rotate(-14)">
                  <path
                    d="M0 -150 C 96 -100, 96 100, 0 150 C -96 100, -96 -100, 0 -150 Z"
                    fill="url(#heroLeaf)"
                    stroke="#2f7042"
                    strokeWidth="3"
                  />
                  <path d="M0 -126 V126" stroke="#2f7042" strokeWidth="4" strokeLinecap="round" opacity="0.65" />
                  <path
                    d="M0 -74 C 24 -88 42 -104 54 -126 M0 -74 C -24 -88 -42 -104 -54 -126 M0 12 C 30 -4 52 -22 66 -46 M0 12 C -30 -4 -52 -22 -66 -46 M0 78 C 24 66 42 52 54 32 M0 78 C -24 66 -42 52 -54 32"
                    stroke="#2f7042"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.45"
                  />
                  <circle cx="-36" cy="-34" r="9" fill="#8a5a2b" opacity="0.85" />
                  <circle cx="20" cy="44" r="12" fill="#8a5a2b" opacity="0.8" />
                  <circle cx="46" cy="-60" r="7" fill="#5f3a18" opacity="0.85" />
                </g>
                <g stroke="#285b37" strokeWidth="5" strokeLinecap="round" fill="none">
                  <path d="M70 104 V70 H104" />
                  <path d="M316 70 H350 V104" />
                  <path d="M350 286 V320 H316" />
                  <path d="M104 320 H70 V286" />
                </g>
                <g className="animate-scan-sweep-lg">
                  <rect x="86" y="189" width="248" height="6" rx="3" fill="#64a877" opacity="0.75" />
                </g>
                <defs>
                  <linearGradient id="heroLeaf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#72b681" />
                    <stop offset="1" stopColor="#418b55" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute top-5 right-5 rounded-xl border border-line bg-surface/95 px-3.5 py-2.5 shadow-soft backdrop-blur">
                <p className="text-[10px] font-medium tracking-wide text-ink-faint uppercase">Model prediction</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-ink">
                  <Leaf className="size-3.5 text-moss-600" aria-hidden="true" />
                  Looks healthy
                  <span className="font-mono text-moss-700">97%</span>
                </p>
              </div>
              <div className="absolute bottom-6 left-5 hidden rounded-xl border border-line bg-surface/95 px-3.5 py-2.5 shadow-soft backdrop-blur sm:block">
                <p className="text-[10px] font-medium tracking-wide text-ink-faint uppercase">Possible condition</p>
                <p className="mt-0.5 text-xs font-semibold text-ink">
                  Tomato — Early blight
                  <span className="ml-1.5 font-mono text-amber-700">84%</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-line bg-surface">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <h2 className="text-center text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Everything a small garden needs
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-ink-muted">
              Three simple capabilities, designed around how gardeners actually work.
            </p>
            <ul className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, description, detail }) => (
                <li key={title}>
                  <Card className="h-full p-6">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-moss-100 text-moss-700">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-base font-semibold text-ink">{title}</h3>
                    <p className="mt-1.5 text-sm font-medium text-ink-soft">{description}</p>
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">{detail}</p>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-t border-line">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  How scanning works
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
                  Three steps from photo to guidance. No accounts, no uploads to third-party services — the model
                  runs on your own device.
                </p>
                <ol className="mt-8 space-y-6">
                  {STEPS.map(({ icon: Icon, title, description }, index) => (
                    <li key={title} className="flex gap-4">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-moss-700 shadow-soft">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-ink">
                          {index + 1}. {title}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-ink-muted">{description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="self-center rounded-3xl border border-line bg-surface p-6 shadow-soft sm:p-8">
                <h3 className="text-sm font-semibold text-ink">Try it with a real photo</h3>
                <p className="mt-1.5 text-sm text-ink-muted">
                  No leaf handy? These are real photos from the open PlantVillage dataset — open the scanner and press
                  one to try.
                </p>
                <ul className="mt-5 grid grid-cols-3 gap-3">
                  {SAMPLE_IMAGES.map((sample) => (
                    <li key={sample.src}>
                      {/* eslint-disable-next-line @next/next/no-img-element -- tiny bundled sample */}
                      <img
                        src={sample.src}
                        alt={sample.label}
                        width={96}
                        height={96}
                        className="aspect-square w-full rounded-xl border border-line object-cover"
                      />
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  <LinkButton href="/scanner" variant="secondary" size="sm">
                    Open the scanner
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </LinkButton>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Model strip */}
        <section className="bg-moss-900">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:px-8">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                An honest model, running on your device
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-moss-200">
                GardenCare AI uses a MobileNetV2 classifier fine-tuned on the PlantVillage dataset, converted to ONNX
                and executed locally with ONNX Runtime Web (WebAssembly). Results are presented as estimates with a
                confidence score — never as a professional agricultural diagnosis.
              </p>
            </div>
            <dl className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-2xl bg-moss-800/80 px-3 py-4">
                <dt className="text-[11px] font-medium tracking-wide text-moss-300 uppercase">Classes</dt>
                <dd className="mt-1 font-mono text-xl font-semibold text-white">38</dd>
              </div>
              <div className="rounded-2xl bg-moss-800/80 px-3 py-4">
                <dt className="text-[11px] font-medium tracking-wide text-moss-300 uppercase">Accuracy</dt>
                <dd className="mt-1 font-mono text-xl font-semibold text-white">95.4%</dd>
              </div>
              <div className="rounded-2xl bg-moss-800/80 px-3 py-4">
                <dt className="text-[11px] font-medium tracking-wide text-moss-300 uppercase">Uploads</dt>
                <dd className="mt-1 font-mono text-xl font-semibold text-white">0</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="rounded-3xl border border-moss-200 bg-moss-50 px-6 py-12 text-center sm:px-12">
            <LogoMark className="mx-auto size-12" />
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Ready to check a leaf?</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
              The scanner takes about ten seconds. Your photos never leave the device — not for the model, not for
              anything.
            </p>
            <div className="mt-7">
              <LinkButton href="/scanner" size="lg">
                Open the scanner
                <ArrowRight className="size-4" aria-hidden="true" />
              </LinkButton>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-surface">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-start justify-between gap-10">
            <div className="max-w-sm">
              <Logo />
              <p className="mt-3 text-xs leading-relaxed text-ink-muted">{DISCLAIMER}</p>
            </div>
            <nav aria-label="Footer" className="grid grid-cols-2 gap-x-14 gap-y-2.5 text-sm">
              <Link href="/dashboard" className="text-ink-soft transition-colors hover:text-ink">
                Dashboard
              </Link>
              <Link href="/scanner" className="text-ink-soft transition-colors hover:text-ink">
                Plant Scanner
              </Link>
              <Link href="/plants" className="text-ink-soft transition-colors hover:text-ink">
                My Plants
              </Link>
              <Link href="/history" className="text-ink-soft transition-colors hover:text-ink">
                Scan History
              </Link>
              <Link href="/reports" className="text-ink-soft transition-colors hover:text-ink">
                Problem Reports
              </Link>
              <Link href="/tips" className="text-ink-soft transition-colors hover:text-ink">
                Care Tips
              </Link>
            </nav>
          </div>
          <p className="mt-10 text-xs leading-relaxed text-ink-faint">
            A Design Thinking prototype for AI-assisted plant health identification. Model credits: MobileNetV2
            fine-tune published on Hugging Face; dataset: {MODEL_INFO.datasetName} by {MODEL_INFO.datasetAuthors}.
            Results are estimates, not professional advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
