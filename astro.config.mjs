// @ts-check

import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import remarkToc from "remark-toc";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://www.mroy.me",

  markdown: {
    processor: unified({
      remarkPlugins: [[remarkToc, { maxDepth: 3 }]],
    }),
    shikiConfig: {
      themes: {
        light: "catppuccin-latte",
        dark: "catppuccin-mocha",
      },
    },
  },

  integrations: [mdx(), sitemap()],

  fonts: [
    {
      provider: fontProviders.local(),
      name: "IBM Plex Serif",
      cssVariable: "--font-ibm-plex-serif",
      fallbacks: ["serif"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/ibm-plex-serif-variable-roman.woff2"],
            weight: "100 700",
            style: "normal",
            display: "swap",
          },
          {
            src: ["./src/assets/fonts/ibm-plex-serif-variable-italic.woff2"],
            weight: "100 700",
            style: "italic",
            display: "swap",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Lilex",
      cssVariable: "--font-lilex",
      fallbacks: ["monospace"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/lilex-variable-roman.woff2"],
            weight: "100 700",
            style: "normal",
            display: "swap",
          },
          {
            src: ["./src/assets/fonts/lilex-variable-italic.woff2"],
            weight: "100 700",
            style: "italic",
            display: "swap",
          },
        ],
      },
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare(),
});
