import React from 'react'
import {cx} from '../utils'

import {Card, type CardProps, type CardSlotLoading} from './Card'

/**
 * Script element types following standard screenplay format
 */
export const SCRIPT_ELEMENT_TYPES = {
  SCENE_HEADING: 'scene-heading',
  ACTION: 'action',
  CHARACTER: 'character',
  DIALOGUE: 'dialogue',
  PARENTHETICAL: 'parenthetical',
  TRANSITION: 'transition',
  TITLE: 'title',
  SUBTITLE: 'subtitle',
} as const

export type ScriptElementType = typeof SCRIPT_ELEMENT_TYPES[keyof typeof SCRIPT_ELEMENT_TYPES]

/**
 * A single element in the script
 */
export interface ScriptElement {
  /**
   * The type of script element (e.g., 'scene-heading', 'character', 'dialogue')
   */
  type: ScriptElementType
  /**
   * The text content of the element
   */
  content: string
}

export interface ScriptCardProps extends Omit<CardProps, 'title'> {
  /**
   * Title of the script (shown at top)
   */
  title?: React.ReactNode
  /**
   * Subtitle/metadata (e.g., "30-second spot • Directed by AI Creative")
   */
  subtitle?: React.ReactNode
  /** The artifact's `@-handle` — see `Card.Header.handle`. */
  handle?: string
  /**
   * Array of script elements in order.
   * Available types: 'scene-heading', 'action', 'character', 'dialogue', 'parenthetical',
   * 'transition', 'title', 'subtitle'
   */
  elements: ScriptElement[]
  /**
   * Maximum height before scrolling (default: 16rem / 256px)
   */
  maxHeight?: string
  loading?: CardSlotLoading
}

/**
 * Render a script element with proper formatting
 */
function ScriptElementRenderer({element}: { element: ScriptElement }) {
  switch (element.type) {
    case 'scene-heading':
      return (
          <p className="mt-4 mb-2 font-bold uppercase text-gold text-xs tracking-wide">
            {element.content}
          </p>
      )

    case 'action':
      return (
          <p className="my-2 text-silver text-xs leading-relaxed">
            {element.content}
          </p>
      )

    case 'character':
      return (
          <p className="mt-4 mb-0.5 ml-8 font-bold text-white text-xs uppercase tracking-wide">
            {element.content}
          </p>
      )

    case 'parenthetical':
      return (
          <p className="ml-6 text-silver/70 text-xs italic">
            ({element.content})
          </p>
      )

    case 'dialogue':
      return (
          <p className="ml-4 mr-8 text-silver text-xs leading-relaxed">
            {element.content}
          </p>
      )

    case 'transition':
      return (
          <p className="mt-4 mb-2 text-right font-bold uppercase text-gold/80 text-xs tracking-wide">
            {element.content}
          </p>
      )

    case 'title':
      return (
          <p className="mt-6 mb-2 text-center font-bold text-gold text-sm">
            {element.content}
          </p>
      )

    case 'subtitle':
      return (
          <p className="text-center italic text-gold/70 text-xs">
            {element.content}
          </p>
      )

    default:
      return null
  }
}

/**
 * ScriptCard displays a formatted movie/video script.
 *
 * Follows standard screenplay formatting conventions:
 * - Scene headings: uppercase, gold, left-aligned
 * - Action: silver, full width
 * - Character names: uppercase, centered-left
 * - Dialogue: indented from both sides
 * - Transitions: uppercase, right-aligned
 *
 * @example
 * ```tsx
 * <ScriptCard
 *   title="The Arrival"
 *   elements={[
 *     { type: 'scene-heading', content: 'EXT. SPACE STATION - NIGHT' },
 *     { type: 'action', content: 'A lone ship approaches the docking bay.' },
 *     { type: 'character', content: 'PILOT' },
 *     { type: 'dialogue', content: 'Requesting permission to land.' }
 *   ]}
 * />
 * ```
 */
export const ScriptCard = React.forwardRef<HTMLDivElement, ScriptCardProps>(
    ({title, subtitle, handle, elements, maxHeight = '16rem', className, style, loading, ...rest},
        ref) => {
      return (
          <Card
              ref={ref}
              className={cx('p-0 overflow-hidden w-full', className)}
              loading={loading}
              {...rest}
          >
            <Card.Header
                title={title}
                subtitle={subtitle}
                handle={handle}
            />
            <Card.Body
                className="font-mono overflow-y-auto"
                style={{maxHeight, ...style}}
            >
              {elements.map((element, index) => (
                  <ScriptElementRenderer key={index} element={element}/>
              ))}
            </Card.Body>
          </Card>
      )
    }
)

ScriptCard.displayName = 'ScriptCard'

export default ScriptCard
