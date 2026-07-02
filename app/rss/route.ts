import { Feed } from "feed";
import { getBlogPosts, getBlogPostUrl } from "app/blog/utils";
import { author, description, locale, siteUrl } from "app/site";

export async function GET() {
  const feed = new Feed({
    title: author,
    description,
    id: siteUrl,
    link: siteUrl,
    language: locale.feed,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${author}`,
    author: {
      name: author,
    },
  });

  for (const post of await getBlogPosts()) {
    const url = getBlogPostUrl(post.slug);

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
