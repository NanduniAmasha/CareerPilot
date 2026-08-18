import { useState } from "react";
import {
  BriefcaseBusiness,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import api from "../services/api";

interface LoginProps {
  initialEmail?: string;
  successMessage?: string;
  onLogin: () => void;
  onNavigateToSignup: () => void;
  onBackToHome: () => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login({
  initialEmail = "",
  successMessage = "",
  onLogin,
  onNavigateToSignup,
  onBackToHome,
}: LoginProps) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateForm = () => {
    const errors: typeof fieldErrors = {};

    if (!email.trim()) {
      errors.email = "Email address is required";
    } else if (!EMAIL_REGEX.test(email.trim())) {
      errors.email = "Please enter a valid email address (e.g. you@example.com)";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      onLogin();
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Invalid email or password. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center bg-slate-950 px-4 py-12 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 sm:px-6 lg:px-8">
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back to Home Button */}
        <button
          type="button"
          onClick={onBackToHome}
          className="mb-6 inline-flex cursor-pointer items-center gap-2 rounded-lg text-xs font-medium text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </button>

        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-lg shadow-cyan-500/20">
            <BriefcaseBusiness className="h-6 w-6 text-slate-950" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-slate-400">
            Sign in to access your job applications and pipeline.
          </p>
        </div>

        {/* Auth Card */}
        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          {successMessage && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-sm text-emerald-300">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                  }}
                  placeholder="you@example.com"
                  className={`w-full rounded-xl border bg-slate-950/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition ${
                    fieldErrors.email
                      ? "border-red-500/80 focus:border-red-400 focus:ring-1 focus:ring-red-400"
                      : "border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
              )}
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
                  }}
                  placeholder="Enter your password"
                  className={`w-full rounded-xl border bg-slate-950/80 py-2.5 pl-10 pr-11 text-sm text-white placeholder-slate-500 outline-none transition ${
                    fieldErrors.password
                      ? "border-red-500/80 focus:border-red-400 focus:ring-1 focus:ring-red-400"
                      : "border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  }`}
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
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-400">{fieldErrors.password}</p>
              )}
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
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-800 pt-5 text-center text-xs text-slate-400">
            Don&apos;t have an account yet?{" "}
            <button
              type="button"
              onClick={onNavigateToSignup}
              className="cursor-pointer font-semibold text-cyan-400 hover:underline"
            >
              Sign up for free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;