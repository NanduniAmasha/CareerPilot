import { useEffect, useState } from "react";
import api from "../services/api";
import type { ApplicationStats } from "../types/applicationStats";
import {
  Briefcase,
  Send,
  CalendarCheck,
  Trophy,
  XCircle,
  Bookmark,
} from "lucide-react";

interface DashboardProps {
  refreshTrigger: number;
}

function Dashboard({ refreshTrigger }: DashboardProps) {
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/applications/stats");
      setStats(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="py-6 text-center text-xs text-slate-400">
        Loading pipeline statistics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
        {error}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const cards = [
    {
      title: "Total Tracked",
      value: stats.total,
      icon: Briefcase,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      title: "Saved",
      value: stats.saved,
      icon: Bookmark,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "Applied",
      value: stats.applied,
      icon: Send,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Interviewing",
      value: stats.interview,
      icon: CalendarCheck,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Offers",
      value: stats.offer,
      icon: Trophy,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      color: "text-rose-400",
      bg: "bg-rose-500/10 border-rose-500/20",
    },
  ];

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-bold tracking-tight text-white">
          Overview & Metrics
        </h2>
        <p className="text-xs text-slate-400">
          Track your real-time stage progress across all opportunities.
        </p>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-4 shadow-md transition hover:border-slate-700"
            >
              <div className="flex items-center justify-between pb-3">
                <span className="text-xs font-medium text-slate-400">
                  {card.title}
                </span>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border ${card.bg}`}
                >
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </div>

              <div className="text-2xl font-black text-white">
                {card.value}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Dashboard;