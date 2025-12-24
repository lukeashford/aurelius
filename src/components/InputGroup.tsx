import React from 'react'
import { cx } from '../utils/cx'

// InputGroup container
export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cx('flex', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

InputGroup.displayName = 'InputGroup'

// InputLeftAddon - static text/icon on the left
export interface InputAddonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const InputLeftAddon = React.forwardRef<HTMLDivElement, InputAddonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cx(
          'flex items-center px-3 bg-slate border border-r-0 border-ash',
          'text-sm text-silver whitespace-nowrap',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

InputLeftAddon.displayName = 'InputLeftAddon'

// InputRightAddon - static text/icon on the right
export const InputRightAddon = React.forwardRef<HTMLDivElement, InputAddonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cx(
          'flex items-center px-3 bg-slate border border-l-0 border-ash',
          'text-sm text-silver whitespace-nowrap',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

InputRightAddon.displayName = 'InputRightAddon'

// InputLeftElement - overlaid element on the left (like an icon inside the input)
export interface InputElementProps extends React.HTMLAttributes<HTMLDivElement> {}

export const InputLeftElement = React.forwardRef<HTMLDivElement, InputElementProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cx(
          'absolute left-0 inset-y-0 flex items-center pl-3',
          'pointer-events-none text-silver',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

InputLeftElement.displayName = 'InputLeftElement'

// InputRightElement - overlaid element on the right (like a button inside the input)
export const InputRightElement = React.forwardRef<HTMLDivElement, InputElementProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cx(
          'absolute right-0 inset-y-0 flex items-center pr-3',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

InputRightElement.displayName = 'InputRightElement'

// InputWrapper - for relative positioning when using left/right elements
export interface InputWrapperProps extends React.HTMLAttributes<HTMLDivElement> {}

export const InputWrapper = React.forwardRef<HTMLDivElement, InputWrapperProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cx('relative flex-1', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

InputWrapper.displayName = 'InputWrapper'
