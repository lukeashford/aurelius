import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cx } from '../utils/cx'

export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom'

export interface DrawerProps {
  /** Whether the drawer is open */
  isOpen: boolean
  /** Callback when the drawer should close */
  onClose: () => void
  /** Position of the drawer */
  position?: DrawerPosition
  /** Title for the drawer header */
  title?: string
  /** Width/height of the drawer (depending on position) */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /** Content */
  children: React.ReactNode
  /** Additional class name for the drawer panel */
  className?: string
}

const SIZE_MAP: Record<string, Record<DrawerPosition, string>> = {
  sm: {
    left: 'w-64',
    right: 'w-64',
    top: 'h-48',
    bottom: 'h-48',
  },
  md: {
    left: 'w-80',
    right: 'w-80',
    top: 'h-64',
    bottom: 'h-64',
  },
  lg: {
    left: 'w-96',
    right: 'w-96',
    top: 'h-80',
    bottom: 'h-80',
  },
  xl: {
    left: 'w-[32rem]',
    right: 'w-[32rem]',
    top: 'h-96',
    bottom: 'h-96',
  },
  full: {
    left: 'w-full',
    right: 'w-full',
    top: 'h-full',
    bottom: 'h-full',
  },
}

const POSITION_CLASSES: Record<DrawerPosition, string> = {
  left: 'left-0 top-0 h-full',
  right: 'right-0 top-0 h-full',
  top: 'top-0 left-0 w-full',
  bottom: 'bottom-0 left-0 w-full',
}

const TRANSFORM_CLASSES: Record<DrawerPosition, { open: string; closed: string }> = {
  left: { open: 'translate-x-0', closed: '-translate-x-full' },
  right: { open: 'translate-x-0', closed: 'translate-x-full' },
  top: { open: 'translate-y-0', closed: '-translate-y-full' },
  bottom: { open: 'translate-y-0', closed: 'translate-y-full' },
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  position = 'right',
  title,
  size = 'md',
  children,
  className,
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = '0px'
    }
    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = '0px'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  if (!mounted) return null

  const content = (
    <div
      className={cx(
        'fixed inset-0 z-50',
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      )}
    >
      {/* Backdrop */}
      <div
        className={cx(
          'fixed inset-0 bg-obsidian/80 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={cx(
          'fixed bg-charcoal border-ash shadow-2xl flex flex-col',
          'transition-transform duration-300 ease-out',
          POSITION_CLASSES[position],
          SIZE_MAP[size][position],
          position === 'left' && 'border-r',
          position === 'right' && 'border-l',
          position === 'top' && 'border-b',
          position === 'bottom' && 'border-t',
          isOpen ? TRANSFORM_CLASSES[position].open : TRANSFORM_CLASSES[position].closed,
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-ash">
          {title ? (
            <h2 className="text-lg font-semibold text-white m-0">{title}</h2>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="text-silver hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}

Drawer.displayName = 'Drawer'
