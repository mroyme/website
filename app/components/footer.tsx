import { author, socialLinks } from "app/site";

const currentYear = new Date().getFullYear();

function getExternalLinkProps(href: string) {
  if (!href.startsWith("http")) {
    return {};
  }

  return {
    rel: "noopener noreferrer",
    target: "_blank",
  };
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mb-16">
      <ul className="mt-8 flex flex-col space-y-2 space-x-0 text-sm text-neutral-600 md:flex-row md:space-y-0 md:space-x-4 dark:text-neutral-300">
        {socialLinks.map((link) => (
          <li key={link.href}>
            <a
              className="hover:text-accent focus-visible:ring-ring flex items-center rounded-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none dark:focus-visible:ring-offset-neutral-950"
              href={link.href}
              {...getExternalLinkProps(link.href)}
            >
              <ArrowIcon />
              <span className="ml-2 h-7">{link.label}</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-neutral-600 dark:text-neutral-300">
        © {currentYear} {author}
      </p>
    </footer>
  );
}
