import type { MetadataRoute } from "next";
import { getBlogPosts, getBlogPostUrl } from "app/blog/utils";
import { siteUrl } from "app/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = (await getBlogPosts()).map((post) => ({
    url: getBlogPostUrl(post.slug),
    lastModified: post.metadata.publishedAt,
  }));

  const routes = [siteUrl, new URL("/blog", siteUrl).toString()].map((url) => ({
    url,
  }));

  return [...routes, ...blogs];
}
