import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/public/site-shell";
import { Ribbon } from "@/components/public/ribbon";
import { getPage, getNews } from "@/lib/data";

export default async function HomePage() {
  const page = await getPage("home");
  const news = await getNews();
  const body = page.body as {
    heroTitle?: string;
    heroSubtitle?: string;
    principalName?: string;
    principalWelcome?: string;
    highlights?: { title: string; description: string; image: string }[];
  };

  const highlights = body.highlights || [];

  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative bg-navy py-16 text-white md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="space-y-6">
              <h1 className="font-heading text-4xl font-bold leading-tight md:text-5xl">
                {body.heroTitle || page.title}
              </h1>
              <p className="text-lg text-gold">{body.heroSubtitle || ""}</p>
              <p className="max-w-xl text-white/90">
                {body.principalWelcome ||
                  "Welcome to our school, where hard work leads to success."}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  className="bg-gold text-navy hover:bg-gold-dark"
                >
                  <Link href="/apply">Apply online</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/contact">Contact us</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-64 rounded-lg border-4 border-gold bg-white p-2 md:w-80">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.jpg"
                  alt="Qhemegha SPS school crest"
                  className="rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principal welcome */}
      <section className="bg-sand/40 py-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Ribbon>Principal&apos;s welcome</Ribbon>
          <blockquote className="mt-6 font-heading text-xl italic text-navy md:text-2xl">
            &ldquo;{body.principalWelcome || ""}&rdquo;
          </blockquote>
          <p className="mt-4 font-semibold text-navy">
            &mdash; {body.principalName || "Mr Lwandiso Maqhubu"}
          </p>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex justify-center">
            <Ribbon>Recent achievements</Ribbon>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-xl border border-navy/10 bg-white shadow-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-5">
                  <h3 className="font-heading text-lg font-semibold text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
            {news.slice(0, 1).map((item) => (
              <div
                key={item.id || item.title}
                className="overflow-hidden rounded-xl border border-navy/10 bg-white shadow-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image_url || "/images/IMG-20260715-WA0053.jpg"}
                  alt={item.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-5">
                  <h3 className="font-heading text-lg font-semibold text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.body.slice(0, 120)}...
                  </p>
                  <Link
                    href="/news"
                    className="mt-3 inline-block text-sm font-medium text-gold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
                  >
                    Read more
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="bg-navy py-12 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {[
              { label: "About the school", href: "/about" },
              { label: "Our academics", href: "/academics" },
              { label: "Meet the staff", href: "/staff-page" },
              { label: "Apply online", href: "/apply" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg border border-white/10 bg-white/5 p-5 text-center transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <span className="font-heading font-semibold">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
