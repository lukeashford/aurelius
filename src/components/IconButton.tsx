import React from 'react'
import {Button, type ButtonProps} from './Button'

export interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  icon: React.ReactNode
}

function cx(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

const sizeMap = {
  sm: 'h-8 w-8 p-0',
  md: 'h-10 w-10 p-0',
  lg: 'h-12 w-12 p-0',
  xl: 'h-14 w-14 p-0',
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    ({icon, size = 'md', className, ...rest}, ref) => {
      return (
          <Button
              ref={ref}
              size={size}
              className={cx(sizeMap[size], className)}
              {...rest}
          >
            {icon}
          </Button>
      )
    }
)

IconButton.displayName = 'IconButton'

export default IconButton
