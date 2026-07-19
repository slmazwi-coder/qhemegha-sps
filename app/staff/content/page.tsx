import { getPage } from "@/lib/data";
import { ContentManager } from "@/components/staff/content-manager";

export default async function StaffContentPage() {
  const slugs = ["home", "about", "academics", "contact"];
  const entries = await Promise.all(
    slugs.map(async (slug) => [slug, await getPage(slug)] as const),
  );
  const initialPages = Object.fromEntries(entries);

  return <ContentManager initialPages={initialPages} />;
}
