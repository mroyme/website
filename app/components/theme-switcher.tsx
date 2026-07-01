"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

type ResolvedTheme = "light" | "dark";

function subscribe() {
  return () => {};
}

function getNextTheme(theme: string | undefined): ResolvedTheme {
  return theme === "dark" ? "light" : "dark";
}

export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const currentTheme: ResolvedTheme =
    mounted && resolvedTheme === "dark" ? "dark" : "light";
  const nextTheme = getNextTheme(currentTheme);

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      className="focus-visible:ring-ring relative m-1 flex rounded-sm px-2 py-1 align-middle text-neutral-600 transition-colors hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none dark:text-neutral-300 dark:hover:text-neutral-50 dark:focus-visible:ring-offset-neutral-950"
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
      suppressHydrationWarning
    >
      {mounted ? nextTheme : "theme"}
    </button>
  );
}
