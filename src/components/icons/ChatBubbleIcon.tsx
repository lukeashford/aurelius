import React from 'react'
import type {IconProps} from './index'

export function ChatBubbleIcon({className, ...props}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path
        d="M2 3h16v11H6l-4 3V3z"
      />
    </svg>
  )
}
