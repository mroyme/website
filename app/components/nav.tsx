"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "./theme-switcher";

const navItems = {
  "/": {
    name: "home",
  },
  "/blog": {
    name: "writing",
  },
};

export function Navbar() {
  const pathname = usePathname();

  return (
    <aside className="mb-16 -ml-2 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="fade relative flex scroll-pr-6 flex-row items-start justify-between px-0 pb-0 md:relative md:overflow-auto"
          id="nav"
        >
          <div className="flex flex-row space-x-0">
            {Object.entries(navItems).map(([path, { name }]) => {
              const isActive =
                path === "/" ? pathname === path : pathname.startsWith(path);

              return (
                <Link
                  key={path}
                  href={path}
                  aria-current={isActive ? "page" : undefined}
                  className={`hover:text-accent focus-visible:ring-ring relative m-1 flex rounded-sm px-2 py-1 align-middle transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none dark:focus-visible:ring-offset-neutral-950 ${
                    isActive
                      ? "text-accent"
                      : "text-neutral-600 dark:text-neutral-300"
                  }`}
                >
                  {name}
                </Link>
              );
            })}
          </div>
          <ThemeSwitcher />
        </nav>
      </div>
    </aside>
  );
}
