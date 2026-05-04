import { BlogPosts } from "app/components/posts";
import { author, description } from "app/site";

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">{author}</h1>
      <p className="mb-4">{description}</p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  );
}
