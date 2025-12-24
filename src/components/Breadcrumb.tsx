import React from 'react'
import { ChevronRight } from 'lucide-react'
import { cx } from '../utils/cx'

// Breadcrumb container
export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  /** Custom separator element */
  separator?: React.ReactNode
}

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ separator, className, children, ...props }, ref) => {
    const items = React.Children.toArray(children)
    const defaultSeparator = <ChevronRight className="h-4 w-4 text-ash" />

    return (
      <nav ref={ref} aria-label="Breadcrumb" className={className} {...props}>
        <ol className="flex items-center gap-2">
          {items.map((child, index) => (
            <li key={index} className="flex items-center gap-2">
              {child}
              {index < items.length - 1 && (
                <span aria-hidden="true">{separator ?? defaultSeparator}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    )
  }
)

Breadcrumb.displayName = 'Breadcrumb'

// BreadcrumbItem - individual breadcrumb item
export interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Whether this is the current page */
  current?: boolean
}

export const BreadcrumbItem = React.forwardRef<HTMLSpanElement, BreadcrumbItemProps>(
  ({ current = false, className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        aria-current={current ? 'page' : undefined}
        className={cx(
          'text-sm',
          current ? 'text-white font-medium' : 'text-silver',
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

BreadcrumbItem.displayName = 'BreadcrumbItem'

// BreadcrumbLink - clickable breadcrumb link
export interface BreadcrumbLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

export const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cx(
          'text-sm text-silver hover:text-gold transition-colors duration-fast',
          className
        )}
        {...props}
      >
        {children}
      </a>
    )
  }
)

BreadcrumbLink.displayName = 'BreadcrumbLink'
