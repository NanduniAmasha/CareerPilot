import {
  BriefcaseBusiness,
  Layers,
  BarChart3,
  Search,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenSignup: () => void;
}

export default function LandingPage({
  onOpenLogin,
  onOpenSignup,
}: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* Background ambient lighting effects */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/15 blur-[130px]" />
        <div className="absolute -right-40 top-1/4 h-96 w-96 rounded-full bg-blue-600/15 blur-[130px]" />
        <div className="absolute bottom-10 left-1/3 h-96 w-96 rounded-full bg-indigo-600/15 blur-[140px]" />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-md shadow-cyan-500/20">
              <BriefcaseBusiness className="h-5 w-5 text-slate-950" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight text-white sm:text-lg">
                CareerPilot
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-cyan-400">
                Application Tracker
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenLogin}
              className="cursor-pointer rounded-xl px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white sm:text-sm"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={onOpenSignup}
              className="cursor-pointer rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-cyan-500/20 transition hover:opacity-95 sm:text-sm"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto w-full max-w-5xl px-6 py-14 sm:py-18 lg:px-8">
        {/* Centered Hero Section */}
        <section className="mx-auto max-w-3xl space-y-7 text-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Track your applications.{" "}
              <span className="block bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
                Land your next role.
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              The simple, stress-free job application tracker. Organize every opportunity, monitor interview progress, and keep notes in one clean place.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-1.5">
            <button
              type="button"
              onClick={onOpenSignup}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-7 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:opacity-95 hover:shadow-cyan-500/35"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onOpenLogin}
              className="cursor-pointer rounded-xl border border-slate-700 bg-slate-900 px-7 py-3.5 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white"
            >
              Sign In
            </button>
          </div>

          {/* Feature Checklist */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs text-slate-400 sm:text-sm">
            {[
              "Organized pipeline (Saved to Offers)",
              "Instant search & status filtering",
              "100% Free to use",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Trust Disclaimer */}
          <div className="flex items-center justify-center gap-2 pt-1.5 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <span>No credit card required • Instant setup</span>
          </div>
        </section>

        {/* 3 Core Features Grid */}
        <section className="mt-20 sm:mt-24">
          <div className="mb-8 text-center sm:mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Everything you need to stay organized
            </h2>
            <p className="mt-1.5 text-xs text-slate-400 sm:text-sm">
              Simple tools built to give you clarity and momentum every day.
            </p>
          </div>

          <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
            {[
              {
                icon: Layers,
                title: "Application Pipeline",
                desc: "Track every opportunity across distinct stages: Saved, Applied, Interview, Offer, and Rejected.",
              },
              {
                icon: BarChart3,
                title: "Real-time Metrics",
                desc: "Monitor your interview response numbers and offer momentum at a single glance.",
              },
              {
                icon: Search,
                title: "Instant Search & Notes",
                desc: "Find any opportunity in seconds and log recruiter details, interview questions, and salary notes.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group relative rounded-2xl border border-slate-800/90 bg-slate-900/60 p-6 transition-all hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-lg"
              >
                <div className="mb-3.5 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400 transition-colors group-hover:bg-cyan-400 group-hover:text-slate-950">
                  <Icon className="h-5.5 w-5.5" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white sm:text-lg">{title}</h3>
                <p className="text-xs leading-relaxed text-slate-400 sm:text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3-Step Process */}
        <section className="mt-18 sm:mt-22 rounded-3xl border border-slate-800 bg-slate-900/40 p-7 sm:p-10">
          <div className="mb-8 text-center sm:mb-9">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              How CareerPilot Works
            </h2>
            <p className="mt-1.5 text-xs text-slate-400 sm:text-sm">
              Three easy steps to streamline your job search.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Log Your Applications",
                desc: "Quickly enter company names, job titles, and status when you apply.",
              },
              {
                step: "02",
                title: "Update As You Progress",
                desc: "Move roles from applied to interview rounds and log prep notes.",
              },
              {
                step: "03",
                title: "Compare & Accept Offers",
                desc: "Review your offers side by side and land your dream position.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative space-y-2.5">
                <div className="text-2xl font-black text-cyan-400/40 sm:text-3xl">{step}</div>
                <h3 className="text-base font-semibold text-white sm:text-lg">{title}</h3>
                <p className="text-xs leading-relaxed text-slate-400 sm:text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section className="mt-18 sm:mt-22 text-center">
          <div className="mx-auto max-w-2xl rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-cyan-950/30 to-slate-900/60 p-7 sm:p-10">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Ready to organize your job search?
            </h2>
            <p className="mt-2.5 text-xs text-slate-300 sm:text-sm">
              Join CareerPilot today and take the stress out of tracking applications.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3.5">
              <button
                type="button"
                onClick={onOpenSignup}
                className="cursor-pointer rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3.5 text-xs font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:opacity-95 sm:text-sm"
              >
                Sign Up for Free
              </button>
              <button
                type="button"
                onClick={onOpenLogin}
                className="cursor-pointer rounded-xl border border-slate-700 bg-slate-900 px-6 py-3.5 text-xs font-medium text-slate-200 transition hover:bg-slate-800 hover:text-white sm:text-sm"
              >
                Sign In
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-18 sm:mt-22 border-t border-slate-800 bg-slate-950 py-7 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-3.5 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-cyan-400 text-[9px] font-bold text-slate-950">
                CP
              </div>
              <span className="font-semibold text-slate-400">CareerPilot</span>
            </div>
            <p>© {new Date().getFullYear()} CareerPilot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
