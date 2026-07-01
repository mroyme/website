# mroy.me

Personal website and writing archive built with Next.js, MDX, Tailwind CSS, and Bun.

## Requirements

- Bun 1.3.14 or newer

## Development

Install dependencies:

```bash
bun install
```

Run the local development server:

```bash
bun run dev
```

Run all checks before shipping changes:

```bash
bun run check
```

## Scripts

- `bun run dev` - start Next.js in development mode with the Bun runtime
- `bun run build` - create a production build with the Bun runtime
- `bun run start` - start the production server with the Bun runtime
- `bun run typecheck` - run TypeScript without emitting files
- `bun run lint` - run ESLint
- `bun run format:check` - check Prettier formatting
- `bun run format` - format the project

## Deployment

Vercel uses Bun because this repository commits `bun.lock` and configures `bunVersion` in `vercel.json`.
