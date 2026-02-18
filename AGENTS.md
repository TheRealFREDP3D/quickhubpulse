# AGENTS.md - Developer Guidelines

## Overview

React + Vite + TypeScript + Tailwind CSS v4 + Radix UI + Express. Uses pnpm.

## Commands

```bash
pnpm dev        # Dev server on port 3000
pnpm build      # Build client + server
pnpm start      # Run production server
pnpm check      # TypeScript type check
pnpm format     # Format with Prettier
pnpm vitest              # Run all tests
pnpm vitest run <file>   # Run single test file
```

## Project Structure

```
client/src/
├── components/ui/    # Radix UI components
├── contexts/         # ThemeContext
├── hooks/            # useGitHubAPI, useMobile, etc.
├── lib/              # utils.ts, env.ts
├── pages/            # Home, Dashboard, TokenInput, NotFound
server/               # Express server
shared/               # Shared code
```

## Code Style

- TypeScript with `strict: true`
- Path aliases: `@/*` → `client/src/*`, `@shared/*` → `shared/*`
- Naming: PascalCase components, `use*` hooks, camelCase utilities
- Use `interface` for objects, `type` for unions
- Use `unknown` instead of `any`
- Use `cn()` from `@/lib/utils` for Tailwind conditional classes
- Use `sonner` for toast notifications
- Use `ErrorBoundary` for error handling
- Use **Axios** for HTTP requests

## CSS

- Tailwind CSS v4 utility classes
- Avoid inline styles
- Use CSS variables for theming (see `index.css`)

## Testing

- Vitest configured (no test files yet)

## Commit

- Run `pnpm check` and `pnpm format` before committing

---

## Detailed Guidelines

### Imports & Path Aliases

Use configured path aliases. Import order (Prettier handles):

1. React/Vite imports
2. External libraries
3. Path aliases (`@/`)
4. Relative imports

### Naming Conventions

- **Components**: PascalCase (e.g., `RepositoryCard.tsx`, `Button.tsx`)
- **Hooks**: `use*` prefix, camelCase (e.g., `useGitHubAPI.ts`)
- **Utilities**: camelCase (e.g., `utils.ts`, `env.ts`)
- **Constants**: PascalCase or UPPER_SNAKE_CASE
- **Files**: kebab-case for non-components

### TypeScript Rules

- Explicit types for function params/returns
- `interface` for objects, `type` for unions
- Handle `null`/`undefined` explicitly (strict null checks)
- Use `unknown` over `any`

### React Patterns

- Functional components (arrow or `function` keyword)
- Explicit return types or `React.FC`
- Use `useCallback` for child callbacks
- Prefer composition over inheritance

### CSS & Styling

- Tailwind CSS v4 utilities only
- Use `cn()` for conditional classes
- No inline styles
- CSS variables for theming

### Error Handling

- try/catch for async operations
- sonner for toast notifications
- Wrap API calls with loading/error states
- ErrorBoundary for render errors

### API Integration

- **Axios** for HTTP requests
- Environment variables for API URLs
- Custom hooks for API logic (`useGitHubAPI`)

### Server (Express)

- Express middleware for shared functionality
- Proper HTTP status codes
- CORS handling
- Input validation before processing

### Environment Variables

- `.env` in project root
- Client: `import.meta.env.VITE_*`
- Server: `process.env.*`

### Radix UI Components

- Located in `client/src/components/ui/`
- Built on Radix primitives with Tailwind
- Use as building blocks for custom components
