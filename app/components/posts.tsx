import Link from "next/link";
import { formatDate, getBlogPosts } from "app/blog/utils";

export async function BlogPosts() {
  const allBlogs = await getBlogPosts();

  return (
    <div>
      {allBlogs.map((post) => (
        <Link
          key={post.slug}
          className="group mb-4 flex flex-col space-y-1"
          href={`/blog/${post.slug}`}
        >
          <div className="flex w-full flex-col space-x-0 md:flex-row md:space-x-2">
            <p className="group-hover:text-accent/75 w-35 whitespace-nowrap text-neutral-600 tabular-nums transition-colors dark:text-neutral-300">
              {formatDate(post.metadata.publishedAt)}
            </p>
            <p className="group-hover:text-accent tracking-tight text-neutral-900 transition-colors dark:text-neutral-50">
              {post.metadata.title}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
