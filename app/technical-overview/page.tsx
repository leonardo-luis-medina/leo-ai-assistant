import Link from "next/link";

function ImagePlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-700 bg-neutral-900/30 px-6 text-center">
      <span className="text-2xl">🖼️</span>
      <p className="text-sm font-medium text-neutral-400">Screenshot needed</p>
      <p className="text-xs text-neutral-600">{label}</p>
    </div>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-sm font-semibold text-neutral-300">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-neutral-200">{title}</h3>
        <p className="mt-1 text-sm text-neutral-500">{children}</p>
      </div>
    </div>
  );
}

export default function DocumentationPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <section className="border-b border-neutral-800 px-6 py-14">
        <div className="mx-auto max-w-4xl">


          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 rounded-lg border border-sky-500/40 bg-sky-500/10 px-6 py-3 text-base font-semibold text-sky-200 transition hover:border-sky-400/60 hover:bg-sky-500/20"
          >
             Back to Main Page
          </Link>



          <p className="mt-4 mb-2 text-sm font-medium uppercase tracking-wider text-neutral-500">
            Documentation
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">How This System Works</h1>
          <p className="mt-4 max-w-2xl text-lg text-neutral-400">
            A technical walkthrough of the AI executive assistant: what it does,
            how it&apos;s built, and how the pieces connect.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="border-b border-neutral-800 px-6 py-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-xl font-semibold text-neutral-200">Overview</h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-400">
            {/* REPLACE THIS: 2-3 sentences in your own words on why you built this */}
            This system connects my Google Calendar and Gmail to an AI model that
            reads both every day and produces a morning brief, an inbox triage,
            and a weekly review — automatically, without me opening either app.
            Every output is saved permanently so I have a running history of
            what the system has done, and a public-facing page shows the system
            working in real time.
          </p>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="border-b border-neutral-800 px-6 py-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-xl font-semibold text-neutral-200">Tech Stack</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { name: "Next.js (App Router)", role: "Framework — pages, API routes, all hosted as one app" },
              { name: "Vercel", role: "Hosting, deployment, and free scheduled Cron Jobs" },
              { name: "Google Calendar API + Gmail API", role: "Reads live calendar events and email metadata via OAuth" },
              { name: "Google OAuth (refresh token)", role: "Lets the system authenticate without me manually logging in each run" },
              { name: "Gemini API", role: "Summarizes calendar + email data into readable briefs, and rewrites content for public/redacted display" },
              { name: "Neon Postgres (via Vercel)", role: "Stores every generated output permanently, powering the live portfolio feed" },
              { name: "TypeScript", role: "Type-safe code across all routes and pages" },
              { name: "Tailwind CSS", role: "Styling for both the portfolio and documentation pages" },
            ].map((item) => (
              <div key={item.name} className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
                <h3 className="text-sm font-semibold text-neutral-200">{item.name}</h3>
                <p className="mt-1 text-xs text-neutral-500">{item.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b border-neutral-800 px-6 py-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-xl font-semibold text-neutral-200">How It Works</h2>
          <div className="mt-8 space-y-8">
            <Step number={1} title="Scheduled trigger">
              Vercel Cron fires two jobs daily — Morning Brief and Inbox Triage —
              at set UTC times. Weekly Review runs on demand for now (Hobby plan
              allows 2 daily crons).
            </Step>
            <Step number={2} title="Live data fetch">
              Each route authenticates with Google using a stored refresh token
              (no manual login needed), then pulls today&apos;s Calendar events
              and recent Gmail messages via their respective APIs.
            </Step>
            <Step number={3} title="AI summarization">
              The raw calendar and email data is sent to Gemini with a specific
              prompt per route (brief, triage-by-urgency, or weekly review),
              which returns a written summary.
            </Step>
            <Step number={4} title="Redaction pass">
              Before saving, a second Gemini call rewrites the summary for
              public display — replacing real names, companies, and account
              details with generic placeholders — while keeping the original
              intact for owner-only viewing.
            </Step>
            <Step number={5} title="Persisted to database">
              Both the original and redacted versions are saved as a row in
              Neon Postgres, timestamped, so a permanent history builds up
              over time.
            </Step>
            <Step number={6} title="Displayed live">
              The /portfolio page fetches the latest rows from the database on
              load (and on manual refresh), rendering them as cards. Visitors
              see the redacted version by default; a password unlocks the
              original for the owner.
            </Step>
          </div>
        </div>
      </section>

      {/* Screenshots */}
      <section className="border-b border-neutral-800 px-6 py-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-xl font-semibold text-neutral-200">System Evidence</h2>
          <p className="mt-2 text-sm text-neutral-500">
            Screenshots proving the system exists and runs for real.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <ImagePlaceholder label="Vercel Cron Jobs settings page — showing both scheduled jobs, active" />
            <ImagePlaceholder label="Google Cloud Console OAuth consent screen — showing Calendar + Gmail scopes granted" />
            <ImagePlaceholder label="Neon SQL Editor — SELECT * FROM outputs; showing real saved rows" />
            <ImagePlaceholder label="Vercel Deployments tab — showing successful production deployment" />
            <ImagePlaceholder label="The /portfolio page itself — Redacted tab, live outputs visible" />
          </div>
        </div>
      </section>

      {/* Reflection */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-4xl">
          
          




          
        </div>
      </section>
    </main>
  );
}