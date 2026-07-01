import { getBlogPosts } from "app/blog/utils";
import { siteUrl } from "app/site";

export default async function sitemap() {
  const blogs = (await getBlogPosts()).map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  const routes = ["", "/blog"].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...blogs];
}
