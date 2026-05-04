import { BlogPosts } from "app/components/posts";

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Madhurjya Roy
      </h1>
      <p className="mb-4">
        Software Engineer at Nexthink, working on backend, platform, and
        infrastructure.
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  );
}
