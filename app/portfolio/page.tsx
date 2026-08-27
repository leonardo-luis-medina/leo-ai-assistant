"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

type OutputRow = {
  id: number;
  route: string;
  generated_at: string;
  created_at: string;
  redactedContent: Record<string, unknown>;
  unredactedContent: Record<string, unknown> | null;
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

function getBodyText(content: Record<string, unknown> | null | undefined) {
  if (!content) return "";
  return (
    (content.brief as string) ||
    (content.triage as string) ||
    (content.review as string) ||
    JSON.stringify(content)
  );
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
  const [isAuthed, setIsAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState<"redacted" | "unredacted">("redacted");
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const fetchOutputs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/outputs", { cache: "no-store" });
      const data = await res.json();
      setOutputs(data.outputs || []);
      setIsAuthed(data.isAuthed || false);
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

  function handleTabClick(tab: "redacted" | "unredacted") {
    if (tab === "unredacted" && !isAuthed) {
      setShowLogin(true);
      return;
    }
    setActiveTab(tab);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    try {
      const res = await fetch("/api/portfolio-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setShowLogin(false);
        setPassword("");
        await fetchOutputs();
        setActiveTab("unredacted");
      } else {
        setLoginError("Incorrect password.");
      }
    } catch {
      setLoginError("Something went wrong. Try again.");
    } finally {
      setLoggingIn(false);
    }
  }

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
            AI Operating System
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


          <Link
            href="/technical-overview"
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-sky-500/40 bg-sky-500/10 px-6 py-3 text-base font-semibold text-sky-200 transition hover:border-sky-400/60 hover:bg-sky-500/20"
          >
            📄 Technical Overview
          </Link>
         

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1 text-xs text-neutral-400">Next.js</span>
            <span className="rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1 text-xs text-neutral-400">Gemini API</span>
            <span className="rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1 text-xs text-neutral-400">Google Calendar + Gmail API</span>
            <span className="rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1 text-xs text-neutral-400">Neon Postgres</span>
            <span className="rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1 text-xs text-neutral-400">Vercel Cron</span>
          </div>
        </div>
      </section>

      {/* Planning Doc */}
      <section className="border-b border-neutral-800 px-6 py-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-xl font-semibold text-neutral-200">Planning Doc</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
              <h3 className="text-sm font-semibold text-neutral-300">Task Audit</h3>
              <p className="mt-2 text-sm text-neutral-500">
                {/* REPLACE THIS */}
                12+ tasks split across Automate (morning brief, inbox triage,
                weekly review), Delegate (draft replies, meeting prep), and
                Supervise (final send on client emails, calendar conflicts).
              </p>
            </div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
              <h3 className="text-sm font-semibold text-neutral-300">Stack Design</h3>
              <p className="mt-2 text-sm text-neutral-500">
                {/* REPLACE THIS */}
                2 daily cron jobs (Morning Brief 8am, Inbox Triage 10am local),
                Gmail + Calendar connectors, Gemini for summarization, Postgres
                for output history.
              </p>
            </div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
              <h3 className="text-sm font-semibold text-neutral-300">30-Day Roadmap</h3>
              <p className="mt-2 text-sm text-neutral-500">
                {/* REPLACE THIS */}
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
                Real outputs generated by the running system.
                {lastSynced && (
                  <span className="ml-1 text-neutral-600">Last synced {formatDate(lastSynced)}</span>
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

          {/* Redacted / Unredacted toggle */}
          <div className="mt-6 flex w-fit rounded-lg border border-neutral-800 bg-neutral-900 p-1">
            <button
              onClick={() => handleTabClick("redacted")}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
                activeTab === "redacted" ? "bg-neutral-100 text-neutral-900" : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Redacted
            </button>
            <button
              onClick={() => handleTabClick("unredacted")}
              className={`flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-medium transition ${
                activeTab === "unredacted" ? "bg-neutral-100 text-neutral-900" : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {!isAuthed && <span className="text-xs">🔒</span>}
              Unredacted
            </button>
          </div>

          {/* Filter tabs */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                filter === "all" ? "bg-neutral-100 text-neutral-900" : "border border-neutral-700 text-neutral-400 hover:bg-neutral-900"
              }`}
            >
              All ({outputs.length})
            </button>
            {Object.entries(ROUTE_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  filter === key ? "bg-neutral-100 text-neutral-900" : "border border-neutral-700 text-neutral-400 hover:bg-neutral-900"
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
                No outputs yet for this filter.
              </p>
            )}
            {filtered.map((output) => {
              const isExpanded = expandedId === output.id;
              const content = activeTab === "unredacted" ? output.unredactedContent : output.redactedContent;
              const bodyText = getBodyText(content);
              const isLong = bodyText.length > 300;

              return (
                <div
                  key={output.id}
                  className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 transition hover:border-neutral-700"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className={`rounded-md border px-2.5 py-0.5 text-xs font-medium ${ROUTE_COLORS[output.route] || "bg-neutral-800 text-neutral-400 border-neutral-700"}`}>
                      {ROUTE_LABELS[output.route] || output.route}
                    </span>
                    <span className="text-xs text-neutral-600">{formatDate(output.generated_at)}</span>
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

      <footer className="border-t border-neutral-800 px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs text-neutral-600">
            The Redacted view is what visitors see by default — real names,
            companies, and account details are rewritten for privacy. Only
            the page owner can unlock the Unredacted view.
          </p>
        </div>
      </footer>

      {/* Login modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-sm rounded-xl border border-neutral-800 bg-neutral-900 p-6">
            <h3 className="text-lg font-semibold text-neutral-100">Owner login</h3>
            <p className="mt-1 text-sm text-neutral-500">
              Enter the password to view unredacted outputs.
            </p>
            <form onSubmit={handleLogin} className="mt-4 space-y-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoFocus
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-500"
              />
              {loginError && <p className="text-xs text-red-400">{loginError}</p>}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loggingIn}
                  className="flex-1 rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-white disabled:opacity-50"
                >
                  {loggingIn ? "Checking..." : "Unlock"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowLogin(false); setLoginError(""); setPassword(""); }}
                  className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}