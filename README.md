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

## Quick Start

### 1. Install

```bash
npm install @lukeashford/aurelius
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

### 3. Import fonts and directives

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

### 4. Use components

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

If you're not using Tailwind, import the precompiled CSS instead:

```typescript
// main.tsx
import '@lukeashford/aurelius/styles/base.css'
```

This includes all base styles, utilities, and fonts. Components work identically.

---

## AI Agent Optimization 🤖

This package includes a machine-readable manifest for AI coding assistants.

**Prompt your agent:**

> "I'm using `@lukeashford/aurelius`. Read `node_modules/@lukeashford/aurelius/llms.md` before
> writing any code. It contains the design rules and available components."

The manifest prevents hallucinated styles and ensures agents use existing components and token-based
utilities.

[View the manifest](./llms.md)