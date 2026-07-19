"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createStaffMember,
  updateStaffMember,
  deleteStaffMember,
} from "@/lib/actions";
import { createClient } from "@/lib/supabase/client";
import type { StaffMember } from "@/lib/data";

export function DirectoryManager({ initial }: { initial: StaffMember[] }) {
  const [members, setMembers] = useState(initial);
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;
    setStatus(null);
    try {
      if (editing.id) {
        await updateStaffMember(editing.id, editing);
        setMembers((prev) =>
          prev.map((m) => (m.id === editing.id ? editing : m)),
        );
      } else {
        await createStaffMember(editing);
        window.location.reload();
      }
      setEditing(null);
      setStatus("Saved.");
    } catch (err: unknown) {
      setStatus(err instanceof Error ? err.message : "Failed to save.");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Remove this staff member?")) return;
    try {
      await deleteStaffMember(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (err: unknown) {
      setStatus(err instanceof Error ? err.message : "Failed to delete.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold text-navy">Staff directory</h1>
        <Button
          onClick={() =>
            setEditing({
              full_name: "",
              role_title: "",
              photo_url: "",
              display_order: members.length + 1,
            })
          }
          className="bg-gold text-navy hover:bg-gold-dark"
        >
          Add staff member
        </Button>
      </div>

      {editing && (
        <MemberForm
          member={editing}
          setMember={setEditing}
          onSubmit={save}
          onCancel={() => setEditing(null)}
          status={status}
        />
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <div
            key={member.id || member.full_name}
            className="overflow-hidden rounded-xl border border-navy/10 bg-white text-center shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={member.photo_url || "/images/IMG-20260715-WA0053.jpg"}
              alt={member.full_name}
              className="h-48 w-full object-contain"
            />
            <div className="p-4">
              <h3 className="font-heading font-semibold text-navy">
                {member.full_name}
              </h3>
              <p className="text-sm text-muted-foreground">{member.role_title}</p>
              <div className="mt-3 flex justify-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditing(member)}>
                  Edit
                </Button>
                {member.id && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-brick hover:text-brick-dark"
                    onClick={() => remove(member.id!)}
                  >
                    Remove
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

function MemberForm({
  member,
  setMember,
  onSubmit,
  onCancel,
  status,
}: {
  member: StaffMember;
  setMember: (m: StaffMember) => void;
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
      const path = `staff/${Date.now()}-${file.name}`;
      const { error, data } = await supabase.storage
        .from("staff-photos")
        .upload(path, file);
      if (error) throw error;
      const { data: publicData } = supabase.storage
        .from("staff-photos")
        .getPublicUrl(data.path);
      setMember({ ...member, photo_url: publicData.publicUrl });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
      <h2 className="font-heading text-xl font-semibold text-navy">
        {member.id ? "Edit staff member" : "New staff member"}
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="full_name">Full name</Label>
          <Input
            id="full_name"
            value={member.full_name}
            onChange={(e) => setMember({ ...member, full_name: e.target.value })}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="role_title">Role / title</Label>
          <Input
            id="role_title"
            value={member.role_title}
            onChange={(e) => setMember({ ...member, role_title: e.target.value })}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="display_order">Display order</Label>
          <Input
            id="display_order"
            type="number"
            value={member.display_order}
            onChange={(e) =>
              setMember({ ...member, display_order: Number(e.target.value) })
            }
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="photo">Photo</Label>
          <Input id="photo" type="file" accept="image/*" onChange={upload} />
          {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
        </div>
      </div>
      {member.photo_url && (
        <img
          src={member.photo_url}
          alt="Preview"
          className="h-32 rounded-md object-contain"
        />
      )}
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
