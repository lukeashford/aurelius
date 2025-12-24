import React, { createContext, useContext, useState, useCallback, useId } from 'react'
import { ChevronDown } from 'lucide-react'
import { cx } from '../utils/cx'

// Context for managing accordion state
interface AccordionContextValue {
  expandedItems: Set<string>
  toggleItem: (id: string) => void
  type: 'single' | 'multiple'
}

const AccordionContext = createContext<AccordionContextValue | null>(null)

function useAccordionContext() {
  const context = useContext(AccordionContext)
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion provider')
  }
  return context
}

// Main Accordion container
export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Allow multiple items to be open at once */
  type?: 'single' | 'multiple'
  /** Default expanded item(s) */
  defaultValue?: string | string[]
  /** Controlled expanded item(s) */
  value?: string | string[]
  /** Callback when expanded items change */
  onValueChange?: (value: string | string[]) => void
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    { type = 'single', defaultValue, value, onValueChange, children, className, ...props },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<Set<string>>(() => {
      if (defaultValue) {
        return new Set(Array.isArray(defaultValue) ? defaultValue : [defaultValue])
      }
      return new Set()
    })

    const isControlled = value !== undefined
    const expandedItems = isControlled
      ? new Set(Array.isArray(value) ? value : [value])
      : internalValue

    const toggleItem = useCallback(
      (id: string) => {
        const newSet = new Set(expandedItems)

        if (newSet.has(id)) {
          newSet.delete(id)
        } else {
          if (type === 'single') {
            newSet.clear()
          }
          newSet.add(id)
        }

        if (!isControlled) {
          setInternalValue(newSet)
        }

        const newValue = Array.from(newSet)
        onValueChange?.(type === 'single' ? newValue[0] ?? '' : newValue)
      },
      [expandedItems, type, isControlled, onValueChange]
    )

    return (
      <AccordionContext.Provider value={{ expandedItems, toggleItem, type }}>
        <div
          ref={ref}
          className={cx('divide-y divide-ash border border-ash', className)}
          {...props}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    )
  }
)

Accordion.displayName = 'Accordion'

// AccordionItem - individual accordion section
export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Unique identifier for this item */
  value: string
  /** Disable this item */
  disabled?: boolean
}

const AccordionItemContext = createContext<{ value: string; disabled: boolean } | null>(null)

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, disabled = false, children, className, ...props }, ref) => {
    return (
      <AccordionItemContext.Provider value={{ value, disabled }}>
        <div
          ref={ref}
          data-state={useAccordionContext().expandedItems.has(value) ? 'open' : 'closed'}
          className={cx('bg-charcoal', className)}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    )
  }
)

AccordionItem.displayName = 'AccordionItem'

// AccordionTrigger - clickable header
export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, className, ...props }, ref) => {
    const { expandedItems, toggleItem } = useAccordionContext()
    const itemContext = useContext(AccordionItemContext)
    const baseId = useId()

    if (!itemContext) {
      throw new Error('AccordionTrigger must be used within an AccordionItem')
    }

    const { value, disabled } = itemContext
    const isExpanded = expandedItems.has(value)

    return (
      <h3 className="m-0">
        <button
          ref={ref}
          type="button"
          id={`${baseId}-trigger-${value}`}
          aria-expanded={isExpanded}
          aria-controls={`${baseId}-content-${value}`}
          disabled={disabled}
          onClick={() => toggleItem(value)}
          className={cx(
            'flex w-full items-center justify-between px-4 py-3',
            'text-left text-sm font-medium text-white',
            'transition-colors duration-fast',
            'hover:bg-graphite',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-inset',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          {...props}
        >
          <span>{children}</span>
          <ChevronDown
            className={cx(
              'h-4 w-4 text-silver transition-transform duration-200',
              isExpanded && 'rotate-180'
            )}
          />
        </button>
      </h3>
    )
  }
)

AccordionTrigger.displayName = 'AccordionTrigger'

// AccordionContent - expandable content
export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, className, ...props }, ref) => {
    const { expandedItems } = useAccordionContext()
    const itemContext = useContext(AccordionItemContext)
    const baseId = useId()

    if (!itemContext) {
      throw new Error('AccordionContent must be used within an AccordionItem')
    }

    const { value } = itemContext
    const isExpanded = expandedItems.has(value)

    return (
      <div
        ref={ref}
        id={`${baseId}-content-${value}`}
        role="region"
        aria-labelledby={`${baseId}-trigger-${value}`}
        hidden={!isExpanded}
        className={cx(
          'overflow-hidden transition-all duration-200',
          isExpanded ? 'animate-fade-in' : 'hidden',
          className
        )}
        {...props}
      >
        <div className="px-4 pb-4 text-sm text-silver">{children}</div>
      </div>
    )
  }
)

AccordionContent.displayName = 'AccordionContent'
