import { SiteShell } from "@/components/public/site-shell";
import { Ribbon } from "@/components/public/ribbon";
import { getPage } from "@/lib/data";

export default async function AcademicsPage() {
  const page = await getPage("academics");
  const body = page.body as {
    overview?: string;
    gradesOffered?: string;
    subjects?: string[];
  };
  const subjects = body.subjects || [];

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
            <Ribbon>What we offer</Ribbon>
          </div>
          <p className="mt-6 text-lg leading-relaxed text-foreground">
            {body.overview ||
              "We follow the CAPS curriculum and offer a balanced learning programme."}
          </p>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
              <h2 className="font-heading text-xl font-semibold text-navy">
                Grades offered
              </h2>
              <p className="mt-4 text-2xl font-bold text-gold">
                {body.gradesOffered || "Grades 4 to 7"}
              </p>
            </div>
            <div className="rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
              <h2 className="font-heading text-xl font-semibold text-navy">
                Subjects
              </h2>
              <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {subjects.length > 0 ? (
                  subjects.map((subject) => (
                    <li
                      key={subject}
                      className="flex items-center gap-2 text-foreground/80"
                    >
                      <span className="h-2 w-2 rounded-full bg-gold" />
                      {subject}
                    </li>
                  ))
                ) : (
                  <li className="text-foreground/60">No subjects listed.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
