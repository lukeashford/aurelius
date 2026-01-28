import React from 'react'
import {cx} from '../../utils/cx'
import type {IconProps} from './index'

export function CheckSquareIcon({className, ...props}: IconProps) {
  return (
    <div
      className={cx(
        'relative w-4 h-4 flex-shrink-0 border-2 border-gold bg-gold/10',
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
          d="M3 8l3 3 7-7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gold"
        />
      </svg>
    </div>
  )
}
