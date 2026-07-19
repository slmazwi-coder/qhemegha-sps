import { SiteShell } from "@/components/public/site-shell";
import { Ribbon } from "@/components/public/ribbon";
import { ApplyForm } from "@/components/public/apply-form";

export const metadata = {
  title: "Apply online | Qhemegha Senior Primary School",
};

export default function ApplyPage() {
  return (
    <SiteShell>
      <section className="bg-navy py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-heading text-4xl font-bold md:text-5xl">
            Apply online
          </h1>
          <p className="mt-4 text-white/80">
            Fill in the form below and we will contact you.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4">
          <div className="flex justify-center">
            <Ribbon>Online application</Ribbon>
          </div>
          <div className="mt-8">
            <ApplyForm />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
