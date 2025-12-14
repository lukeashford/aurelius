# Aurelius

[![npm version](https://img.shields.io/npm/v/@lukeashford/aurelius.svg)](https://www.npmjs.com/package/@lukeashford/aurelius)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**A dark-mode design system for creative technologists** — combining technical sophistication with a
cinematic aesthetic.

[Live Demo](https://aurelius.lukeashford.com/)

---

## Philosophy

Aurelius relies on deep blacks, rich golds, and refined typography to convey stability, trust, and
quiet luxury.

**Core principles:**

- **Cinematic:** Strictly dark mode. No white backgrounds.
- **Refined:** Gold (`#c9a227`) is reserved for primary actions and key highlights.
- **Grounded:** Subtle 1px borders over heavy drop shadows.

**Usage hierarchy:**

1. **React Components** — Use `<Button />`, `<Card />`, etc. whenever possible
2. **Tailwind utilities** — Build custom layouts with token-based classes (`bg-obsidian`,
   `text-gold`)
3. **Design tokens** — Direct access to values as a last resort

---

## AI Agent Optimization 🤖

This package includes a machine-readable manifest and ESLint enforcement for AI coding assistants.

**Prompt your agent:**

> Use the Aurelius design system for this project.
>
> 1. Run `npm install @lukeashford/aurelius`
> 2. Read `node_modules/@lukeashford/aurelius/llms.md` completely before writing any code
> 3. Follow its setup instructions (Tailwind config, ESLint, fonts)
> 4. Use only the components and Tailwind classes listed in that file

The manifest provides complete setup instructions, so agents can bootstrap a project from scratch
while staying within design system constraints.

[View the manifest](./llms.md)

---

## Quick Start

### 1. Install

```bash
npm install @lukeashford/aurelius
npm install -D eslint @typescript-eslint/parser eslint-plugin-better-tailwindcss @poupe/eslint-plugin-tailwindcss @eslint/css tailwind-csstree
```

### 2. Import the design system

Create or update your `index.css`:

```css
/* Import the complete Aurelius design system (includes Tailwind v4, fonts, and theme) */
@import '@lukeashford/aurelius/styles/base.css';

/* Tell Tailwind to scan the Aurelius package for utility classes */
@source "../node_modules/@lukeashford/aurelius/dist";
```

Then import it in your entry file:

```typescript
// main.tsx or index.tsx
import './index.css'
```

### 3. Configure ESLint (simplest form)

Aurelius ships with a default ESLint config you can re-export in one line. It enforces design system
constraints — if ESLint complains, you're leaving the rails.

```javascript
// eslint.config.mjs
export {default} from '@lukeashford/aurelius/eslint';
```

**Need a different CSS entry point?**

```javascript
// eslint.config.mjs
import {createAureliusESLintConfig} from '@lukeashford/aurelius/eslint';

export default createAureliusESLintConfig({
  entryPoint: './app/styles.css'
});
```

**What this enforces:**

- **JS/TS/JSX/TSX files:** No custom/non-Aurelius class names, no arbitrary value utilities like
  `bg-[#123456]` or `text-[15px]`
- **CSS files:** Tailwind v4 CSS best practices, valid `@apply` directives, no arbitrary value
  overuse, and proper theme token usage

### 4. Update package.json scripts

```json
{
  "scripts": {
    "lint": "eslint src --max-warnings 0",
    "dev": "npm run lint && vite",
    "build": "npm run lint && vite build"
  }
}
```

### 5. Use components

```tsx
import {Button, Card, Input} from '@lukeashford/aurelius'

function LoginForm() {
  return (
      <Card variant="featured" className="p-8 max-w-sm mx-auto">
        <h2 className="text-gold text-2xl mb-6">Sign In</h2>
        <Input placeholder="email@example.com"/>
        <Button variant="primary" className="w-full mt-4">
          Enter
        </Button>
      </Card>
  )
}
```

---