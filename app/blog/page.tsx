import type { Metadata } from "next";
import { BlogPosts } from "app/components/posts";
import { description } from "app/site";

export const metadata: Metadata = {
  title: "Writing",
  description,
};

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">Writing</h1>
      <BlogPosts />
    </section>
  );
}
