# Aurelius Design System

## Rules (MUST follow)
- Dark mode only. Use bg-obsidian, bg-charcoal, bg-void. Never white backgrounds.
- Gold is for primary actions only. Don't overuse.
- Use existing components. For custom elements, use Tailwind classes below. Never hardcode hex values.
- Borders: prefer subtle 1px borders (border-ash) over shadows.

## Components

| Component | Key Props |
|-----------|-----------|
| Alert | see types |
| Avatar | see types |
| Badge | see types |
| Button | see types |
| Card | see types |
| Checkbox | see types |
| HelperText | see types |
| Input | see types |
| Label | see types |
| Modal | see types |
| Radio | see types |
| Select | see types |
| Skeleton | see types |
| Spinner | size |
| Switch | see types |
| Textarea | see types |
| Tooltip | see types |

## Available Tailwind Classes

### Colors (bg-*, text-*, border-*)
void, obsidian, charcoal, graphite, slate, ash, gold, gold-light, gold-bright, gold-muted, gold-pale, gold-glow, white, silver, zinc, dim, success, success-muted, error, error-muted, warning, warning-muted, info, info-muted

### Spacing
Standard Tailwind scale: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64
Use with p-*, m-*, gap-*, space-*

### Shadows
shadow-sm, shadow-md, shadow-lg, shadow-xl, shadow-glow, shadow-glow-sm, shadow-glow-lg

### Border Radius
rounded-none (preferred), rounded-sm, rounded-md, rounded-lg, rounded-full
