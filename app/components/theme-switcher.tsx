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
      className="text-muted-foreground hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background relative m-1 flex rounded-sm px-2 py-1 align-middle transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
      suppressHydrationWarning
    >
      {mounted ? nextTheme : "theme"}
    </button>
  );
}
