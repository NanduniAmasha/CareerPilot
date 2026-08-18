import { useState } from "react";
import { Check, AlertCircle } from "lucide-react";
import api from "../services/api";
import type { Application } from "../types/application";

interface Props {
  application: Application;
  onSaved: () => void;
  onCancel: () => void;
}

function EditApplicationForm({ application, onSaved, onCancel }: Props) {
  const [company, setCompany] = useState(application.company);
  const [position, setPosition] = useState(application.position);
  const [status, setStatus] = useState(application.status);
  const [notes, setNotes] = useState(application.notes || "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      setError("");

      await api.patch(`/applications/${application.id}`, {
        company: company.trim(),
        position: position.trim(),
        status,
        notes: notes.trim() || undefined,
      });

      onSaved();
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to update application."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-cyan-200 bg-cyan-50/40 p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-900">Edit Application</h4>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Company
          </label>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 outline-none focus:border-cyan-500"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Position
          </label>
          <input
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="Position"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 outline-none focus:border-cyan-500"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Status
          </label>
          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value as
                  | "SAVED"
                  | "APPLIED"
                  | "INTERVIEW"
                  | "OFFER"
                  | "REJECTED"
              )
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 outline-none focus:border-cyan-500"
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
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes..."
          rows={2}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 outline-none focus:border-cyan-500"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-cyan-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500 disabled:opacity-50"
        >
          <Check className="h-3.5 w-3.5" />
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

export default EditApplicationForm;