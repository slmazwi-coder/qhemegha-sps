"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";

interface ApplyFormState {
  learner_name: string;
  learner_dob: string;
  grade_applying_for: string;
  parent_name: string;
  parent_contact: string;
  parent_email: string;
  address: string;
  files: File[];
}

const grades = ["Grade 4", "Grade 5", "Grade 6", "Grade 7"];

export function ApplyForm() {
  const [form, setForm] = useState<ApplyFormState>({
    learner_name: "",
    learner_dob: "",
    grade_applying_for: "",
    parent_name: "",
    parent_contact: "",
    parent_email: "",
    address: "",
    files: [],
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof ApplyFormState, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      update("files", Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    try {
      const supabase = createClient();
      const docUrls: string[] = [];

      for (const file of form.files) {
        const path = `applications/${Date.now()}-${Math.random().toString(36).slice(2)}/${file.name}`;
        const { error: uploadError, data } = await supabase.storage
          .from("supporting-docs")
          .upload(path, file);
        if (uploadError) {
          throw new Error(uploadError.message);
        }
        const { data: publicData } = supabase.storage
          .from("supporting-docs")
          .getPublicUrl(data.path);
        docUrls.push(publicData.publicUrl);
      }

      const { error: insertError } = await supabase.from("applications").insert({
        learner_name: form.learner_name,
        learner_dob: form.learner_dob || null,
        grade_applying_for: form.grade_applying_for,
        parent_name: form.parent_name,
        parent_contact: form.parent_contact,
        parent_email: form.parent_email || null,
        address: form.address || null,
        supporting_docs: docUrls.length > 0 ? docUrls : null,
      });

      if (insertError) throw new Error(insertError.message);
      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-xl border border-navy/10 bg-white p-8 text-center shadow-sm">
        <h2 className="font-heading text-2xl font-semibold text-navy">
          Application received
        </h2>
        <p className="mt-4 text-foreground/80">
          Thank you. We have received your application and will be in touch.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset className="rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
        <legend className="px-2 font-heading font-semibold text-navy">
          Learner details
        </legend>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="learner_name">Full name</Label>
            <Input
              id="learner_name"
              value={form.learner_name}
              onChange={(e) => update("learner_name", e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="learner_dob">Date of birth</Label>
            <Input
              id="learner_dob"
              type="date"
              value={form.learner_dob}
              onChange={(e) => update("learner_dob", e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 grid gap-2">
          <Label htmlFor="grade">Grade applying for</Label>
          <select
            id="grade"
            value={form.grade_applying_for}
            onChange={(e) => update("grade_applying_for", e.target.value)}
            required
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
          >
            <option value="">Select a grade</option>
            {grades.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
        <legend className="px-2 font-heading font-semibold text-navy">
          Parent / guardian details
        </legend>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="parent_name">Full name</Label>
            <Input
              id="parent_name"
              value={form.parent_name}
              onChange={(e) => update("parent_name", e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="parent_contact">Contact number</Label>
            <Input
              id="parent_contact"
              type="tel"
              value={form.parent_contact}
              onChange={(e) => update("parent_contact", e.target.value)}
              required
            />
          </div>
        </div>
        <div className="mt-4 grid gap-2">
          <Label htmlFor="parent_email">Email address</Label>
          <Input
            id="parent_email"
            type="email"
            value={form.parent_email}
            onChange={(e) => update("parent_email", e.target.value)}
          />
        </div>
        <div className="mt-4 grid gap-2">
          <Label htmlFor="address">Home address</Label>
          <Textarea
            id="address"
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
          />
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
        <legend className="px-2 font-heading font-semibold text-navy">
          Supporting documents
        </legend>
        <p className="mb-3 text-sm text-muted-foreground">
          You may upload a birth certificate, previous report card or other
          supporting documents.
        </p>
        <Input
          type="file"
          multiple
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />
      </fieldset>

      {error && <p className="text-sm text-brick">{error}</p>}
      <Button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-gold text-navy hover:bg-gold-dark md:w-auto"
      >
        {status === "submitting" ? "Submitting..." : "Submit application"}
      </Button>
    </form>
  );
}
