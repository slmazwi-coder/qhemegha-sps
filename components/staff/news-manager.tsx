"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createNewsItem, updateNewsItem, deleteNewsItem } from "@/lib/actions";
import { createClient } from "@/lib/supabase/client";
import type { NewsItem } from "@/lib/data";

export function NewsManager({ initial }: { initial: NewsItem[] }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;
    setStatus(null);
    try {
      if (editing.id) {
        await updateNewsItem(editing.id, editing);
        setItems((prev) =>
          prev.map((i) => (i.id === editing.id ? editing : i)),
        );
      } else {
        await createNewsItem(editing);
        window.location.reload();
      }
      setEditing(null);
      setStatus("Saved.");
    } catch (err: unknown) {
      setStatus(err instanceof Error ? err.message : "Failed to save.");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this news item?")) return;
    try {
      await deleteNewsItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err: unknown) {
      setStatus(err instanceof Error ? err.message : "Failed to delete.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold text-navy">News & gallery</h1>
        <Button
          onClick={() =>
            setEditing({ title: "", body: "", image_url: "" })
          }
          className="bg-gold text-navy hover:bg-gold-dark"
        >
          Add news item
        </Button>
      </div>

      {editing && (
        <NewsForm
          item={editing}
          setItem={setEditing}
          onSubmit={save}
          onCancel={() => setEditing(null)}
          status={status}
        />
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id || item.title}
            className="overflow-hidden rounded-xl border border-navy/10 bg-white shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image_url || "/images/IMG-20260715-WA0053.jpg"}
              alt={item.title}
              className="h-40 w-full object-contain"
            />
            <div className="p-4">
              <h3 className="font-heading font-semibold text-navy">{item.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {item.body}
              </p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditing(item)}>
                  Edit
                </Button>
                {item.id && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-brick hover:text-brick-dark"
                    onClick={() => remove(item.id!)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsForm({
  item,
  setItem,
  onSubmit,
  onCancel,
  status,
}: {
  item: NewsItem;
  setItem: (item: NewsItem) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  status: string | null;
}) {
  const [uploading, setUploading] = useState(false);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const path = `news/${Date.now()}-${file.name}`;
      const { error, data } = await supabase.storage
        .from("news-images")
        .upload(path, file);
      if (error) throw error;
      const { data: publicData } = supabase.storage
        .from("news-images")
        .getPublicUrl(data.path);
      setItem({ ...item, image_url: publicData.publicUrl });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
      <h2 className="font-heading text-xl font-semibold text-navy">
        {item.id ? "Edit news item" : "New news item"}
      </h2>
      <div className="grid gap-2">
        <Label htmlFor="news-title">Title</Label>
        <Input
          id="news-title"
          value={item.title}
          onChange={(e) => setItem({ ...item, title: e.target.value })}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="news-body">Body</Label>
        <Textarea
          id="news-body"
          value={item.body}
          onChange={(e) => setItem({ ...item, body: e.target.value })}
          required
          rows={4}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="news-image">Image</Label>
        <Input id="news-image" type="file" accept="image/*" onChange={upload} />
        {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
        {item.image_url && (
          <img src={item.image_url} alt="Preview" className="h-32 w-auto rounded-md object-contain" />
        )}
      </div>
      <div className="flex gap-3">
        <Button type="submit" className="bg-gold text-navy hover:bg-gold-dark">
          Save
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      {status && <p className="text-sm text-muted-foreground">{status}</p>}
    </form>
  );
}
