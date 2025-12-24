import React from 'react'
import { cx } from '../utils/cx'

// Main Navbar container
export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  /** Fixed to top of viewport */
  fixed?: boolean
  /** Add border at bottom */
  bordered?: boolean
}

export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ fixed = false, bordered = true, className, children, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cx(
          'w-full bg-charcoal px-4 py-3',
          bordered && 'border-b border-ash',
          fixed && 'fixed top-0 left-0 right-0 z-40',
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between">{children}</div>
      </nav>
    )
  }
)

Navbar.displayName = 'Navbar'

// NavbarBrand - logo/brand section
export interface NavbarBrandProps extends React.HTMLAttributes<HTMLDivElement> {}

export const NavbarBrand = React.forwardRef<HTMLDivElement, NavbarBrandProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cx('flex items-center gap-2', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

NavbarBrand.displayName = 'NavbarBrand'

// NavbarContent - center or end content area
export interface NavbarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Position of the content */
  position?: 'start' | 'center' | 'end'
}

export const NavbarContent = React.forwardRef<HTMLDivElement, NavbarContentProps>(
  ({ position = 'center', className, children, ...props }, ref) => {
    const positionClasses = {
      start: 'mr-auto',
      center: 'mx-auto',
      end: 'ml-auto',
    }

    return (
      <div
        ref={ref}
        className={cx(
          'flex items-center gap-4',
          positionClasses[position],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

NavbarContent.displayName = 'NavbarContent'

// NavbarItem - individual navigation item
export interface NavbarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Active state */
  active?: boolean
}

export const NavbarItem = React.forwardRef<HTMLDivElement, NavbarItemProps>(
  ({ active = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cx(
          'flex items-center',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

NavbarItem.displayName = 'NavbarItem'

// NavbarLink - navigation link
export interface NavbarLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Active state */
  active?: boolean
}

export const NavbarLink = React.forwardRef<HTMLAnchorElement, NavbarLinkProps>(
  ({ active = false, className, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cx(
          'text-sm font-medium transition-colors duration-fast',
          active ? 'text-gold' : 'text-silver hover:text-white',
          className
        )}
        {...props}
      >
        {children}
      </a>
    )
  }
)

NavbarLink.displayName = 'NavbarLink'

// NavbarDivider - vertical separator
export const NavbarDivider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cx('h-6 w-px bg-ash mx-2', className)}
    {...props}
  />
))

NavbarDivider.displayName = 'NavbarDivider'
