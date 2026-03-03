# ADR-003: Build and Test Tooling -- Vite + Vitest

## Status

Accepted

## Context

The project needs a build tool for TypeScript compilation, bundling, and development server with hot module replacement. It also needs a test framework that supports TypeScript natively and runs fast for TDD (red-green-refactor cycles must be rapid). Open source required.

## Decision

- **Build tool**: Vite 6.x (MIT license)
- **Test framework**: Vitest 3.x (MIT license)
- **Test DOM environment**: happy-dom (MIT license)

Vite and Vitest share the same configuration and transform pipeline, eliminating config duplication between build and test.

## Alternatives Considered

### 1. webpack + Jest

webpack is the most mature bundler. Jest is the most popular test framework. However, they require separate configurations and separate TypeScript transform setups (ts-jest, babel, or swc for Jest; ts-loader or swc-loader for webpack). This duplication adds maintenance overhead and risks config drift. Jest is also slower than Vitest for typical TDD cycle times. Rejected: configuration friction and slower test execution.

### 2. esbuild + Vitest

esbuild is extremely fast for builds. However, it lacks a built-in development server with HMR, plugin ecosystem, and HTML entry point handling. Vite uses esbuild internally for its dev server transforms, so we get esbuild's speed without its limitations. Rejected: incomplete developer experience.

## Consequences

### Positive
- Single configuration for build and test
- Fast dev server with instant HMR for visual feedback during development
- Fast test execution supports tight TDD cycles
- Native TypeScript support (no additional transform configuration)
- Tree-shaking in production builds reduces bundle size

### Negative
- Vite ecosystem is smaller than webpack's (acceptable; no complex plugins needed)
- Vitest community is smaller than Jest's (acceptable; API is Jest-compatible, migration is trivial)
