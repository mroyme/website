import type { Metadata } from "next";
import { BlogPosts } from "app/components/posts";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Software Engineer at Nexthink, working on backend, platform, and infrastructure.",
};

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">Writing</h1>
      <BlogPosts />
    </section>
  );
}
