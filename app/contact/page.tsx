import { SiteShell } from "@/components/public/site-shell";
import { Ribbon } from "@/components/public/ribbon";
import { getPage } from "@/lib/data";

export default async function ContactPage() {
  const page = await getPage("contact");
  const body = page.body as {
    address?: string;
    phone?: string;
    email?: string;
    mapEmbed?: string;
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
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex justify-center">
            <Ribbon>Get in touch</Ribbon>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
              <h2 className="font-heading text-xl font-semibold text-navy">
                Contact details
              </h2>
              <dl className="mt-4 space-y-4 text-foreground/80">
                <div>
                  <dt className="font-semibold text-navy">Address</dt>
                  <dd>{body.address || "Qhemegha Village, Eastern Cape"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-navy">Phone</dt>
                  <dd>{body.phone || "+27 84 955 0163"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-navy">Email</dt>
                  <dd>{body.email || "info@qhemegha-sps.co.za"}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
              <h2 className="font-heading text-xl font-semibold text-navy">
                Find us
              </h2>
              {body.mapEmbed ? (
                <div
                  className="mt-4 aspect-video w-full rounded-lg bg-sand/30"
                  dangerouslySetInnerHTML={{ __html: body.mapEmbed }}
                />
              ) : (
                <div className="mt-4 flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-lg bg-sand/30 text-sm">
                  <p className="text-muted-foreground">View the school location on Google Maps.</p>
                  <a
                    href="https://maps.app.goo.gl/jiJFM9rBy7PnPur18"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-md bg-gold px-4 py-2 text-navy font-medium hover:bg-gold-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    Open map
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
