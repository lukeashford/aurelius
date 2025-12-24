import React from 'react'
import { cx } from '../utils/cx'

// List container
export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  /** Visual style variant */
  variant?: 'default' | 'bordered' | 'divided'
  /** Ordered list (numbered) */
  ordered?: boolean
}

export const List = React.forwardRef<HTMLUListElement, ListProps>(
  ({ variant = 'default', ordered = false, className, children, ...props }, ref) => {
    const Component = ordered ? 'ol' : 'ul'

    return (
      <Component
        ref={ref as any}
        className={cx(
          'list-none m-0 p-0',
          variant === 'bordered' && 'border border-ash',
          variant === 'divided' && 'divide-y divide-ash',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

List.displayName = 'List'

// ListItem
export interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  /** Icon or avatar on the left */
  leading?: React.ReactNode
  /** Action element on the right */
  trailing?: React.ReactNode
  /** Make the item interactive (clickable) */
  interactive?: boolean
  /** Selected state */
  selected?: boolean
  /** Disabled state */
  disabled?: boolean
}

export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  (
    {
      leading,
      trailing,
      interactive = false,
      selected = false,
      disabled = false,
      className,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
      if (disabled) return
      onClick?.(e)
    }

    return (
      <li
        ref={ref}
        onClick={handleClick}
        className={cx(
          'flex items-center gap-3 px-4 py-3',
          interactive && 'cursor-pointer transition-colors duration-fast',
          interactive && !disabled && 'hover:bg-graphite',
          selected && 'bg-gold/10',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {leading && <div className="shrink-0">{leading}</div>}
        <div className="flex-1 min-w-0">{children}</div>
        {trailing && <div className="shrink-0">{trailing}</div>}
      </li>
    )
  }
)

ListItem.displayName = 'ListItem'

// ListItemText - for structured text content
export interface ListItemTextProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Primary text */
  primary: React.ReactNode
  /** Secondary text */
  secondary?: React.ReactNode
}

export const ListItemText = React.forwardRef<HTMLDivElement, ListItemTextProps>(
  ({ primary, secondary, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cx('flex flex-col', className)} {...props}>
        <span className="text-sm font-medium text-white">{primary}</span>
        {secondary && (
          <span className="text-xs text-silver mt-0.5">{secondary}</span>
        )}
      </div>
    )
  }
)

ListItemText.displayName = 'ListItemText'

// ListSubheader - section header within a list
export interface ListSubheaderProps extends React.HTMLAttributes<HTMLLIElement> {}

export const ListSubheader = React.forwardRef<HTMLLIElement, ListSubheaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cx(
          'px-4 py-2 text-xs font-semibold text-gold uppercase tracking-wider bg-graphite',
          className
        )}
        {...props}
      >
        {children}
      </li>
    )
  }
)

ListSubheader.displayName = 'ListSubheader'
