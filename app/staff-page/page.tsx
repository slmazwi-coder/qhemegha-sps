import { SiteShell } from "@/components/public/site-shell";
import { Ribbon } from "@/components/public/ribbon";
import { getStaffDirectory } from "@/lib/data";

export default async function StaffPage() {
  const staff = await getStaffDirectory();

  return (
    <SiteShell>
      <section className="bg-navy py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-heading text-4xl font-bold md:text-5xl">
            Our staff
          </h1>
          <p className="mt-4 text-white/80">
            Meet the people guiding our learners every day.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex justify-center">
            <Ribbon>Staff directory</Ribbon>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {staff.map((member) => (
              <div
                key={member.id || member.full_name}
                className="overflow-hidden rounded-xl border border-navy/10 bg-white text-center shadow-sm"
              >
                <div className="h-56 w-full bg-sand/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.photo_url || "/images/IMG-20260715-WA0053.jpg"}
                    alt={member.full_name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="p-5">
                  <h2 className="font-heading text-lg font-semibold text-navy">
                    {member.full_name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {member.role_title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
