# Aurelius — Agent Development Guide

This file provides instructions for AI coding agents working **on** this repository (developing the
library itself).

For agents **using** the library in other projects, see `llms.md`.

---

## README

See @README.md for project orientation, philosophy, and quick start commands.

---

## Project Structure

```
aurelius/
├── src/                    # Library source code
│   ├── components/         # React components
│   │   ├── chat/          # Chat interface components
│   │   │   └── hooks/     # React hooks (useArtifacts, useScrollAnchor, etc.)
│   │   └── icons/         # Icon components
│   ├── styles/            # CSS and theme definitions
│   │   ├── base.css       # Entry point (imports theme + Tailwind)
│   │   └── theme.css      # Design tokens and custom utilities
│   └── utils/             # Utility functions (cx, etc.)
├── demo/                   # Demo site (Vite + React)
│   └── src/components/    # Demo components (ChatDemo, etc.)
├── scripts/               # Build scripts
│   └── generate-manifest.js  # Generates llms.md from source
├── llms.md                # Auto-generated AI manifest (DO NOT EDIT)
├── CLAUDE.md              # This file
└── README.md              # Human-readable overview
```

---

## Development Guidelines

### Adding Components

1. Create component file in `src/components/` (or appropriate subdirectory)
2. Add JSDoc comments to the component and its props interface — these are auto-extracted to
   `llms.md`
3. Export from `src/components/index.ts`
4. Run `npm run build` to regenerate `llms.md`

### JSDoc Format for Props

```tsx
export interface MyComponentProps {
  /**
   * Description of this prop
   */
  propName: string
  /**
   * Another prop with type annotation in description
   * @default "defaultValue"
   */
  optionalProp?: 'option1' | 'option2'
}

/**
 * Component description goes here.
 * This will be extracted to llms.md.
 */
export function MyComponent({propName, optionalProp = 'option1'}: MyComponentProps) {
  // ...
}
```

### Tailwind CSS v4

This project uses Tailwind CSS v4 with `@theme` design tokens:

- All colors defined in `src/styles/theme.css` under `@theme { }`
- Custom utilities defined with `@utility` directive
- ESLint enforces design system constraints (no arbitrary values)

**Restricted patterns (will fail lint):**

- `bg-[#...]`, `text-[...]` — arbitrary color values
- `rounded-sm`, `rounded` — use design system border radius
- `max-h-[...]`, `w-[...]` — use relative units or design tokens

### Testing Changes

```bash
# Type check
npm run typecheck

# Lint (must pass with 0 warnings)
npm run lint

# Full build (typecheck + lint + compile + generate manifest)
npm run build

# Run demo to visually test
npm run dev:demo
```

### Documentation

- **README.md** — Keep focused on human orientation. No component API docs.
- **llms.md** — Auto-generated. Never edit directly. Add JSDoc to components instead.
- **CLAUDE.md** — This file. Update when project structure or processes change.

### Commit Guidelines

- Use conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`
- Run `npm run build` before committing to ensure everything compiles
- The build regenerates `llms.md` — commit it with your changes

---

## Key Files

| File                                        | Purpose                                  |
|---------------------------------------------|------------------------------------------|
| `src/styles/theme.css`                      | Design tokens (colors, fonts, utilities) |
| `src/components/index.ts`                   | Main export barrel                       |
| `src/components/chat/hooks/useArtifacts.ts` | Artifacts panel state management         |
| `src/components/chat/ChatInterface.tsx`     | Main chat orchestrator component         |
| `scripts/generate-manifest.js`              | Generates llms.md from source            |
| `eslint/index.js`                           | ESLint config enforcing design system    |

---

## Common Tasks

### Add a new icon

1. Create `src/components/icons/MyIcon.tsx`
2. Add React import and IconProps type
3. Export from `src/components/icons/index.ts`
4. Export from `src/components/index.ts`

### Add a new color token

1. Add to `@theme { }` block in `src/styles/theme.css`:
   ```css
   --color-mycolor: #hexvalue;
   ```
2. Run `npm run build` — the color will auto-appear in `llms.md`

### Update component documentation

1. Edit JSDoc comments in the component file
2. Run `npm run build` to regenerate `llms.md`
3. Commit both files