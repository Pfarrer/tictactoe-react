# AI Agent Guidelines for Tic-Tac-Toe Project

This document contains guidelines and commands for AI agents working on this Tic-Tac-Toe project.

## Essential Commands

### Testing

- **Run all tests:** `bun run test` (uses workspace filter, recommended)
- **Run tests for specific package:** `bun --filter @tic-tac-toe/app test`
- **Run tests with coverage:** `bun --filter @tic-tac-toe/app test --coverage`
- **Run specific test file:** `bun --filter @tic-tac-toe/app vitest packages/app/src/App.test.tsx`

### Code Quality

- **Lint all packages:** `bun run lint`
- **Fix lint issues:** `bun run lint-fix`
- **Check formatting:** `bun run prettier`
- **Format code:** `bun run prettier-write`

### Building

- **Build app:** `cd packages/app && tsc -b && vite build`
- **No root build script currently configured**

## Project Structure

```
packages/
├── app/          # React frontend with Vite
├── server/       # WebSocket server with Bun
└── shared/       # Shared types and algorithms
```

## Code Style Requirements

### Formatting (Prettier)

- **Prettier:** Enforced using `prettier . --check` and `prettier . --write`. Configuration is in `.prettierrc`:
  - `trailingComma`: "all"
  - `tabWidth`: 2
  - `semi`: true
  - `singleQuote`: false
  - `printWidth`: 120
  - `plugins`: ["prettier-plugin-organize-imports"]

### Linting (ESLint)

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

### Testing

- Shared and app packages use Vitest framework
- Server package uses Bun's built-in test runner
- UI tests use React Testing Library
- Core logic tests in shared package have high coverage

## Key Dependencies

### Frontend (app)

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Konva for canvas-based game board
- React Testing Library for tests

### Backend (server)

- Bun runtime
- WebSocket for real-time communication
- Vitest for testing

### Shared

- Pure TypeScript
- Core game logic (hasWinner, minimax algorithm)
- Type definitions

## Common Issues & Solutions

### Test Environment

- Always use `bun run test` instead of `bun test` to avoid module resolution issues
- Workspace filtering ensures proper test environment setup

### Import Paths

- Use relative imports within packages
- Shared types imported from `@tic-tac-toe/shared`

### Component Structure

- Follow existing component patterns in `packages/app/src/components/`
- Use TypeScript interfaces for props
- Maintain consistent styling with Tailwind classes

## Commit Guidelines

### Commit Message Format

All commits made by AI assistants must follow the format: `MODEL@assistant` where:

- `MODEL` is the name of the AI model used (e.g., GLM-4.6, Gemini-2.5-Pro)
- `@assistant` indicates the commit was made by an AI assistant

**Examples:**

- `GLM-4.6@assistant`
- `Gemini-2.5-Pro@assistant`

### Co-author Configuration

All commits made by AI assistants should include the configured git user as a co-author. This ensures proper attribution to the human developer who initiated the changes. The co-author should be automatically included in the commit metadata using the standard git co-author format:

```
Co-authored-by: Human User <human@example.com>
```

This helps track both:

- Which AI model made the specific changes (via author field)
- Which human developer requested/initiated the changes (via co-author field)

## Testing Strategy

1. **Unit tests** for core game logic (shared package)
2. **Integration tests** for WebSocket server (server package)
3. **Component tests** for React components (app package)
4. **E2E tests** for complete game flows (app package)

Always run `bun run test` before committing to ensure all tests pass.
