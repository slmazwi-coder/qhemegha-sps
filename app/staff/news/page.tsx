import { getNews } from "@/lib/data";
import { NewsManager } from "@/components/staff/news-manager";

export default async function StaffNewsPage() {
  const news = await getNews();
  return <NewsManager initial={news} />;
}
