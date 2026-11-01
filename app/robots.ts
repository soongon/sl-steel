import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// 공개 페이지는 전부 허용(Googlebot·OAI-SearchBot·GPTBot 포함). 관리자·API 만 크롤링 차단.
// /q·/share 는 페이지 메타 noindex 로 제외한다 — robots 로 막으면 크롤러가 noindex 를 읽지 못해
// 외부 링크가 생겼을 때 URL 만 색인될 수 있다.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
