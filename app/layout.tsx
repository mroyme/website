import "./global.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Navbar } from "./components/nav";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Footer from "./components/footer";
import { ThemeProvider } from "./components/theme-provider";
import { baseUrl } from "./sitemap";
import { author, description } from "./site";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: author,
    template: `%s | ${author}`,
  },
  description,
  openGraph: {
    title: author,
    description,
    url: baseUrl,
    siteName: author,
    locale: "en_GB",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const cx = (...classes: string[]) => classes.filter(Boolean).join(" ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-GB"
      suppressHydrationWarning
      className={cx(
        "bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50",
        GeistSans.variable,
        GeistMono.variable,
      )}
    >
      <body className="selection:bg-accent/15 selection:text-accent-hover dark:selection:bg-accent/35 mx-4 mt-8 max-w-xl antialiased lg:mx-auto dark:selection:text-neutral-950">
        <ThemeProvider>
          <main className="mt-6 flex min-w-0 flex-auto flex-col px-2 md:px-0">
            <Navbar />
            {children}
            <Footer />
            <Analytics />
            <SpeedInsights />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
