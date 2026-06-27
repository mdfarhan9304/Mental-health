import Link from "next/link";
import { HELPLINES } from "@/lib/safety";

/* ── Landing page — built to design.md ("hand-drawn research field notes on
   warm paper"): editorial serif headlines, mono eyebrows with a colored dot,
   teal-primary / navy-secondary / ghost-outline pill buttons, flat mint &
   blush surface bands (no shadows), full-bleed warm canvas, stat strip,
   two-column feature cards, hand-drawn line doodles. ───────────────────── */

export default function Landing() {
  return (
    <div className="relative overflow-hidden">
      <SiteHeader />

      {/* ───────────── Hero ───────────── */}
      <section className="relative mx-auto max-w-[1200px] px-5 pb-20 pt-14 sm:px-8 sm:pt-20">
        {/* floating doodles */}
        <Sparkle className="absolute left-6 top-10 hidden text-sage sm:block" />
        <Squiggle className="absolute right-10 top-24 hidden text-dusty-rose lg:block" />
        <PlantDoodle className="absolute bottom-6 left-2 hidden text-lake-teal lg:block" />

        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="animate-fade-up">
            <Eyebrow dot="bg-sage">For NEET · JEE · CUET · CAT · GATE · UPSC</Eyebrow>
            <h1 className="mt-4 font-display text-4xl font-medium leading-[1.12] tracking-tight text-pine-shadow sm:text-5xl lg:text-6xl">
              A calmer mind
              <br />
              between the{" "}
              <span className="italic text-deep-teal">mock tests.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-charcoal-navy/80">
              MindBalance is your empathetic AI companion through exam season. It
              reads your journal for the stress triggers a tracker misses, talks
              you through the hard evenings, and helps you breathe — whenever you
              need it.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/login?mode=signup"
                className="rounded-full bg-deep-teal px-6 py-3 text-sm font-medium text-paper-white transition-colors hover:bg-forest-floor"
              >
                Create your free account
              </Link>
              <a
                href="#features"
                className="rounded-full border border-pine-shadow px-6 py-3 text-sm font-medium text-pine-shadow transition-colors hover:bg-card-mint"
              >
                See how it works
              </a>
            </div>

            <p className="mt-4 font-mono text-xs tracking-wide text-charcoal-navy/55">
              Free to start · works in Hindi, Hinglish &amp; English · synced
              securely to your account
            </p>
          </div>

          <HeroArt className="animate-fade-up" />
        </div>
      </section>

      {/* ───────────── Stat strip ───────────── */}
      <section className="border-y border-charcoal-navy/15 bg-paper-white">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-8 gap-y-2 px-5 py-4 text-center font-mono text-xs uppercase tracking-wide text-charcoal-navy/70 sm:px-8">
          <Stat n="24×7" label="always there" />
          <Divider />
          <Stat n="100%" label="private &amp; secure" />
          <Divider />
          <Stat n="6 exams" label="NEET to UPSC" />
          <Divider />
          <Stat n="0" label="judgment" />
        </div>
      </section>

      {/* ───────────── You're not alone ───────────── */}
      <Familiar />

      {/* ───────────── Features ───────────── */}
      <section id="features" className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8">
        <div className="max-w-2xl">
          <Eyebrow dot="bg-deep-teal">What it does</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-medium leading-tight text-pine-shadow sm:text-4xl">
            Five gentle tools, one steady companion.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <FeatureCard
            tone="mint"
            eyebrow="Journal"
            title="Insight beneath the words"
            body="Write freely about the day. The AI surfaces the hidden triggers and emotions underneath — the patterns a mood slider can't see."
            points={["Hidden stress triggers", "Emotions named", "Coping ideas for you"]}
          />
          <FeatureCard
            tone="mint"
            eyebrow="Companion · voice"
            title="Talk to it — in your language"
            body="An empathetic chat that listens first, then offers one small, doable nudge. Speak in English, Hindi, or Hinglish and hear it reply in a natural Indian voice."
            points={[
              "🎙️ Speak or type",
              "🔊 Replies read aloud",
              "Hindi / Hinglish ready",
            ]}
          />
          <FeatureCard
            tone="mint"
            eyebrow="Trends"
            title="See the shape of your weeks"
            body="Quick mood and energy check-ins become a clear picture — and the AI reads across them to point out what you might miss."
            points={["Mood & energy charts", "AI-surfaced patterns", "Spot burnout early"]}
          />
          <FeatureCard
            tone="mint"
            eyebrow="Reset"
            title="Two-minute calm, on demand"
            body="Adaptive breathing and grounding exercises, picked for how you feel right now, with a guide that breathes along with you."
            points={["Box & 4-7-8 breathing", "5-4-3-2-1 grounding", "Picked for your state"]}
          />
          {/* full-width safety card on warm blush surface */}
          <div className="md:col-span-2">
            <FeatureCard
              tone="blush"
              eyebrow="Always-on safety net"
              title="You're never carried alone"
              body="If a moment turns heavy, MindBalance gently surfaces free, confidential helplines and responds with care — never clinical, never alarming."
              points={HELPLINES.slice(0, 3).map((h) => `${h.name} · ${h.contact}`)}
            />
          </div>
        </div>
      </section>

      {/* ───────────── See it in action ───────────── */}
      <ReflectionDemo />

      {/* ───────────── Coping toolkit ───────────── */}
      <Toolkit />

      {/* ───────────── How it works (warm band) ───────────── */}
      <section id="how" className="bg-blush-sand">
        <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8">
          <Eyebrow dot="bg-dusty-rose">How it works</Eyebrow>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-medium leading-tight text-pine-shadow sm:text-4xl">
            Three small steps. No account, no setup.
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <Step
              n="01"
              title="Check in"
              body="A two-tap mood log, or a few honest lines in your journal — whatever feels easy today."
            />
            <Step
              n="02"
              title="Get reflection"
              body="The AI mirrors back what it notices: your triggers, your emotions, and one or two things that might help."
            />
            <Step
              n="03"
              title="Find your footing"
              body="Talk it out, breathe through it, and watch your patterns over time — at your own pace."
            />
          </div>
        </div>
      </section>

      {/* ───────────── Gentle reminder ───────────── */}
      <Affirmation />

      {/* ───────────── Privacy line ───────────── */}
      <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8">
        <div className="flex flex-col items-start gap-4 rounded-xl border border-mint-mist bg-card-mint p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <Eyebrow dot="bg-lake-teal">Private by design</Eyebrow>
            <h3 className="mt-2 font-display text-2xl font-medium text-pine-shadow">
              Your journal stays yours.
            </h3>
            <p className="mt-2 text-charcoal-navy/75">
              Everything is tied to your account and protected by row-level
              security — only you can ever read your entries. Synced safely so
              they&apos;re with you on every device.
            </p>
          </div>
          <span className="select-none text-6xl">🔒</span>
        </div>
      </section>

      {/* ───────────── Final CTA (cool band) ───────────── */}
      <section className="bg-card-mint">
        <div className="mx-auto max-w-[1200px] px-5 py-20 text-center sm:px-8">
          <Sparkle className="mx-auto mb-4 text-sage" />
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-medium leading-tight text-pine-shadow sm:text-4xl lg:text-5xl">
            Exams are hard. Carrying it alone is harder.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-charcoal-navy/80">
            Start a journal entry, or just say hi to your companion. It&apos;s
            here whenever you need it.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/login"
              className="rounded-full bg-deep-teal px-7 py-3 text-sm font-medium text-paper-white transition-colors hover:bg-forest-floor"
            >
              Open MindBalance
            </Link>
            <Link
              href="/login?mode=signup"
              className="rounded-full bg-ink-navy px-7 py-3 text-sm font-medium text-paper-white transition-colors hover:opacity-90"
            >
              Create free account
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

/* ───────────────────────── building blocks ───────────────────────── */

function SiteHeader() {
  const NAV = [
    { href: "#features", label: "Features" },
    { href: "#how", label: "How it works" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-mint-mist/60 bg-paper-white/85 backdrop-blur">
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-deep-teal text-paper-white">
            <span className="text-base">🌿</span>
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-pine-shadow">
            MindBalance
          </span>
        </Link>

        <ul className="hidden items-center gap-1 text-sm sm:flex">
          {NAV.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-3 py-1.5 text-charcoal-navy/70 transition-colors hover:bg-card-mint hover:text-pine-shadow"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-full border border-pine-shadow px-4 py-2 text-sm font-medium text-pine-shadow transition-colors hover:bg-card-mint"
          >
            Log in
          </Link>
          <Link
            href="/login?mode=signup"
            className="rounded-full bg-deep-teal px-4 py-2 text-sm font-medium text-paper-white transition-colors hover:bg-forest-floor"
          >
            Register
          </Link>
        </div>
      </nav>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-charcoal-navy/15 bg-paper-white">
      <div className="mx-auto max-w-[1200px] px-5 py-10 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-deep-teal text-paper-white">
              🌿
            </span>
            <span className="font-display text-base font-semibold text-pine-shadow">
              MindBalance
            </span>
          </div>
          <p className="max-w-md font-mono text-[11px] leading-relaxed tracking-wide text-charcoal-navy/60">
            A supportive companion, not a substitute for professional care. In a
            crisis, please reach out — Tele-MANAS 14416 · KIRAN 1800-599-0019.
          </p>
        </div>
      </div>
    </footer>
  );
}

function Eyebrow({
  children,
  dot,
  center = false,
}: {
  children: React.ReactNode;
  dot: string;
  center?: boolean;
}) {
  return (
    <p
      className={`flex items-center font-mono text-xs uppercase tracking-[0.06em] text-pine-shadow ${
        center ? "justify-center" : ""
      }`}
    >
      <span className={`mr-2 inline-block h-1.5 w-1.5 rounded-full ${dot}`} />
      {children}
    </p>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <span>
      <span className="font-semibold text-deep-teal">{n}</span>{" "}
      <span className="text-charcoal-navy/60">{label}</span>
    </span>
  );
}

function Divider() {
  return <span aria-hidden className="text-charcoal-navy/25">|</span>;
}

function FeatureCard({
  tone,
  eyebrow,
  title,
  body,
  points,
}: {
  tone: "mint" | "blush";
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
}) {
  const surface =
    tone === "mint"
      ? "border-mint-mist bg-card-mint"
      : "border-dusty-rose/70 bg-blush-sand";
  return (
    <div className={`rounded-xl border p-7 ${surface}`}>
      <Eyebrow dot={tone === "mint" ? "bg-sage" : "bg-dusty-rose"}>
        {eyebrow}
      </Eyebrow>
      <h3 className="mt-3 font-display text-xl font-medium text-pine-shadow">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-charcoal-navy/80">{body}</p>
      <ul className="mt-4 space-y-1.5">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm text-charcoal-navy/85">
            <span className="font-semibold text-deep-teal">✓</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-dusty-rose/50 bg-paper-white/70 p-6">
      <span className="font-mono text-sm font-semibold tracking-wide text-deep-teal">
        {n}
      </span>
      <h3 className="mt-2 font-display text-xl font-medium text-pine-shadow">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-charcoal-navy/80">{body}</p>
    </div>
  );
}

/* ───────────────────────── mental-health sections ───────────────────────── */

function Familiar() {
  const items = [
    { icon: "📉", text: "I keep comparing my rank to everyone else's." },
    { icon: "🌀", text: "I study for hours but nothing seems to stick." },
    { icon: "🌙", text: "I can't sleep the night before a test." },
    { icon: "💭", text: "I feel like I'm letting my parents down." },
    { icon: "🧠", text: "My mind goes blank the moment the paper starts." },
    { icon: "⏳", text: "I feel guilty every time I take a break." },
  ];
  return (
    <section className="bg-card-mint">
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8">
        <div className="max-w-2xl">
          <Eyebrow dot="bg-dusty-rose">You&apos;re not alone</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-medium leading-tight text-pine-shadow sm:text-4xl">
            Does any of this sound familiar?
          </h2>
          <p className="mt-3 text-charcoal-navy/75">
            Exam season has a way of making the loudest thoughts feel like
            facts. They&apos;re not — and naming them is the first step.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div
              key={it.text}
              className="flex items-start gap-3 rounded-xl border border-mint-mist bg-paper-white p-5"
            >
              <span className="text-2xl leading-none">{it.icon}</span>
              <p className="text-sm leading-relaxed text-charcoal-navy/85">
                “{it.text}”
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 font-display text-lg italic text-forest-floor">
          If you nodded at even one — that&apos;s exactly who MindBalance is for.
        </p>
      </div>
    </section>
  );
}

function ReflectionDemo() {
  const triggers = [
    "Mock score dropping",
    "Comparing on social media",
    "All-nighters",
    "Parents' expectations",
  ];
  const emotions = ["anxiety", "shame", "exhaustion"];
  const coping = [
    "Mute the score posts for tonight — one less comparison.",
    "Understand one physics mistake, not the whole paper.",
    "A fixed 11pm wind-down helps recall more than the extra hour.",
  ];
  return (
    <section className="bg-blush-sand">
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8">
        <div className="max-w-2xl">
          <Eyebrow dot="bg-deep-teal">See it in action</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-medium leading-tight text-pine-shadow sm:text-4xl">
            From a hard evening to something you can hold.
          </h2>
          <p className="mt-3 text-charcoal-navy/75">
            You write honestly. MindBalance reflects back the triggers and
            feelings underneath — then offers a few small, doable next steps.
          </p>
        </div>

        <div className="mt-10 grid items-start gap-5 lg:grid-cols-2">
          {/* the entry */}
          <div className="rounded-xl border border-dusty-rose/60 bg-paper-white p-6">
            <p className="font-mono text-xs uppercase tracking-wider text-charcoal-navy/55">
              Mon · 9:42 pm · your journal
            </p>
            <p className="mt-3 font-display text-base italic leading-relaxed text-charcoal-navy/90">
              “Bombed my physics mock again. Everyone in my batch is posting
              their scores and I just feel sick scrolling. Stayed up till 2
              trying to fix it, slept through my alarm, now I&apos;m behind on
              chem too. I keep thinking I&apos;m wasting my parents&apos;
              money.”
            </p>
          </div>

          {/* the reflection */}
          <div className="rounded-xl border border-mint-mist bg-card-mint p-6">
            <p className="font-mono text-xs uppercase tracking-wider text-deep-teal">
              What I&apos;m noticing
            </p>
            <p className="mt-2 font-display text-lg leading-snug text-pine-shadow">
              That&apos;s a heavy pile-up — a tough result, the comparison
              spiral, and lost sleep all at once. No wonder it feels like a lot.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1.5 font-mono text-xs uppercase tracking-wider text-charcoal-navy/55">
                  Hidden triggers
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {triggers.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-dusty-rose/70 bg-blush-sand px-2.5 py-1 text-xs text-charcoal-navy"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-1.5 font-mono text-xs uppercase tracking-wider text-charcoal-navy/55">
                  Emotions
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {emotions.map((e) => (
                    <span
                      key={e}
                      className="rounded-full border border-mint-mist bg-sea-foam/60 px-2.5 py-1 text-xs text-pine-shadow"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-1.5 font-mono text-xs uppercase tracking-wider text-charcoal-navy/55">
                Things that might help
              </p>
              <ul className="space-y-1.5">
                {coping.map((c) => (
                  <li
                    key={c}
                    className="flex gap-2 text-sm text-charcoal-navy/90"
                  >
                    <span className="text-sage">›</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-4 rounded-xl bg-paper-white/70 p-3 font-display text-sm italic text-forest-floor">
              One rough mock isn&apos;t the story of your prep. You showed up
              here — that counts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Toolkit() {
  const tools = [
    {
      icon: "🫁",
      title: "Breathing resets",
      body: "Box and 4-7-8 breathing to steady racing thoughts before you sit down.",
    },
    {
      icon: "🌍",
      title: "5-4-3-2-1 grounding",
      body: "A senses exercise to pull yourself out of a spiral and back into the room.",
    },
    {
      icon: "🔁",
      title: "Thought reframing",
      body: "Catch the “I'm a failure” thought and gently test whether it's actually true.",
    },
    {
      icon: "📆",
      title: "Kinder study pacing",
      body: "Focused blocks with real breaks — sustainable beats heroic all-nighters.",
    },
    {
      icon: "🌙",
      title: "Rest without guilt",
      body: "Sleep and breaks are part of the prep, not a betrayal of it.",
    },
    {
      icon: "💬",
      title: "Saying it out loud",
      body: "Voice the scary thought to a companion that listens without judging.",
    },
  ];
  return (
    <section className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8">
      <div className="max-w-2xl">
        <Eyebrow dot="bg-sage">What you&apos;ll build</Eyebrow>
        <h2 className="mt-3 font-display text-3xl font-medium leading-tight text-pine-shadow sm:text-4xl">
          A toolkit for the hard days.
        </h2>
        <p className="mt-3 text-charcoal-navy/75">
          Small, evidence-friendly skills you can reach for in two minutes —
          between subjects, before a test, or at 1 a.m. when sleep won&apos;t
          come.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <div
            key={t.title}
            className="rounded-xl border border-mint-mist bg-card-mint p-6"
          >
            <span className="text-2xl">{t.icon}</span>
            <h3 className="mt-3 font-display text-lg font-medium text-pine-shadow">
              {t.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-charcoal-navy/80">
              {t.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Affirmation() {
  return (
    <section className="bg-sea-foam/70">
      <div className="mx-auto max-w-[1200px] px-5 py-20 text-center sm:px-8">
        <Eyebrow dot="bg-deep-teal" center>
          Gentle reminder
        </Eyebrow>
        <p className="mx-auto mt-4 max-w-3xl font-display text-3xl font-medium leading-snug text-pine-shadow sm:text-4xl">
          A low mock score is a data point —
          <br className="hidden sm:block" />{" "}
          <span className="italic text-deep-teal">
            not a verdict on your worth.
          </span>
        </p>
        <p className="mx-auto mt-4 max-w-md text-charcoal-navy/75">
          Your rank is something you have. It was never who you are.
        </p>
      </div>
    </section>
  );
}

/* ───────────────────────── hand-drawn doodles ───────────────────────── */

function HeroArt({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <Sparkle className="absolute -right-2 -top-4 text-dusty-rose" />
      <svg
        viewBox="0 0 360 300"
        className="w-full"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        role="img"
        aria-label="A calm journaling app inside a browser window"
      >
        {/* browser frame */}
        <g className="text-illustration-ink">
          <rect x="20" y="26" width="320" height="248" rx="16" fill="#e4f0f1" />
          <line x1="20" y1="58" x2="340" y2="58" />
          <circle cx="38" cy="42" r="3.5" fill="#d6aec1" stroke="none" />
          <circle cx="50" cy="42" r="3.5" fill="#65b8a2" stroke="none" />
          <circle cx="62" cy="42" r="3.5" fill="#a2cbcd" stroke="none" />
        </g>
        {/* breathing circle */}
        <circle cx="120" cy="160" r="46" fill="#cae1e2" className="text-illustration-ink" />
        <circle cx="120" cy="160" r="28" fill="#65b8a2" className="text-illustration-ink" />
        {/* journal lines */}
        <g className="text-illustration-ink">
          <line x1="196" y1="120" x2="312" y2="120" />
          <line x1="196" y1="142" x2="300" y2="142" />
          <line x1="196" y1="164" x2="312" y2="164" />
          <line x1="196" y1="186" x2="276" y2="186" />
        </g>
        {/* little heart */}
        <path
          d="M120 250c-22-14-34-26-34-40a16 16 0 0 1 30-7 16 16 0 0 1 30 7c0 14-12 26-26 40z"
          fill="#d6aec1"
          className="text-illustration-ink"
          transform="translate(170 -2) scale(0.7)"
        />
      </svg>
    </div>
  );
}

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
      <path d="M12 9c0 1.7-1.3 3-3 3 1.7 0 3 1.3 3 3 0-1.7 1.3-3 3-3-1.7 0-3-1.3-3-3z" />
    </svg>
  );
}

function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg
      width="64"
      height="20"
      viewBox="0 0 64 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <path d="M2 14c8-12 14 6 20-2s10-12 16-2 12 8 8 0" />
    </svg>
  );
}

function PlantDoodle({ className = "" }: { className?: string }) {
  return (
    <svg
      width="40"
      height="48"
      viewBox="0 0 40 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M20 46V20" />
      <path d="M20 28c-6 0-12-4-12-12 6 0 12 4 12 12z" />
      <path d="M20 22c5 0 10-3 10-10-5 0-10 3-10 10z" />
    </svg>
  );
}
