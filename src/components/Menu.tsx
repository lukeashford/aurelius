import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import {composeRefs, cx, useEscapeKey} from '../utils'

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
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const Menu: React.FC<MenuProps> = ({children, open, onOpenChange}) => {
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
  asChild?: boolean
}

export const MenuTrigger = React.forwardRef<HTMLButtonElement, MenuTriggerProps>(
    ({children, className, asChild, ...props}, ref) => {
      const {isOpen, setIsOpen, triggerId, menuId} = useMenuContext()

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
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'bottom'
}

const MENU_ALIGN_CLASSES: Record<NonNullable<MenuContentProps['align']>, string> = {
  start: 'left-0',
  center: 'left-1/2 -translate-x-1/2',
  end: 'right-0',
}

const MENU_SIDE_CLASSES: Record<NonNullable<MenuContentProps['side']>, string> = {
  top: 'bottom-full mb-1',
  bottom: 'top-full mt-1',
}

export const MenuContent = React.forwardRef<HTMLDivElement, MenuContentProps>(
    ({children, className, align = 'start', side = 'bottom', ...props}, ref) => {
      const {isOpen, setIsOpen, triggerId, menuId} = useMenuContext()
      const menuRef = useRef<HTMLDivElement>(null)

      const close = useCallback(() => setIsOpen(false), [setIsOpen])
      useEscapeKey(close, isOpen)

      // Close on outside click — but ignore clicks on the trigger so it can toggle the menu.
      useEffect(() => {
        if (!isOpen) {
          return
        }
        const handleClickOutside = (e: MouseEvent) => {
          const target = e.target as Node
          const trigger = document.getElementById(triggerId)
          if (
              menuRef.current &&
              !menuRef.current.contains(target) &&
              !trigger?.contains(target)
          ) {
            setIsOpen(false)
          }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
      }, [isOpen, setIsOpen, triggerId])

      if (!isOpen) {
        return null
      }

      return (
          <div
              ref={composeRefs(menuRef, ref)}
              id={menuId}
              role="menu"
              aria-labelledby={triggerId}
              className={cx(
                  'absolute z-50 min-w-40 py-1',
                  'bg-charcoal border border-ash shadow-lg',
                  'animate-fade-in',
                  MENU_ALIGN_CLASSES[align],
                  MENU_SIDE_CLASSES[side],
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
  icon?: React.ReactNode
  destructive?: boolean
}

export const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(
    ({children, className, icon, destructive, disabled, onClick, ...props}, ref) => {
      const {setIsOpen} = useMenuContext()

      const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) {
          return
        }
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
>(({className, ...props}, ref) => (
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
>(({className, children, ...props}, ref) => (
    <div
        ref={ref}
        className={cx('px-3 py-1.5 text-xs font-medium text-silver', className)}
        {...props}
    >
      {children}
    </div>
))

MenuLabel.displayName = 'MenuLabel'
