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
            <p className="text-muted-foreground group-hover:text-accent/75 w-35 whitespace-nowrap tabular-nums transition-colors">
              {formatDate(post.metadata.publishedAt, false)}
            </p>
            <p className="text-foreground group-hover:text-accent tracking-tight transition-colors">
              {post.metadata.title}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
