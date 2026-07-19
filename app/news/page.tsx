import { SiteShell } from "@/components/public/site-shell";
import { Ribbon } from "@/components/public/ribbon";
import { getNews } from "@/lib/data";

export default async function NewsPage() {
  const news = await getNews();

  return (
    <SiteShell>
      <section className="bg-navy py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-heading text-4xl font-bold md:text-5xl">
            News and gallery
          </h1>
          <p className="mt-4 text-white/80">
            Latest events, achievements and school news.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex justify-center">
            <Ribbon>Latest updates</Ribbon>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <article
                key={item.id || item.title}
                className="overflow-hidden rounded-xl border border-navy/10 bg-white shadow-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image_url || "/images/IMG-20260715-WA0053.jpg"}
                  alt={item.title}
                  className="h-52 w-full object-contain"
                />
                <div className="p-5">
                  <h2 className="font-heading text-lg font-semibold text-navy">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.body}
                  </p>
                  {item.published_at && (
                    <p className="mt-4 text-xs text-muted-foreground">
                      {new Date(item.published_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
