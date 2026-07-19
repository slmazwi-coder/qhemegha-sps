import { SiteShell } from "@/components/public/site-shell";
import { Ribbon } from "@/components/public/ribbon";
import { getPage } from "@/lib/data";

export default async function AboutPage() {
  const page = await getPage("about");
  const body = page.body as {
    history?: string;
    vision?: string;
    mission?: string;
  };

  return (
    <SiteShell>
      <section className="bg-navy py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-heading text-4xl font-bold md:text-5xl">
            {page.title}
          </h1>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex justify-center">
            <Ribbon>Our history</Ribbon>
          </div>
          <p className="mt-6 text-lg leading-relaxed text-foreground">
            {body.history ||
              "Qhemegha Senior Primary School has a long history of serving the local community."}
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
              <h2 className="font-heading text-2xl font-semibold text-navy">
                Vision
              </h2>
              <p className="mt-4 text-foreground/80">
                {body.vision ||
                  "To be a school where every learner reaches their full potential."}
              </p>
            </div>
            <div className="rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
              <h2 className="font-heading text-2xl font-semibold text-navy">
                Mission
              </h2>
              <p className="mt-4 text-foreground/80">
                {body.mission ||
                  "We provide quality education in a safe and supportive environment."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
