import React, { useState, useRef, useEffect, useCallback, useId } from 'react'
import { cx } from '../utils/cx'

export type PopoverPosition = 'top' | 'bottom' | 'left' | 'right'
export type PopoverAlign = 'start' | 'center' | 'end'

export interface PopoverProps {
  children: React.ReactNode
  /** The trigger element */
  trigger: React.ReactElement
  /** Position relative to trigger */
  position?: PopoverPosition
  /** Alignment along the position axis */
  align?: PopoverAlign
  /** Controlled open state */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Close when clicking outside */
  closeOnClickOutside?: boolean
}

const POSITION_CLASSES: Record<PopoverPosition, Record<PopoverAlign, string>> = {
  top: {
    start: 'bottom-full left-0 mb-2',
    center: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    end: 'bottom-full right-0 mb-2',
  },
  bottom: {
    start: 'top-full left-0 mt-2',
    center: 'top-full left-1/2 -translate-x-1/2 mt-2',
    end: 'top-full right-0 mt-2',
  },
  left: {
    start: 'right-full top-0 mr-2',
    center: 'right-full top-1/2 -translate-y-1/2 mr-2',
    end: 'right-full bottom-0 mr-2',
  },
  right: {
    start: 'left-full top-0 ml-2',
    center: 'left-full top-1/2 -translate-y-1/2 ml-2',
    end: 'left-full bottom-0 ml-2',
  },
}

export const Popover: React.FC<PopoverProps> = ({
  children,
  trigger,
  position = 'bottom',
  align = 'center',
  open: controlledOpen,
  onOpenChange,
  closeOnClickOutside = true,
}) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : internalOpen

  const containerRef = useRef<HTMLDivElement>(null)
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

  // Close on outside click
  useEffect(() => {
    if (!isOpen || !closeOnClickOutside) return

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, closeOnClickOutside, setIsOpen])

  // Close on escape
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, setIsOpen])

  const handleTriggerClick = () => {
    setIsOpen(!isOpen)
  }

  const triggerElement = React.cloneElement(trigger as React.ReactElement<any>, {
    onClick: handleTriggerClick,
    'aria-haspopup': 'dialog',
    'aria-expanded': isOpen,
    'aria-controls': `${baseId}-popover`,
    id: `${baseId}-trigger`,
  })

  return (
    <div ref={containerRef} className="relative inline-block">
      {triggerElement}
      {isOpen && (
        <div
          id={`${baseId}-popover`}
          role="dialog"
          aria-labelledby={`${baseId}-trigger`}
          className={cx(
            'absolute z-50 min-w-48 p-4',
            'bg-charcoal border border-ash shadow-lg',
            'animate-fade-in',
            POSITION_CLASSES[position][align]
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}

Popover.displayName = 'Popover'
