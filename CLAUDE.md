# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

description: Use Bun instead of Node.js, npm, pnpm, or vite.
globs: '_.ts, _.tsx, _.html, _.css, _.js, _.jsx, package.json'
alwaysApply: false

---

## Project Overview

Review Router is an AI-powered CLI tool built with Ink (React for CLI) that helps manage code reviews using GitHub and OpenCode AI services. The application features:

- Interactive credential setup for GitHub PAT and OpenRouter API keys
- GitHub repository integration using Octokit
- OpenCode AI integration for code analysis
- Configuration management via `config.json`

## Development Commands

### Core Commands

- `bun install` - Install dependencies
- `bun run dev` - Hot-reload development server
- `bun run build` - Build TypeScript to `dist/` directory
- `bun run typecheck` - Run TypeScript type checking once
- `bun run typecheck:watch` - Run TypeScript type checking in watch mode
- `bun test` - Run tests once
- `bun run test:watch` - Run tests in watch mode

### Code Quality

- `bun run lint` - Run Prettier and XO linter (must pass before commits)
- `prettier --check .` - Check code formatting
- `xo` - Run XO ESLint configuration

## Architecture

### Entry Point

- `src/cli.tsx` - Main CLI application using Ink React components
- Implements credential management and GitHub repository fetching
- Uses React Query for state management and data fetching

### Views

- `src/views/credential-setup.tsx` - Interactive credential input component
- Handles OpenRouter API key and GitHub PAT collection
- Persists credentials to `config.json`

### Utilities

- `util/ocktokit.ts` - GitHub API client setup and type definitions
- `util/opencode.ts` - OpenCode AI client with server/client singleton pattern
- Handles authentication and cleanup for OpenCode services

### Configuration

- `config.json` - Stores API credentials (GitHub PAT, OpenRouter key)
- Uses a specific schema defined in `Config` interface

## Technology Stack

### Runtime & Build

- **Bun** - Runtime, package manager, and build tool
- **TypeScript** - Primary language with strict configuration
- **React** - UI framework (via Ink for CLI)

### Key Dependencies

- `ink` - React for CLI interfaces
- `ink-text-input`, `ink-select-input` - Interactive CLI components
- `@tanstack/react-query` - State management and data fetching
- `octokit` - GitHub API client
- `@opencode-ai/sdk` - AI code analysis services
- `meow` - CLI argument parsing (currently commented out)

### Code Quality Tools

- `xo` - ESLint configuration with React support
- `prettier` - Code formatting with Vdemedes config
- `@sindresorhus/tsconfig` - Strict TypeScript configuration

## Bun-Specific Patterns

Default to using Bun instead of Node.js:

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install`
- Use `bun run <script>` instead of `npm run <script>`
- Bun automatically loads .env, so don't use dotenv
- Prefer `Bun.file` over `node:fs`'s readFile/writeFile
- Use `Bun.$` instead of execa for shell commands

### Bun APIs Used

- `Bun.file('config.json').json()` - JSON file reading
- `Bun.write()` - File writing operations

## Development Notes

### Credential Management

- The app checks for existing credentials on startup
- If no credentials exist, shows setup flow
- Credentials are stored in `config.json` (not in git)
- GitHub PAT requires appropriate permissions for repository access

### OpenCode Integration

- Uses singleton pattern for server/client management
- Handles cleanup on process termination
- Server runs on ephemeral port to avoid hot-reload collisions

### Testing

- Uses `bun:test` framework
- Test files should follow pattern `*.test.tsx`
- Currently minimal test coverage

### Hot Reloading

- Use `bun --hot src/cli.tsx` for development
- Supports React component hot reloading via Ink
