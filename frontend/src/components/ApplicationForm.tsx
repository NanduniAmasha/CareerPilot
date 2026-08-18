import { useState } from "react";
import { Plus, AlertCircle } from "lucide-react";
import api from "../services/api";

interface ApplicationFormProps {
  onSaved: () => void;
}

function ApplicationForm({ onSaved }: ApplicationFormProps) {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("APPLIED");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!company.trim()) {
      setError("Company name is required");
      return;
    }

    if (!position.trim()) {
      setError("Position title is required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/applications", {
        company: company.trim(),
        position: position.trim(),
        status,
        notes: notes.trim() || undefined,
      });

      setCompany("");
      setPosition("");
      setStatus("APPLIED");
      setNotes("");

      onSaved();
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to create application."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Add New Job Application
          </h3>
          <p className="text-xs text-slate-500">
            Keep track of another role you applied for
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Company Name *
          </label>
          <input
            type="text"
            placeholder="e.g. Stripe, Google"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Position / Role *
          </label>
          <input
            type="text"
            placeholder="e.g. Frontend Engineer"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white"
          >
            <option value="SAVED">Saved</option>
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-700">
          Notes (Optional)
        </label>
        <textarea
          placeholder="Recruiter contact, interview round dates, salary range..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-500 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {loading ? "Adding..." : "Add Application"}
        </button>
      </div>
    </form>
  );
}

export default ApplicationForm;