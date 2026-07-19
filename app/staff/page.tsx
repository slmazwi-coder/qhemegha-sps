import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getApplications, getNews, getStaffDirectory } from "@/lib/data";

export default async function StaffDashboardPage() {
  const applications = await getApplications();
  const pendingCount = applications.filter((a) => a.status === "pending").length;
  const news = await getNews();
  const staff = await getStaffDirectory();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold text-navy">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-navy">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-navy">{applications.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              News posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-navy">{news.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Staff members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-navy">{staff.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { href: "/staff/content", label: "Edit page content" },
          { href: "/staff/news", label: "Manage news & gallery" },
          { href: "/staff/applications", label: "Review applications" },
          { href: "/staff/directory", label: "Update staff directory" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-xl border border-navy/10 bg-white p-5 text-navy shadow-sm transition hover:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <span className="font-heading font-semibold">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
