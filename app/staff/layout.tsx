import { redirect } from "next/navigation";
import { getCurrentStaff } from "@/lib/data";
import { StaffSidebar } from "@/components/staff/sidebar";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentStaff();
  if (!session || !session.staff) {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-sand/30 md:flex-row">
      <StaffSidebar email={session.user.email ?? "Staff"} role={session.staff.role} />
      <main className="flex-1 overflow-auto p-6 md:p-8">{children}</main>
    </div>
  );
}
