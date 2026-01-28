import React from 'react'
import {cx} from '../../utils/cx'
import type {IconProps} from './index'

export interface CrossSquareIconProps extends IconProps {
  /**
   * Visual variant for different states
   * - 'cancelled': subtle ash coloring
   * - 'failed': error red coloring
   */
  variant?: 'cancelled' | 'failed'
}

export function CrossSquareIcon({className, variant = 'cancelled', ...props}: CrossSquareIconProps) {
  return (
    <div
      className={cx(
        'relative w-4 h-4 flex-shrink-0 border-2',
        variant === 'failed' ? 'border-error/60 bg-error/5' : 'border-ash/40 bg-ash/5',
        className
      )}
      {...props}
    >
      <svg
        viewBox="0 0 16 16"
        fill="none"
        className="absolute inset-0 w-full h-full p-0.5"
      >
        <path
          d="M4 4l8 8M12 4l-8 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className={variant === 'failed' ? 'text-error/60' : 'text-ash/40'}
        />
      </svg>
    </div>
  )
}
