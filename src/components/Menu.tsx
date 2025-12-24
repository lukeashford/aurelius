import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  useId,
} from 'react'
import { cx } from '../utils/cx'

// Context for managing menu state
interface MenuContextValue {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  triggerId: string
  menuId: string
}

const MenuContext = createContext<MenuContextValue | null>(null)

function useMenuContext() {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error('Menu components must be used within a Menu provider')
  }
  return context
}

// Main Menu container
export interface MenuProps {
  children: React.ReactNode
  /** Controlled open state */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
}

export const Menu: React.FC<MenuProps> = ({ children, open, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  const baseId = useId()

  const setIsOpen = useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    },
    [isControlled, onOpenChange]
  )

  return (
    <MenuContext.Provider
      value={{
        isOpen,
        setIsOpen,
        triggerId: `${baseId}-trigger`,
        menuId: `${baseId}-menu`,
      }}
    >
      <div className="relative inline-block">{children}</div>
    </MenuContext.Provider>
  )
}

Menu.displayName = 'Menu'

// MenuTrigger - button that opens the menu
export interface MenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Render as a different element (using render props) */
  asChild?: boolean
}

export const MenuTrigger = React.forwardRef<HTMLButtonElement, MenuTriggerProps>(
  ({ children, className, asChild, ...props }, ref) => {
    const { isOpen, setIsOpen, triggerId, menuId } = useMenuContext()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      setIsOpen(!isOpen)
      props.onClick?.(e)
    }

    return (
      <button
        ref={ref}
        id={triggerId}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={handleClick}
        className={cx(
          'inline-flex items-center justify-center',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

MenuTrigger.displayName = 'MenuTrigger'

// MenuContent - the dropdown menu
export interface MenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Alignment of the menu */
  align?: 'start' | 'center' | 'end'
  /** Side of the trigger to render on */
  side?: 'top' | 'bottom'
}

export const MenuContent = React.forwardRef<HTMLDivElement, MenuContentProps>(
  ({ children, className, align = 'start', side = 'bottom', ...props }, ref) => {
    const { isOpen, setIsOpen, triggerId, menuId } = useMenuContext()
    const menuRef = useRef<HTMLDivElement>(null)

    // Close on outside click
    useEffect(() => {
      if (!isOpen) return

      const handleClickOutside = (e: MouseEvent) => {
        const trigger = document.getElementById(triggerId)
        if (
          menuRef.current &&
          !menuRef.current.contains(e.target as Node) &&
          trigger &&
          !trigger.contains(e.target as Node)
        ) {
          setIsOpen(false)
        }
      }

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscape)
      }
    }, [isOpen, setIsOpen, triggerId])

    if (!isOpen) return null

    const alignmentClasses = {
      start: 'left-0',
      center: 'left-1/2 -translate-x-1/2',
      end: 'right-0',
    }

    const sideClasses = {
      top: 'bottom-full mb-1',
      bottom: 'top-full mt-1',
    }

    return (
      <div
        ref={(node) => {
          menuRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) ref.current = node
        }}
        id={menuId}
        role="menu"
        aria-labelledby={triggerId}
        className={cx(
          'absolute z-50 min-w-40 py-1',
          'bg-charcoal border border-ash shadow-lg',
          'animate-fade-in',
          alignmentClasses[align],
          sideClasses[side],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

MenuContent.displayName = 'MenuContent'

// MenuItem - individual menu option
export interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon to display before the label */
  icon?: React.ReactNode
  /** Show destructive styling */
  destructive?: boolean
}

export const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(
  ({ children, className, icon, destructive, disabled, onClick, ...props }, ref) => {
    const { setIsOpen } = useMenuContext()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return
      onClick?.(e)
      setIsOpen(false)
    }

    return (
      <button
        ref={ref}
        type="button"
        role="menuitem"
        disabled={disabled}
        onClick={handleClick}
        className={cx(
          'flex w-full items-center gap-2 px-3 py-2 text-sm text-left',
          'transition-colors duration-fast',
          destructive
            ? 'text-error hover:bg-error/10'
            : 'text-white hover:bg-graphite',
          'focus-visible:outline-none focus-visible:bg-graphite',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {icon && <span className="w-4 h-4 shrink-0">{icon}</span>}
        {children}
      </button>
    )
  }
)

MenuItem.displayName = 'MenuItem'

// MenuSeparator - divider between menu items
export const MenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    className={cx('my-1 h-px bg-ash', className)}
    {...props}
  />
))

MenuSeparator.displayName = 'MenuSeparator'

// MenuLabel - non-interactive label
export const MenuLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cx('px-3 py-1.5 text-xs font-medium text-silver', className)}
    {...props}
  >
    {children}
  </div>
))

MenuLabel.displayName = 'MenuLabel'
