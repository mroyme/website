import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatDate, getBlogPosts } from "app/blog/utils";
import { author, siteUrl } from "app/site";

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
  const post = (await getBlogPosts()).find((post) => post.slug === slug);
  if (!post) {
    return;
  }

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  const ogImage = image
    ? image
    : `${siteUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${siteUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Blog({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = (await getBlogPosts()).find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  const Post = post.Component;

  // Escape `<` so a stray `</script>` in any field can't break out of the script tag.
  const ldJson = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.metadata.title,
    datePublished: post.metadata.publishedAt,
    dateModified: post.metadata.publishedAt,
    description: post.metadata.summary,
    image: post.metadata.image
      ? `${siteUrl}${post.metadata.image}`
      : `${siteUrl}/og?title=${encodeURIComponent(post.metadata.title)}`,
    url: `${siteUrl}/blog/${post.slug}`,
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
