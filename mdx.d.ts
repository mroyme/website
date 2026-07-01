declare module "*.mdx" {
  import type { ComponentType } from "react";

  const MDXContent: ComponentType;
  export default MDXContent;

  export const metadata: {
    title: string;
    publishedAt: string;
    summary: string;
    image?: string;
  };
}
