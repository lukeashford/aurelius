import React, {createContext, useContext, useState} from 'react'
import {Check} from 'lucide-react'
import {copyToClipboard, cx} from '../utils'
import {Skeleton} from './Skeleton'

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'ghost' | 'featured'

export type CardSlotLoading = {
  header?: {
    title?: boolean
    subtitle?: boolean
    action?: boolean
  }
  media?: boolean
  body?: boolean
  footer?: boolean
}

interface CardContextValue {
  loading?: CardSlotLoading
}

const CardContext = createContext<CardContextValue>({loading: undefined})

const useCardContext = () => useContext(CardContext)

type HeaderField = keyof NonNullable<CardSlotLoading['header']>
type TopLevelKey = Exclude<keyof CardSlotLoading, 'header'>
type SlotPath = TopLevelKey | ['header', HeaderField]

export function slotLoading(
    loading: CardSlotLoading | undefined,
    path: SlotPath
): boolean {
  if (!loading) {
    return false
  }
  if (Array.isArray(path)) {
    return !!loading.header?.[path[1]]
  }
  return !!loading[path]
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  interactive?: boolean
  selected?: boolean
  noPadding?: boolean
  loading?: CardSlotLoading
}

const VARIANT_STYLES: Record<CardVariant, string> = {
  default: 'bg-charcoal shadow-sm border border-gold/30',
  elevated: 'bg-charcoal shadow-lg border-0',
  outlined: 'bg-charcoal shadow-none border border-ash',
  ghost: 'bg-transparent shadow-none border-0',
  featured: 'bg-charcoal border border-gold glow-sm',
}

const CardBase = React.forwardRef<HTMLDivElement, CardProps>(
    (
        {
          variant = 'default',
          interactive = false,
          selected = false,
          noPadding = false,
          loading,
          className,
          children,
          ...props
        },
        ref
    ) => {
      return (
          <CardContext.Provider value={{loading}}>
            <div
                ref={ref}
                className={cx(
                    'rounded-none relative transition-opacity duration-500',
                    !noPadding && 'p-6',
                    VARIANT_STYLES[variant],
                    interactive &&
                    'transition-all duration-200 hover:border-gold hover:shadow-glow cursor-pointer',
                    selected && 'border-gold shadow-glow-md',
                    className
                )}
                {...props}
            >
              {children}
              {selected && (
                  <div
                      className="absolute top-3 right-3 flex items-center justify-center h-6 w-6 rounded-full bg-gold text-obsidian">
                    <Check className="h-4 w-4"/>
                  </div>
              )}
            </div>
          </CardContext.Provider>
      )
    }
)

CardBase.displayName = 'Card'

// Card.Header - header section with title and optional actions
export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  action?: React.ReactNode
  /**
   * Optional addressable handle (the artifact's `name` / `@-handle`). Renders
   * as a tertiary monospace line below the subtitle, prefixed with `@`. Click
   * copies `@<handle>` to the clipboard and pulses the handle once. Use to
   * surface the typed identifier filmmakers reference in chat.
   */
  handle?: string
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
    ({title, subtitle, action, handle, className, children, ...props}, ref) => {
      const {loading} = useCardContext()
      const titleIsLoading = slotLoading(loading, ['header', 'title'])
      const subtitleIsLoading = slotLoading(loading, ['header', 'subtitle'])
      const actionIsLoading = slotLoading(loading, ['header', 'action'])

      const hasContent = title || subtitle || action || handle || children

      if (!hasContent && !titleIsLoading && !subtitleIsLoading && !actionIsLoading) {
        return null
      }

      return (
          <div
              ref={ref}
              className={cx('px-6 py-4 border-b border-ash', className)}
              {...props}
          >
            {(title || subtitle || action || handle
                    || titleIsLoading || subtitleIsLoading || actionIsLoading)
                ? (
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {title ? (
                            <h3 className="text-lg font-semibold text-white m-0">{title}</h3>
                        ) : titleIsLoading ? (
                            <Skeleton className="h-5 w-3/4 mb-1"/>
                        ) : null}
                        {subtitle ? (
                            <p className="text-sm text-silver mt-1 m-0">{subtitle}</p>
                        ) : subtitleIsLoading ? (
                            <Skeleton className="h-4 w-1/2 mt-1"/>
                        ) : null}
                        {handle && <CardHandle handle={handle}/>}
                      </div>
                      {action ? (
                          <div className="shrink-0">{action}</div>
                      ) : actionIsLoading ? (
                          <Skeleton className="h-8 w-8 shrink-0"/>
                      ) : null}
                    </div>
                ) : (
                    children
                )}
          </div>
      )
    }
)

/**
 * Click-to-copy `@-handle` line. Rendered automatically by `Card.Header` when
 * its `handle` prop is set; exposed standalone as `Card.Handle` for custom
 * card layouts that don't use `Card.Header` (e.g. `DeliverableCard`).
 */
export interface CardHandleProps {
  handle: string
}

const CardHandle: React.FC<CardHandleProps> = ({handle}) => {
  const [pulseKey, setPulseKey] = useState(0)
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    void copyToClipboard(`@${handle}`)
    setPulseKey(k => k + 1)
  }
  return (
      <button
          type="button"
          onClick={handleClick}
          // `key` resets the animation so consecutive clicks pulse again.
          key={pulseKey}
          className={cx(
              'mt-1 inline-flex items-center font-mono text-xs text-gold/70',
              'hover:text-gold transition-colors',
              'animate-pulse-once px-1 -mx-1',
          )}
          aria-label={`Copy @${handle} to clipboard`}
          title={`Copy @${handle} to clipboard`}
      >
        <span className="opacity-60">@</span>{handle}
      </button>
  )
}

CardHeader.displayName = 'CardHeader'

// Card.Body - main content area
export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
}

const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
    ({className, children, ...props}, ref) => {
      const {loading} = useCardContext()
      const isBodyLoading = slotLoading(loading, 'body')

      if (!children && !isBodyLoading) {
        return null
      }

      return (
          <div ref={ref} className={cx('px-6 py-4', className)} {...props}>
            {isBodyLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full"/>
                  <Skeleton className="h-4 w-full"/>
                  <Skeleton className="h-4 w-3/4"/>
                </div>
            ) : (
                children
            )}
          </div>
      )
    }
)

CardBody.displayName = 'CardBody'

// Card.Footer - footer section, typically for actions
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end' | 'between'
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
    ({align = 'end', className, children, ...props}, ref) => {
      const alignClass = {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
      }[align]

      return (
          <div
              ref={ref}
              className={cx(
                  'px-6 py-4 border-t border-ash flex items-center gap-3',
                  alignClass,
                  className
              )}
              {...props}
          >
            {children}
          </div>
      )
    }
)

CardFooter.displayName = 'CardFooter'

// Card.Media - image or media section
export interface CardMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  aspect?: 'video' | 'square' | 'wide' | 'none'
  position?: 'top' | 'bottom'
}

const CardMedia = React.forwardRef<HTMLDivElement, CardMediaProps>(
    ({
      aspect,
      position = 'top',
      className,
      children,
      ...props
    }, ref) => {
      const {loading} = useCardContext()
      const isMediaLoading = slotLoading(loading, 'media')
      const aspectClass = aspect && aspect !== 'none' ? {
        video: 'aspect-video',
        square: 'aspect-square',
        wide: 'aspect-wide',
      }[aspect] : ''

      if (!children && !isMediaLoading) {
        return null
      }

      return (
          <div
              ref={ref}
              className={cx(
                  'overflow-hidden relative',
                  aspectClass,
                  position === 'top' && 'border-b border-ash',
                  position === 'bottom' && 'border-t border-ash',
                  className
              )}
              {...props}
          >
            {isMediaLoading ? (
                <Skeleton className="w-full h-full"/>
            ) : (
                children
            )}
          </div>
      )
    }
)

CardMedia.displayName = 'CardMedia'

CardHandle.displayName = 'CardHandle'

// Compound component pattern
export const Card = Object.assign(CardBase, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
  Media: CardMedia,
  Handle: CardHandle,
})