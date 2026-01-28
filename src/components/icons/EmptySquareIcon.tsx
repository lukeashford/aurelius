import React from 'react'
import {cx} from '../../utils/cx'
import type {IconProps} from './index'

export function EmptySquareIcon({className, ...props}: IconProps) {
  return (
    <div
      className={cx(
        'w-4 h-4 flex-shrink-0 border-2 border-ash/60',
        className
      )}
      {...props}
    />
  )
}
