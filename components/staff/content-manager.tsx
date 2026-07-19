"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updatePage } from "@/lib/actions";
import type { Page } from "@/lib/data";

type PageConfig = {
  slug: string;
  label: string;
  fields: { key: string; label: string; type: "text" | "textarea" | "list" }[];
};

const pageConfigs: PageConfig[] = [
  {
    slug: "home",
    label: "Home page",
    fields: [
      { key: "heroTitle", label: "Hero heading", type: "text" },
      { key: "heroSubtitle", label: "Hero subtitle", type: "text" },
      { key: "principalName", label: "Principal name", type: "text" },
      { key: "principalWelcome", label: "Principal welcome message", type: "textarea" },
    ],
  },
  {
    slug: "about",
    label: "About page",
    fields: [
      { key: "history", label: "History", type: "textarea" },
      { key: "vision", label: "Vision", type: "textarea" },
      { key: "mission", label: "Mission", type: "textarea" },
    ],
  },
  {
    slug: "academics",
    label: "Academics page",
    fields: [
      { key: "overview", label: "Overview", type: "textarea" },
      { key: "gradesOffered", label: "Grades offered", type: "text" },
    ],
  },
  {
    slug: "contact",
    label: "Contact page",
    fields: [
      { key: "address", label: "Address", type: "textarea" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "mapEmbed", label: "Map embed code", type: "textarea" },
    ],
  },
];

export function ContentManager({
  initialPages,
}: {
  initialPages: Record<string, Page>;
}) {
  const [pages, setPages] = useState(initialPages);
  const [activeSlug, setActiveSlug] = useState("home");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const activePage = pages[activeSlug];
  const config = pageConfigs.find((c) => c.slug === activeSlug)!;

  const setBody = (key: string, value: unknown) => {
    setPages((prev) => ({
      ...prev,
      [activeSlug]: {
        ...prev[activeSlug],
        body: { ...prev[activeSlug].body, [key]: value },
      },
    }));
  };

  const setTitle = (title: string) => {
    setPages((prev) => ({
      ...prev,
      [activeSlug]: { ...prev[activeSlug], title },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await updatePage(activePage);
      setMessage("Saved.");
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold text-navy">Content editor</h1>

      <div className="flex flex-wrap gap-2">
        {pageConfigs.map((c) => (
          <button
            key={c.slug}
            onClick={() => {
              setActiveSlug(c.slug);
              setMessage(null);
            }}
            className={`rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
              activeSlug === c.slug
                ? "bg-navy text-gold"
                : "bg-white text-navy hover:bg-sand/50"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
        <div className="mb-4 grid gap-2">
          <Label htmlFor="page-title">Page title</Label>
          <Input
            id="page-title"
            value={activePage.title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {config.fields.map((field) => (
          <div key={field.key} className="mb-4 grid gap-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            {field.type === "textarea" ? (
              <Textarea
                id={field.key}
                value={String(activePage.body[field.key] ?? "")}
                onChange={(e) => setBody(field.key, e.target.value)}
                rows={4}
              />
            ) : (
              <Input
                id={field.key}
                value={String(activePage.body[field.key] ?? "")}
                onChange={(e) => setBody(field.key, e.target.value)}
              />
            )}
          </div>
        ))}

        {activeSlug === "home" && (
          <HomeHighlights page={activePage} setPages={setPages} />
        )}

        <div className="mt-6 flex items-center gap-4">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gold text-navy hover:bg-gold-dark"
          >
            {saving ? "Saving..." : "Save changes"}
          </Button>
          {message && <p className="text-sm text-muted-foreground">{message}</p>}
        </div>
      </div>
    </div>
  );
}

function HomeHighlights({
  page,
  setPages,
}: {
  page: Page;
  setPages: React.Dispatch<React.SetStateAction<Record<string, Page>>>;
}) {
  const highlights = (page.body.highlights || []) as {
    title: string;
    description: string;
    image: string;
  }[];

  const update = (index: number, field: string, value: string) => {
    const next = [...highlights];
    next[index] = { ...next[index], [field]: value };
    setPages((prev) => ({
      ...prev,
      home: { ...prev.home, body: { ...prev.home.body, highlights: next } },
    }));
  };

  const add = () => {
    const next = [...highlights, { title: "", description: "", image: "" }];
    setPages((prev) => ({
      ...prev,
      home: { ...prev.home, body: { ...prev.home.body, highlights: next } },
    }));
  };

  const remove = (index: number) => {
    const next = highlights.filter((_, i) => i !== index);
    setPages((prev) => ({
      ...prev,
      home: { ...prev.home, body: { ...prev.home.body, highlights: next } },
    }));
  };

  return (
    <div className="space-y-4">
      <h3 className="font-heading font-semibold text-navy">Home highlights</h3>
      {highlights.map((item, idx) => (
        <div key={idx} className="rounded-lg border border-navy/10 p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label>Title</Label>
              <Input
                value={item.title}
                onChange={(e) => update(idx, "title", e.target.value)}
              />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input
                value={item.image}
                onChange={(e) => update(idx, "image", e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={item.description}
                onChange={(e) => update(idx, "description", e.target.value)}
                rows={2}
              />
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => remove(idx)}
            className="mt-2 text-brick hover:text-brick-dark"
          >
            Remove highlight
          </Button>
        </div>
      ))}
      <Button variant="outline" onClick={add}>
        Add highlight
      </Button>
    </div>
  );
}
