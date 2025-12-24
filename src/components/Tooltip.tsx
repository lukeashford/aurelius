import React from 'react'
import { cx } from '../utils/cx'

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left'

export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactElement
  open?: boolean
  side?: TooltipSide
}

// Simple, controlled tooltip. Consumer handles open state.
export const Tooltip: React.FC<TooltipProps> = ({ content, children, open = false, side = 'top' }) => {
  return (
    <span className="relative inline-block">
      {children}
      <span
        role="tooltip"
        className={cx(
          'pointer-events-none absolute z-50 whitespace-nowrap rounded-md border border-ash bg-graphite px-3 py-1.5 text-sm text-white shadow-lg transition-opacity duration-200 ease-out',
          open ? 'opacity-100' : 'opacity-0',
          side === 'top' && 'left-1/2 -translate-x-1/2 -top-2 -translate-y-full',
          side === 'bottom' && 'left-1/2 -translate-x-1/2 -bottom-2 translate-y-full',
          side === 'left' && 'top-1/2 -translate-y-1/2 -left-2 -translate-x-full',
          side === 'right' && 'top-1/2 -translate-y-1/2 -right-2 translate-x-full'
        )}
      >
        {content}
      </span>
    </span>
  )
}

export default Tooltip
