import fs from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";
import { locale, siteUrl } from "app/site";

export type PostMetadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
};

export type BlogPost = {
  slug: string;
  metadata: PostMetadata;
  Component: ComponentType;
};

const postsDirectory = path.join(process.cwd(), "app", "blog", "posts");

function getPostSlugs() {
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => path.extname(file) === ".mdx")
    .map((file) => path.basename(file, ".mdx"));
}

async function getPost(slug: string): Promise<BlogPost> {
  const post = (await import(`./posts/${slug}.mdx`)) as {
    default: ComponentType;
    metadata: PostMetadata;
  };

  return {
    slug,
    metadata: post.metadata,
    Component: post.default,
  };
}

export async function getBlogPosts() {
  const posts = await Promise.all(getPostSlugs().map(getPost));

  return posts.sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime(),
  );
}

export async function getBlogPost(slug: string) {
  return (await getBlogPosts()).find((post) => post.slug === slug);
}

export function getBlogPostUrl(slug: string) {
  return new URL(`/blog/${slug}`, siteUrl).toString();
}

export function getBlogPostImageUrl(metadata: PostMetadata) {
  if (metadata.image) {
    return new URL(metadata.image, siteUrl).toString();
  }

  return `${siteUrl}/og?title=${encodeURIComponent(metadata.title)}`;
}

export function formatDate(date: string) {
  const targetDate = new Date(date.includes("T") ? date : `${date}T00:00:00`);
  const fullDate = targetDate.toLocaleDateString(locale.date, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return fullDate;
}
