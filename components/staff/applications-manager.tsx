"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateApplication } from "@/lib/actions";
import type { Application } from "@/lib/data";

export function ApplicationsManager({ initial }: { initial: Application[] }) {
  const [applications, setApplications] = useState(initial);
  const [selected, setSelected] = useState<Application | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all"
      ? applications
      : applications.filter((a) => a.status === filter);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold text-navy">Applications</h1>

      <div className="flex flex-wrap gap-2">
        {["all", "pending", "approved", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
              filter === f
                ? "bg-navy text-gold"
                : "bg-white text-navy hover:bg-sand/50"
            }`}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-navy/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-sand/40 text-left text-navy">
            <tr>
              <th className="p-3">Learner</th>
              <th className="p-3">Grade</th>
              <th className="p-3">Parent</th>
              <th className="p-3">Status</th>
              <th className="p-3">Submitted</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((app) => (
              <tr key={app.id} className="border-t border-navy/10">
                <td className="p-3">{app.learner_name}</td>
                <td className="p-3">{app.grade_applying_for}</td>
                <td className="p-3">{app.parent_name}</td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      app.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : app.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="p-3">
                  {app.submitted_at
                    ? new Date(app.submitted_at).toLocaleDateString()
                    : "—"}
                </td>
                <td className="p-3">
                  <Button size="sm" variant="outline" onClick={() => setSelected(app)}>
                    Review
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <ApplicationReview
          application={selected}
          onClose={() => setSelected(null)}
          onUpdate={(updated) => {
            setApplications((prev) =>
              prev.map((a) => (a.id === updated.id ? updated : a)),
            );
            setSelected(updated);
          }}
        />
      )}
    </div>
  );
}

function ApplicationReview({
  application,
  onClose,
  onUpdate,
}: {
  application: Application;
  onClose: () => void;
  onUpdate: (a: Application) => void;
}) {
  const [notes, setNotes] = useState(application.internal_notes || "");
  const [status, setStatus] = useState(application.status);
  const [message, setMessage] = useState<string | null>(null);

  const save = async () => {
    setMessage(null);
    try {
      await updateApplication(application.id!, { status, internal_notes: notes });
      onUpdate({ ...application, status, internal_notes: notes });
      setMessage("Updated.");
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Update failed.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl bg-white p-6 shadow-lg">
        <h2 className="font-heading text-2xl font-semibold text-navy">
          Review application
        </h2>

        <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          <div>
            <dt className="font-semibold text-navy">Learner</dt>
            <dd>{application.learner_name}</dd>
          </div>
          <div>
            <dt className="font-semibold text-navy">Date of birth</dt>
            <dd>{application.learner_dob || "—"}</dd>
          </div>
          <div>
            <dt className="font-semibold text-navy">Grade applying for</dt>
            <dd>{application.grade_applying_for}</dd>
          </div>
          <div>
            <dt className="font-semibold text-navy">Parent / guardian</dt>
            <dd>{application.parent_name}</dd>
          </div>
          <div>
            <dt className="font-semibold text-navy">Contact</dt>
            <dd>{application.parent_contact}</dd>
          </div>
          <div>
            <dt className="font-semibold text-navy">Email</dt>
            <dd>{application.parent_email || "—"}</dd>
          </div>
        </dl>

        <div className="mt-4">
          <dt className="font-semibold text-navy">Address</dt>
          <dd className="text-sm">{application.address || "—"}</dd>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as Application["status"])}
              className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <Label htmlFor="notes">Internal notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>
        </div>

        {application.supporting_docs && application.supporting_docs.length > 0 && (
          <div className="mt-4">
            <dt className="font-semibold text-navy">Supporting documents</dt>
            <ul className="mt-2 space-y-1 text-sm">
              {application.supporting_docs.map((url, idx) => (
                <li key={idx}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gold underline hover:text-gold-dark"
                  >
                    Document {idx + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <Button onClick={save} className="bg-gold text-navy hover:bg-gold-dark">
            Save changes
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {message && <p className="text-sm text-muted-foreground">{message}</p>}
        </div>
      </div>
    </div>
  );
}
