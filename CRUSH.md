# Project Guidelines for Agentic Coding

This document outlines the essential commands and code style guidelines for this Tic-Tac-Toe project.

## Build/Lint/Test Commands

- **Build all packages:** `bun run build` (Currently no root build script, but `tsc -b && vite build` is used in `packages/app`)
- **Lint all packages:** `bun run lint`
- **Fix lint issues:** `bun run lint-fix`
- **Format with Prettier:** `bun run prettier`
- **Format and write with Prettier:** `bun run prettier-write`
- **Run all tests:** `bun test`
- **Run tests for a single package (e.g., app):** `bun --filter @tic-tac-toe/app test`
- **Run tests for a single package with coverage (e.g., app):** `bun --filter @tic-tac-toe/app test --coverage`
- **Run tests for a single file (e.g., packages/app/src/App.test.tsx):** `bun --filter @tic-tac-toe/app vitest packages/app/src/App.test.tsx`

## Code Style Guidelines

### Formatting

- **Prettier:** Enforced using `prettier . --check` and `prettier . --write`. Configuration is in `.prettierrc`:
  - `trailingComma`: "all"
  - `tabWidth`: 2
  - `semi`: true
  - `singleQuote`: false
  - `printWidth`: 120
  - `plugins`: ["prettier-plugin-organize-imports"]

### Linting

- **ESLint:** Enforced using `eslint .` and `eslint . --fix`. Configuration is in `eslint.config.js`.
  - **Rules:**
    - `@typescript-eslint/no-unused-vars`: "off"

### Imports

- Imports are organized by `prettier-plugin-organize-imports`.

### Types

- TypeScript is used throughout the project. Type strictness should be maintained.

### Naming Conventions

- Follow standard TypeScript/JavaScript naming conventions (e.g., `camelCase` for variables and functions, `PascalCase` for components and types).

### Error Handling

- Use try-catch blocks for error handling in asynchronous operations or potentially failing code paths.
