import { Feed } from "feed";
import { getBlogPosts } from "app/blog/utils";
import { author, description } from "app/site";
import { baseUrl } from "app/sitemap";

export async function GET() {
  const feed = new Feed({
    title: author,
    description,
    id: baseUrl,
    link: baseUrl,
    language: "en",
    copyright: `All rights reserved ${new Date().getFullYear()}, ${author}`,
    author: {
      name: author,
    },
  });

  for (const post of await getBlogPosts()) {
    const url = `${baseUrl}/blog/${post.slug}`;

    feed.addItem({
      title: post.metadata.title,
      id: url,
      link: url,
      description: post.metadata.summary,
      date: new Date(post.metadata.publishedAt),
    });
  }

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
