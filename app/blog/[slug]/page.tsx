import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  formatDate,
  getBlogPost,
  getBlogPostImageUrl,
  getBlogPosts,
  getBlogPostUrl,
} from "app/blog/utils";
import { author } from "app/site";

export async function generateStaticParams() {
  const posts = await getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata | undefined> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) {
    return;
  }

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
  } = post.metadata;
  const url = getBlogPostUrl(post.slug);
  const image = getBlogPostImageUrl(post.metadata);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function Blog({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const Post = post.Component;
  const url = getBlogPostUrl(post.slug);
  const image = getBlogPostImageUrl(post.metadata);

  // Escape `<` so a stray `</script>` in any field can't break out of the script tag.
  const ldJson = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.metadata.title,
    datePublished: post.metadata.publishedAt,
    dateModified: post.metadata.publishedAt,
    description: post.metadata.summary,
    image,
    url,
    author: {
      "@type": "Person",
      name: author,
    },
  }).replace(/</g, "\\u003c");

  return (
    <section>
      <script type="application/ld+json" suppressHydrationWarning>
        {ldJson}
      </script>
      <h1 className="text-2xl font-semibold tracking-tighter">
        {post.metadata.title}
      </h1>
      <div className="mt-2 mb-8 flex items-center justify-between text-sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          {formatDate(post.metadata.publishedAt)}
        </p>
      </div>
      <article className="prose prose-neutral dark:prose-invert">
        <Post />
      </article>
    </section>
  );
}
