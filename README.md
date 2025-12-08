# Aurelius

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
npm install -D eslint eslint-plugin-tailwindcss
```

### 2. Configure Tailwind

```javascript
// tailwind.config.js
const aureliusPreset = require('@lukeashford/aurelius/tailwind.preset')

module.exports = {
  presets: [aureliusPreset],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@lukeashford/aurelius/dist/**/*.{js,mjs}',
  ],
}
```

### 3. Configure ESLint

This enforces the design system — agents and developers get errors when using arbitrary values or
non-Aurelius classes.

```javascript
// eslint.config.js
import tailwindcss from 'eslint-plugin-tailwindcss';

export default [
  {
    plugins: {tailwindcss},
    rules: {
      'tailwindcss/no-arbitrary-value': 'error',
      'tailwindcss/no-custom-classname': 'error',
    },
    settings: {
      tailwindcss: {config: './tailwind.config.js'},
    },
  },
];
```

<details>
<summary>Legacy .eslintrc.js format</summary>
```javascript
module.exports = {
  plugins: ['tailwindcss'],
  rules: {
    'tailwindcss/no-arbitrary-value': 'error',
    'tailwindcss/no-custom-classname': 'error',
  },
  settings: {
    tailwindcss: { config: './tailwind.config.js' },
  },
}
```
</details>

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

### 5. Import fonts and create index.css

```typescript
// main.tsx
import '@lukeashford/aurelius/styles/fonts.css'
import './index.css'
```

```css
/* index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 6. Use components

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

## Non-Tailwind Users

Import the precompiled CSS instead:

```typescript
// main.tsx
import '@lukeashford/aurelius/styles/base.css'
```

This includes all base styles, utilities, and fonts. Components work identically.