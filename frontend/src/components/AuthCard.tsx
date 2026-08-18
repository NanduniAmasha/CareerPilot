import { useState } from "react";
import {
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import api from "../services/api";

interface AuthCardProps {
  initialTab?: "login" | "signup";
  onSuccess: () => void;
}

export default function AuthCard({
  initialTab = "login",
  onSuccess,
}: AuthCardProps) {
  const [tab, setTab] = useState<"login" | "signup">(initialTab);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // UI status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleTabSwitch = (newTab: "login" | "signup") => {
    setTab(newTab);
    setError("");
    setSuccessMsg("");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all required fields");
      return;
    }

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      setSuccessMsg("Account created! Logging you in...");

      // Automatically log the user in after registration
      const loginRes = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      localStorage.setItem("token", loginRes.data.token);
      localStorage.setItem("user", JSON.stringify(loginRes.data.user));

      setTimeout(() => {
        onSuccess();
      }, 500);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || "Registration failed. Email may already be in use."
      );
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail("demo@careerpilot.app");
    setPassword("password123");
    setError("");
  };

  return (
    <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
      {/* Tab Switcher */}
      <div className="mb-6 flex rounded-2xl border border-slate-800 bg-slate-950 p-1">
        <button
          type="button"
          onClick={() => handleTabSwitch("login")}
          className={`flex-1 rounded-xl py-2.5 text-xs font-semibold uppercase tracking-wider transition-all sm:text-sm ${
            tab === "login"
              ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => handleTabSwitch("signup")}
          className={`flex-1 rounded-xl py-2.5 text-xs font-semibold uppercase tracking-wider transition-all sm:text-sm ${
            tab === "signup"
              ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Header text */}
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          {tab === "login" ? "Welcome back" : "Create your account"}
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          {tab === "login"
            ? "Sign in to manage and track your job applications."
            : "Get started for free and organize your search."}
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-sm text-emerald-300">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Form */}
      {tab === "login" ? (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-300">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-11 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition-all hover:opacity-95 hover:shadow-cyan-500/30 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                Signing in...
              </span>
            ) : (
              <>
                Sign in to CareerPilot
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={fillDemoAccount}
              className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 hover:underline"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Fill demo credentials
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSignupSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-300">
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-300">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-11 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition-all hover:opacity-95 hover:shadow-cyan-500/30 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                Creating account...
              </span>
            ) : (
              <>
                Create Free Account
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* Switch hint */}
      <div className="mt-6 text-center text-xs text-slate-400">
        {tab === "login" ? (
          <p>
            Don&apos;t have an account yet?{" "}
            <button
              type="button"
              onClick={() => handleTabSwitch("signup")}
              className="cursor-pointer font-medium text-cyan-400 hover:underline"
            >
              Sign up for free
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => handleTabSwitch("login")}
              className="cursor-pointer font-medium text-cyan-400 hover:underline"
            >
              Sign in
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
