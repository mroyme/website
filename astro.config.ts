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
                background: '#eff1f5',
                clusterBkg: '#e6e9ef',
                clusterBorder: '#acb0be',
                defaultLinkColor: '#8c8fa1',
                edgeLabelBackground: '#eff1f5',
                errorBkgColor: '#d20f39',
                errorTextColor: '#eff1f5',
                fontSize: '16px',
                lineColor: '#8c8fa1',
                mainBkg: '#ccd0da',
                nodeBorder: '#1e66f5',
                noteBkgColor: '#bcc0cc',
                noteBorderColor: '#acb0be',
                noteTextColor: '#4c4f69',
                primaryBorderColor: '#1e66f5',
                primaryColor: '#ccd0da',
                primaryTextColor: '#4c4f69',
                secondaryBorderColor: '#acb0be',
                secondaryColor: '#bcc0cc',
                secondaryTextColor: '#4c4f69',
                tertiaryBorderColor: '#acb0be',
                tertiaryColor: '#e6e9ef',
                tertiaryTextColor: '#4c4f69',
                textColor: '#4c4f69',
                titleColor: '#4c4f69',
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
                background: '#1e1e2e',
                clusterBkg: '#181825',
                clusterBorder: '#585b70',
                defaultLinkColor: '#7f849c',
                edgeLabelBackground: '#1e1e2e',
                errorBkgColor: '#f38ba8',
                errorTextColor: '#1e1e2e',
                fontSize: '16px',
                lineColor: '#7f849c',
                mainBkg: '#313244',
                nodeBorder: '#89b4fa',
                noteBkgColor: '#45475a',
                noteBorderColor: '#585b70',
                noteTextColor: '#cdd6f4',
                primaryBorderColor: '#89b4fa',
                primaryColor: '#313244',
                primaryTextColor: '#cdd6f4',
                secondaryBorderColor: '#585b70',
                secondaryColor: '#45475a',
                secondaryTextColor: '#cdd6f4',
                tertiaryBorderColor: '#585b70',
                tertiaryColor: '#181825',
                tertiaryTextColor: '#cdd6f4',
                textColor: '#cdd6f4',
                titleColor: '#cdd6f4',
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
        light: 'catppuccin-latte',
        dark: 'catppuccin-mocha',
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
