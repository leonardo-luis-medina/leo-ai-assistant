"use client";

import { useEffect, useState, useCallback } from "react";

type OutputRow = {
  id: number;
  route: string;
  generated_at: string;
  content: {
    brief?: string;
    triage?: string;
    review?: string;
    [key: string]: unknown;
  };
  created_at: string;
};

const ROUTE_LABELS: Record<string, string> = {
  "morning-brief": "Morning Brief",
  "inbox-triage": "Inbox Triage",
  "weekly-review": "Weekly Review",
};

const ROUTE_COLORS: Record<string, string> = {
  "morning-brief": "bg-amber-500/15 text-amber-300 border-amber-500/30",
  "inbox-triage": "bg-sky-500/15 text-sky-300 border-sky-500/30",
  "weekly-review": "bg-violet-500/15 text-violet-300 border-violet-500/30",
};

function getBodyText(content: OutputRow["content"]) {
  return content.brief || content.triage || content.review || JSON.stringify(content);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function PortfolioPage() {
  const [outputs, setOutputs] = useState<OutputRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  const fetchOutputs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/outputs", { cache: "no-store" });
      const data = await res.json();
      setOutputs(data.outputs || []);
      setLastSynced(new Date().toISOString());
    } catch (err) {
      console.error("Failed to fetch outputs", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOutputs();
  }, [fetchOutputs]);

  const filtered = filter === "all" ? outputs : outputs.filter((o) => o.route === filter);
  const routeCounts = outputs.reduce<Record<string, number>>((acc, o) => {
    acc[o.route] = (acc[o.route] || 0) + 1;
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Hero */}
      <section className="border-b border-neutral-800 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-neutral-500">
            AI Operating System — Case Study
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Leo&apos;s AI Executive Assistant
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-neutral-400">
            {/* REPLACE THIS: 1-2 sentence pitch tailored to your target role */}
            A self-running system that reads my Calendar and Gmail every morning,
            triages my inbox, and writes a weekly review — so I spend less time
            managing my day and more time doing the work that matters.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1 text-xs text-neutral-400">
              Next.js
            </span>
            <span className="rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1 text-xs text-neutral-400">
              Gemini API
            </span>
            <span className="rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1 text-xs text-neutral-400">
              Google Calendar + Gmail API
            </span>
            <span className="rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1 text-xs text-neutral-400">
              Neon Postgres
            </span>
            <span className="rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1 text-xs text-neutral-400">
              Vercel Cron
            </span>
          </div>
        </div>
      </section>

      {/* Task Audit / Stack Design / Roadmap */}
      <section className="border-b border-neutral-800 px-6 py-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-xl font-semibold text-neutral-200">Planning Doc</h2>

          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
              <h3 className="text-sm font-semibold text-neutral-300">Task Audit</h3>
              <p className="mt-2 text-sm text-neutral-500">
                {/* REPLACE THIS: your Automate / Delegate / Supervise breakdown */}
                12+ tasks split across Automate (morning brief, inbox triage,
                weekly review), Delegate (draft replies, meeting prep), and
                Supervise (final send on client emails, calendar conflicts).
              </p>
            </div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
              <h3 className="text-sm font-semibold text-neutral-300">Stack Design</h3>
              <p className="mt-2 text-sm text-neutral-500">
                {/* REPLACE THIS: your scheduled tasks + connectors summary */}
                2 daily cron jobs (Morning Brief 8am, Inbox Triage 10am local),
                Gmail + Calendar connectors, Gemini for summarization, Postgres
                for output history.
              </p>
            </div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
              <h3 className="text-sm font-semibold text-neutral-300">30-Day Roadmap</h3>
              <p className="mt-2 text-sm text-neutral-500">
                {/* REPLACE THIS: week-by-week specifics */}
                Week 1: connect Gmail + Calendar, run inbox triage manually 3x.
                Week 2: automate morning brief + triage. Week 3: add weekly
                review + output storage. Week 4: portfolio + polish.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Outputs */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-neutral-200">Live System Output</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Real outputs generated by the running system — not screenshots.
                {lastSynced && (
                  <span className="ml-1 text-neutral-600">
                    Last synced {formatDate(lastSynced)}
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={fetchOutputs}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800 disabled:opacity-50"
            >
              <span className={loading ? "animate-spin" : ""}>&#8635;</span>
              {loading ? "Syncing..." : "Refresh"}
            </button>
          </div>

          {/* Filter tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                filter === "all"
                  ? "bg-neutral-100 text-neutral-900"
                  : "border border-neutral-700 text-neutral-400 hover:bg-neutral-900"
              }`}
            >
              All ({outputs.length})
            </button>
            {Object.entries(ROUTE_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  filter === key
                    ? "bg-neutral-100 text-neutral-900"
                    : "border border-neutral-700 text-neutral-400 hover:bg-neutral-900"
                }`}
              >
                {label} ({routeCounts[key] || 0})
              </button>
            ))}
          </div>

          {/* Output cards */}
          <div className="mt-6 space-y-4">
            {loading && outputs.length === 0 && (
              <p className="py-12 text-center text-sm text-neutral-600">Loading outputs...</p>
            )}

            {!loading && filtered.length === 0 && (
              <p className="py-12 text-center text-sm text-neutral-600">
                No outputs yet for this filter. Let the crons run, or trigger a route manually.
              </p>
            )}

            {filtered.map((output) => {
              const isExpanded = expandedId === output.id;
              const bodyText = getBodyText(output.content);
              const isLong = bodyText.length > 300;

              return (
                <div
                  key={output.id}
                  className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 transition hover:border-neutral-700"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`rounded-md border px-2.5 py-0.5 text-xs font-medium ${
                        ROUTE_COLORS[output.route] || "bg-neutral-800 text-neutral-400 border-neutral-700"
                      }`}
                    >
                      {ROUTE_LABELS[output.route] || output.route}
                    </span>
                    <span className="text-xs text-neutral-600">
                      {formatDate(output.generated_at)}
                    </span>
                  </div>

                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-neutral-300">
                    {isExpanded || !isLong ? bodyText : `${bodyText.slice(0, 300)}...`}
                  </p>

                  {isLong && (
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : output.id)}
                      className="mt-3 text-xs font-medium text-neutral-500 hover:text-neutral-300"
                    >
                      {isExpanded ? "Show less" : "Show full output"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer note */}
      <footer className="border-t border-neutral-800 px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs text-neutral-600">
            Outputs are generated automatically by scheduled jobs reading live
            Calendar and Gmail data, summarized with Gemini, and stored in
            Postgres. Sensitive sender/recipient details are not displayed on
            this page.
          </p>
        </div>
      </footer>
    </main>
  );
}