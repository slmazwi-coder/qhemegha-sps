"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createStaffUser, deleteStaffUser } from "@/lib/actions";

export function UsersManager({
  initial,
}: {
  initial: { id: string; email: string; full_name: string; role: string }[];
}) {
  const [users, setUsers] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "editor" as "admin" | "editor",
  });

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    try {
      await createStaffUser(form);
      setShowForm(false);
      setForm({ email: "", password: "", full_name: "", role: "editor" });
      window.location.reload();
    } catch (err: unknown) {
      setStatus(err instanceof Error ? err.message : "Failed to create user.");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this staff user?")) return;
    try {
      await deleteStaffUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: unknown) {
      setStatus(err instanceof Error ? err.message : "Failed to delete user.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold text-navy">User management</h1>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gold text-navy hover:bg-gold-dark"
        >
          Add staff user
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={create}
          className="space-y-4 rounded-xl border border-navy/10 bg-white p-6 shadow-sm"
        >
          <h2 className="font-heading text-xl font-semibold text-navy">
            New staff user
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input
                id="full_name"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value as "admin" | "editor" })
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
              >
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <Button type="submit" className="bg-gold text-navy hover:bg-gold-dark">
              Create user
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
          {status && <p className="text-sm text-muted-foreground">{status}</p>}
        </form>
      )}

      <div className="rounded-xl border border-navy/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-sand/40 text-left text-navy">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-navy/10">
                <td className="p-3">{user.full_name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      user.role === "admin"
                        ? "bg-navy text-gold"
                        : "bg-sand text-navy"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-brick hover:text-brick-dark"
                    onClick={() => remove(user.id)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
