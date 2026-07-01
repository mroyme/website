import fs from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";

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

export function formatDate(date: string, includeRelative = false) {
  const currentDate = new Date();
  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }
  const targetDate = new Date(date);

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  const daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate: string;

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`;
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`;
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`;
  } else {
    formattedDate = "Today";
  }

  const fullDate = targetDate.toLocaleString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${formattedDate})`;
}
