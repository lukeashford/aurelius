import React from 'react'
import type {IconProps} from './index'

/**
 * Media icon — a film frame with play triangle, representing video and media artifacts.
 */
export function MediaIcon({className, ...props}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M2 4.5A1.5 1.5 0 013.5 3h13A1.5 1.5 0 0118 4.5v11a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 012 15.5v-11zM4 5v1h1V5H4zm2 0v1h1V5H6zm7 0v1h1V5h-1zm2 0v1h1V5h-1zM4 14v1h1v-1H4zm2 0v1h1v-1H6zm7 0v1h1v-1h-1zm2 0v1h1v-1h-1zM8 8.118a.5.5 0 01.757-.429l4 2.382a.5.5 0 010 .858l-4 2.382A.5.5 0 018 12.882V8.118z"
        clipRule="evenodd"
      />
    </svg>
  )
}
