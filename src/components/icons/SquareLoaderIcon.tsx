import React from 'react'
import {cx} from '../../utils/cx'
import type {IconProps} from './index'

/**
 * Square loading spinner with "snake" animation.
 * A golden stroke travels around a square border.
 */
export function SquareLoaderIcon({className, ...props}: IconProps) {
  return (
    <div className={cx('relative w-4 h-4 flex-shrink-0', className)} {...props}>
      <svg
        viewBox="0 0 16 16"
        className="w-full h-full animate-snake-spin"
      >
        {/* Square border path that the snake travels around */}
        <rect
          x="1"
          y="1"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-ash/40"
        />
        {/* The "snake" - an animated stroke */}
        <rect
          x="1"
          y="1"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="14 42"
          strokeLinecap="square"
          className="text-gold animate-snake-travel"
        />
      </svg>
    </div>
  )
}
