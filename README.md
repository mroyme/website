# mroy.me

Source for [mroy.me](https://mroy.me), a personal site and writing archive built with Astro.

## Stack

- Astro with the Cloudflare adapter
- Markdown and MDX content collections
- Shiki syntax highlighting with Kanagawa Lotus and Dragon themes
- Local IBM Plex Serif and Lilex fonts
- RSS, sitemap, robots.txt, and canonical metadata
- Build-time Mermaid diagrams in Markdown and MDX

## Local development

Requires Node.js `>=22.12.0` and pnpm.

| Command               | Description                                              |
| --------------------- | -------------------------------------------------------- |
| `pnpm install`        | Install dependencies.                                    |
| `pnpm dev`            | Start the development server at `http://localhost:4321`. |
| `pnpm build`          | Create a production build in `dist/`.                    |
| `pnpm preview`        | Serve the production build locally.                      |
| `pnpm generate-types` | Regenerate Cloudflare Worker types.                      |

## Writing

Posts live in [`src/content/blog/`](src/content/blog/) as Markdown or MDX files. Each requires this frontmatter:

```yaml
---
title: A post title
description: A concise summary
pubDate: 2026-08-04
updatedDate: 2026-08-05 # Optional
heroImage: ./image.png # Optional
---
```

To include a table of contents, add a `## Table of contents` heading. It is populated from headings through level three. Use a `mermaid` code fence for diagrams.

## Structure

```text
src/
  assets/fonts/       Local font files
  components/         Shared site components
  content/blog/       Markdown and MDX posts
  pages/              Site routes, RSS, robots.txt, and 404 page
  styles/             Global styles
astro.config.ts       Astro, Markdown, font, and adapter configuration
wrangler.jsonc        Cloudflare Workers configuration
```

## Deployment

The site is configured for Cloudflare Workers with `@astrojs/cloudflare`. `wrangler.jsonc` serves the generated assets and enables the custom 404 page. Deploy through the linked Cloudflare Workers project after a successful `pnpm build`.
