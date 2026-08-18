import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  LogOut,
  Search,
  Building2,
  Trash2,
  Edit3,
} from "lucide-react";
import api from "./services/api";
import type { Application } from "./types/application";
import ApplicationForm from "./components/ApplicationForm";
import EditApplicationForm from "./components/EditApplicationForm";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";

interface StoredUser {
  id: number;
  name: string;
  email: string;
}

function App() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("token")
  );

  const [authView, setAuthView] = useState<"landing" | "login" | "signup">(
    "landing"
  );
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [signupMessage, setSignupMessage] = useState("");

  const [user, setUser] = useState<StoredUser | null>(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = () => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
    setRegisteredEmail("");
    setSignupMessage("");
    setIsAuthenticated(true);
    setAuthView("landing");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setApplications([]);
    setSearch("");
    setStatusFilter("ALL");
    setEditingId(null);
    setError("");
    setUser(null);
    setRegisteredEmail("");
    setSignupMessage("");
    setIsAuthenticated(false);
    setAuthView("landing");
  };

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/applications");
      setApplications(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadApplications();
    } else {
      setApplications([]);
      setError("");
    }
  }, [isAuthenticated]);

  const deleteApplication = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/applications/${id}`);
      loadApplications();
      setRefreshTrigger((value) => value + 1);
    } catch (err) {
      console.error(err);
      setError("Failed to delete application.");
    }
  };

  const filteredApplications = applications.filter((application) => {
    const searchText = search.toLowerCase().trim();
    const matchesSearch =
      application.company.toLowerCase().includes(searchText) ||
      application.position.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "ALL" || application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // If user is not authenticated, render Landing Page, Login, or Register based on authView
  if (!isAuthenticated) {
    if (authView === "login") {
      return (
        <Login
          initialEmail={registeredEmail}
          successMessage={signupMessage}
          onLogin={handleLoginSuccess}
          onNavigateToSignup={() => {
            setSignupMessage("");
            setAuthView("signup");
          }}
          onBackToHome={() => {
            setSignupMessage("");
            setAuthView("landing");
          }}
        />
      );
    }

    if (authView === "signup") {
      return (
        <Register
          onRegisterSuccess={(email) => {
            setRegisteredEmail(email);
            setSignupMessage("Account created! Please sign in with your credentials.");
            setAuthView("login");
          }}
          onNavigateToLogin={() => {
            setSignupMessage("");
            setAuthView("login");
          }}
          onBackToHome={() => {
            setSignupMessage("");
            setAuthView("landing");
          }}
        />
      );
    }

    return (
      <LandingPage
        onOpenLogin={() => {
          setSignupMessage("");
          setAuthView("login");
        }}
        onOpenSignup={() => {
          setSignupMessage("");
          setAuthView("signup");
        }}
      />
    );
  }

  // Authenticated Dashboard
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-md shadow-cyan-500/20">
              <BriefcaseBusiness className="h-5 w-5 text-slate-950" />
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight text-white">
                CareerPilot
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-cyan-400">
                Application Tracker
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <span className="hidden text-xs font-medium text-slate-400 sm:inline-block">
                Signed in as <strong className="text-slate-200">{user.name}</strong>
              </span>
            )}
            <button
              type="button"
              onClick={logout}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {/* Metric Statistics Section */}
        <Dashboard refreshTrigger={refreshTrigger} />

        {/* Add Application Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-xl sm:p-6">
          <ApplicationForm
            onSaved={() => {
              loadApplications();
              setRefreshTrigger((v) => v + 1);
            }}
          />
        </div>

        {/* Applications List & Filter */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-xl sm:p-6">
          <div className="mb-6 flex flex-col gap-4 border-b border-slate-800 pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Your Job Pipeline
              </h2>
              <p className="text-xs text-slate-400">
                {filteredApplications.length} of {applications.length} applications shown
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Search */}
              <div className="relative min-w-[220px]">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search company or role..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 outline-none transition focus:border-cyan-500"
                />
              </div>

              {/* Status Filter */}
              <div className="min-w-[160px]">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white outline-none transition focus:border-cyan-500"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="SAVED">Saved</option>
                  <option value="APPLIED">Applied</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="OFFER">Offer</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {loading && (
            <div className="py-12 text-center text-xs text-slate-400">
              Loading applications...
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300">
              {error}
            </div>
          )}

          {!loading && !error && filteredApplications.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center text-xs text-slate-400">
              <Building2 className="mx-auto mb-3 h-8 w-8 text-slate-600" />
              <p className="font-medium text-slate-300">No applications found</p>
              <p className="mt-1 text-slate-500">
                {search || statusFilter !== "ALL"
                  ? "Try adjusting your search or filter"
                  : "Add your first application using the form above"}
              </p>
            </div>
          )}

          {/* Cards List */}
          <div className="space-y-3">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-slate-700"
              >
                {editingId === app.id ? (
                  <EditApplicationForm
                    application={app}
                    onSaved={() => {
                      setEditingId(null);
                      loadApplications();
                      setRefreshTrigger((v) => v + 1);
                    }}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-white">
                          {app.company}
                        </h3>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            app.status === "OFFER"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : app.status === "INTERVIEW"
                              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                              : app.status === "APPLIED"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : app.status === "SAVED"
                              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                              : "bg-red-500/20 text-red-300 border border-red-500/30"
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300">
                        Position:{" "}
                        <span className="font-semibold text-slate-100">
                          {app.position}
                        </span>
                      </p>

                      {app.notes && (
                        <p className="text-xs text-slate-400">
                          <span className="text-slate-500">Notes:</span> {app.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        type="button"
                        onClick={() => setEditingId(app.id)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteApplication(app.id)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-300 transition hover:bg-red-500/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;