import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/data";
import { adminClient } from "@/lib/supabase/admin";
import { UsersManager } from "@/components/staff/users-manager";

export default async function StaffUsersPage() {
  const admin = await isAdmin();
  if (!admin) {
    redirect("/staff");
  }

  const supabase = adminClient();
  const [{ data: staffRows }, { data: authUsers, error: authError }] =
    await Promise.all([
      supabase.from("staff_users").select("*").order("created_at", { ascending: false }),
      supabase.auth.admin.listUsers(),
    ]);

  if (authError) {
    throw new Error(authError.message);
  }

  const staff = (staffRows || []) as { id: string; full_name: string; role: string; created_at?: string }[];
  const usersById = new Map(authUsers?.users.map((u) => [u.id, u]));

  const combined = staff.map((s) => {
    const authUser = usersById.get(s.id);
    return {
      id: s.id,
      full_name: s.full_name,
      role: s.role,
      email: authUser?.email || "Unknown",
    };
  });

  return <UsersManager initial={combined} />;
}
