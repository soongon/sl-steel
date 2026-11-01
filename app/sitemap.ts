import type { MetadataRoute } from "next";
import { getSlugs } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

// 1시간마다 재생성 + 포스트 발행·수정·삭제 시 revalidatePostPages 가 즉시 갱신.
// lastmod 는 넣지 않는다(posts.updated_at 이 공유 토큰 갱신 등 비콘텐츠 변경에도 바뀌어 신호가 부정확).
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getSlugs();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/used-rebar`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.8 },
  ];

  const postEntries: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...postEntries];
}
