/**
 * Aurelius Design System
 *
 * A cohesive visual language for creative technologists.
 * Combines technical sophistication with artistic sensibility.
 *
 * CSS-first Tailwind v4 design system.
 * Import '@lukeashford/aurelius/styles/base.css' for complete styling.
 */

// React components
export * from './components'

// Utilities consumers commonly need (caret coords for inline autocompletes, etc.)
export {getTextareaCaretCoords, type TextareaCaretCoords} from './utils/textareaCaret'

// Version
export const version = '2.0.0'
