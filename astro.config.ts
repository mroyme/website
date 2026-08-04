import cloudflare from '@astrojs/cloudflare'
import { unified } from '@astrojs/markdown-remark'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'

import { defineConfig, fontProviders } from 'astro/config'
import type { Element, Root } from 'hast'
import rehypeMermaid from 'rehype-mermaid'
import remarkToc from 'remark-toc'

type MermaidParent = Root | Element
type MermaidTransformer = (tree: Root) => void

const mermaidStylesheet = new URL('./src/styles/mermaid.css', import.meta.url)
const mermaidFontFamily = 'var(--font-ibm-plex-serif)'

function isElement(
  node: Root['children'][number] | Element['children'][number] | undefined,
): node is Element {
  return node?.type === 'element'
}

function hasClass(node: Element, className: string) {
  const classes = node.properties.className

  return Array.isArray(classes) && classes.includes(className)
}

// Keep these wrappers distinct so Unified runs one renderer per theme.
function rehypeLightMermaid(
  this: ThisParameterType<typeof rehypeMermaid>,
  ...args: Parameters<typeof rehypeMermaid>
) {
  return rehypeMermaid.call(this, ...args)
}

function rehypeDarkMermaid(
  this: ThisParameterType<typeof rehypeMermaid>,
  ...args: Parameters<typeof rehypeMermaid>
) {
  return rehypeMermaid.call(this, ...args)
}

function rehypePrepareMermaid(): MermaidTransformer {
  return (tree) => {
    function duplicateMermaid(node: MermaidParent) {
      for (const [index, child] of node.children.entries()) {
        if (!isElement(child)) {
          continue
        }

        if (child.tagName !== 'pre' || child.children.length !== 1) {
          duplicateMermaid(child)
          continue
        }

        const [code] = child.children

        if (
          !isElement(code) ||
          code.tagName !== 'code' ||
          !hasClass(code, 'language-mermaid')
        ) {
          duplicateMermaid(child)
          continue
        }

        node.children[index] = {
          type: 'element',
          tagName: 'span',
          properties: { className: ['mermaid'] },
          children: [
            {
              ...child,
              properties: {
                ...child.properties,
                className: ['mermaid-light-source'],
              },
            },
            {
              ...child,
              properties: {
                ...child.properties,
                className: ['mermaid-dark-source'],
              },
              children: [
                {
                  ...code,
                  properties: {
                    ...code.properties,
                    className: ['language-mermaid-dark'],
                  },
                },
              ],
            },
          ],
        }
      }
    }

    duplicateMermaid(tree)
  }
}

function rehypeEnableDarkMermaid(): MermaidTransformer {
  return (tree) => {
    function enableDarkMermaid(node: MermaidParent) {
      for (const child of node.children) {
        if (!isElement(child)) {
          continue
        }

        if (
          child.tagName === 'code' &&
          hasClass(child, 'language-mermaid-dark')
        ) {
          child.properties.className = ['language-mermaid']
        }

        enableDarkMermaid(child)
      }
    }

    enableDarkMermaid(tree)
  }
}

function rehypeFinishMermaid(): MermaidTransformer {
  return (tree) => {
    function setThemeClasses(node: MermaidParent) {
      for (const child of node.children) {
        if (isElement(child)) {
          setThemeClasses(child)
        }
      }

      if (
        node.type !== 'element' ||
        node.tagName !== 'span' ||
        !hasClass(node, 'mermaid') ||
        node.children.length !== 2
      ) {
        return
      }

      const [light, dark] = node.children

      if (
        !isElement(light) ||
        light.tagName !== 'svg' ||
        !isElement(dark) ||
        dark.tagName !== 'svg'
      ) {
        return
      }

      light.properties.className = ['mermaid-light']
      dark.properties.className = ['mermaid-dark']
    }

    setThemeClasses(tree)
  }
}

// https://astro.build/config
export default defineConfig({
  site: 'https://mroy.me',

  markdown: {
    processor: unified({
      remarkPlugins: [[remarkToc, { maxDepth: 3 }]],
      rehypePlugins: [
        rehypePrepareMermaid,
        [
          rehypeLightMermaid,
          {
            colorScheme: 'light',
            css: mermaidStylesheet,
            mermaidConfig: {
              fontFamily: mermaidFontFamily,
              theme: 'base',
              themeVariables: {
                background: '#f2ecbc',
                clusterBkg: '#e5ddb0',
                clusterBorder: '#8a8980',
                defaultLinkColor: '#8a8980',
                edgeLabelBackground: '#f2ecbc',
                errorBkgColor: '#c84053',
                errorTextColor: '#f2ecbc',
                fontSize: '16px',
                lineColor: '#8a8980',
                mainBkg: '#e5ddb0',
                nodeBorder: '#4d699b',
                noteBkgColor: '#dcd7ba',
                noteBorderColor: '#8a8980',
                noteTextColor: '#545464',
                primaryBorderColor: '#4d699b',
                primaryColor: '#e5ddb0',
                primaryTextColor: '#545464',
                secondaryBorderColor: '#8a8980',
                secondaryColor: '#dcd7ba',
                secondaryTextColor: '#545464',
                tertiaryBorderColor: '#8a8980',
                tertiaryColor: '#e7dba0',
                tertiaryTextColor: '#545464',
                textColor: '#545464',
                titleColor: '#545464',
              },
            },
            prefix: 'mermaid-light',
            strategy: 'inline-svg',
          },
        ],
        rehypeEnableDarkMermaid,
        [
          rehypeDarkMermaid,
          {
            css: mermaidStylesheet,
            mermaidConfig: {
              fontFamily: mermaidFontFamily,
              theme: 'base',
              themeVariables: {
                background: '#181616',
                clusterBkg: '#12120f',
                clusterBorder: '#625e5a',
                defaultLinkColor: '#737c73',
                edgeLabelBackground: '#181616',
                errorBkgColor: '#c4746e',
                errorTextColor: '#181616',
                fontSize: '16px',
                lineColor: '#737c73',
                mainBkg: '#1d1c19',
                nodeBorder: '#8ba4b0',
                noteBkgColor: '#282727',
                noteBorderColor: '#625e5a',
                noteTextColor: '#c5c9c5',
                primaryBorderColor: '#8ba4b0',
                primaryColor: '#1d1c19',
                primaryTextColor: '#c5c9c5',
                secondaryBorderColor: '#625e5a',
                secondaryColor: '#282727',
                secondaryTextColor: '#c5c9c5',
                tertiaryBorderColor: '#625e5a',
                tertiaryColor: '#12120f',
                tertiaryTextColor: '#c5c9c5',
                textColor: '#c5c9c5',
                titleColor: '#c5c9c5',
              },
            },
            prefix: 'mermaid-dark',
            strategy: 'inline-svg',
          },
        ],
        rehypeFinishMermaid,
      ],
    }),
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid'],
    },
    shikiConfig: {
      themes: {
        light: 'kanagawa-lotus',
        dark: 'kanagawa-dragon',
      },
    },
  },

  integrations: [mdx(), sitemap()],

  fonts: [
    {
      provider: fontProviders.local(),
      name: 'IBM Plex Serif',
      cssVariable: '--font-ibm-plex-serif',
      fallbacks: ['serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/ibm-plex-serif-variable-roman.woff2'],
            weight: '100 700',
            style: 'normal',
            display: 'swap',
          },
          {
            src: ['./src/assets/fonts/ibm-plex-serif-variable-italic.woff2'],
            weight: '100 700',
            style: 'italic',
            display: 'swap',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Lilex',
      cssVariable: '--font-lilex',
      fallbacks: ['monospace'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/lilex-variable-roman.woff2'],
            weight: '100 700',
            style: 'normal',
            display: 'swap',
          },
          {
            src: ['./src/assets/fonts/lilex-variable-italic.woff2'],
            weight: '100 700',
            style: 'italic',
            display: 'swap',
          },
        ],
      },
    },
  ],
  adapter: cloudflare(),
})
