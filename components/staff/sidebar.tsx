"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  Users,
  UserCheck,
  Shield,
  LogOut,
} from "lucide-react";

export function StaffSidebar({
  email,
  role,
}: {
  email: string;
  role: "admin" | "editor";
}) {
  const pathname = usePathname();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const links = [
    { href: "/staff", label: "Dashboard", icon: LayoutDashboard },
    { href: "/staff/content", label: "Content editor", icon: FileText },
    { href: "/staff/news", label: "News & gallery", icon: Newspaper },
    { href: "/staff/directory", label: "Staff directory", icon: Users },
    { href: "/staff/applications", label: "Applications", icon: UserCheck },
    ...(role === "admin"
      ? [{ href: "/staff/users", label: "User management", icon: Shield }]
      : []),
  ];

  return (
    <aside className="w-full border-b border-navy/10 bg-navy text-white md:w-64 md:border-b-0 md:border-r md:min-h-screen">
      <div className="p-5">
        <Link href="/" className="block font-heading text-xl font-bold text-gold">
          Qhemegha SPS
        </Link>
        <p className="mt-1 text-xs text-white/70">Staff portal</p>
      </div>
      <nav className="space-y-1 px-3 pb-4 md:pb-0">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                active
                  ? "bg-gold text-navy"
                  : "text-white/90 hover:bg-white/10"
              }`}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-white/10 p-4 md:absolute md:bottom-0 md:w-64">
        <p className="truncate text-xs text-white/70">{email}</p>
        <p className="text-xs font-semibold uppercase text-gold">{role}</p>
        <Button
          onClick={logout}
          variant="ghost"
          className="mt-2 w-full justify-start gap-2 text-white/90 hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-4 w-4" /> Log out
        </Button>
      </div>
    </aside>
  );
}
