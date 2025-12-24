import React from 'react'
import { Check } from 'lucide-react'
import { cx } from '../utils/cx'

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'ghost' | 'featured'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual style variant */
  variant?: CardVariant
  /** Enables hover effects and cursor pointer */
  interactive?: boolean
  /** Shows selected state with checkmark */
  selected?: boolean
  /** Remove default padding (useful with compound components) */
  noPadding?: boolean
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
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cx(
          'rounded-none relative',
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
          <div className="absolute top-3 right-3 flex items-center justify-center h-6 w-6 rounded-full bg-gold text-obsidian">
            <Check className="h-4 w-4" />
          </div>
        )}
      </div>
    )
  }
)

CardBase.displayName = 'Card'

// Card.Header - header section with title and optional actions
export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Card title */
  title?: React.ReactNode
  /** Subtitle or description */
  subtitle?: React.ReactNode
  /** Action elements (buttons, icons, etc.) */
  action?: React.ReactNode
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cx('px-6 py-4 border-b border-ash', className)}
        {...props}
      >
        {(title || subtitle || action) ? (
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {title && (
                <h3 className="text-lg font-semibold text-white m-0">{title}</h3>
              )}
              {subtitle && (
                <p className="text-sm text-silver mt-1 m-0">{subtitle}</p>
              )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        ) : (
          children
        )}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

// Card.Body - main content area
export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cx('px-6 py-4', className)} {...props}>
        {children}
      </div>
    )
  }
)

CardBody.displayName = 'CardBody'

// Card.Footer - footer section, typically for actions
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Align content */
  align?: 'start' | 'center' | 'end' | 'between'
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ align = 'end', className, children, ...props }, ref) => {
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
  /** Image source */
  src?: string
  /** Alt text for image */
  alt?: string
  /** Aspect ratio */
  aspect?: 'video' | 'square' | 'wide'
  /** Position in card */
  position?: 'top' | 'bottom'
}

const CardMedia = React.forwardRef<HTMLDivElement, CardMediaProps>(
  ({ src, alt = '', aspect = 'video', position = 'top', className, children, ...props }, ref) => {
    const aspectClass = {
      video: 'aspect-video',
      square: 'aspect-square',
      wide: 'aspect-wide',
    }[aspect]

    return (
      <div
        ref={ref}
        className={cx(
          'overflow-hidden',
          aspectClass,
          position === 'top' && 'border-b border-ash',
          position === 'bottom' && 'border-t border-ash',
          className
        )}
        {...props}
      >
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          children
        )}
      </div>
    )
  }
)

CardMedia.displayName = 'CardMedia'

// Compound component pattern
export const Card = Object.assign(CardBase, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
  Media: CardMedia,
})