import React from 'react'
import { cx } from '../utils/cx'

export interface HelperTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: boolean
}

export const HelperText = React.forwardRef<HTMLParagraphElement, HelperTextProps>(
  ({ className, error, children, ...rest }, ref) => {
    return (
      <p
        ref={ref}
        className={cx('mt-1.5 text-xs', error ? 'text-error' : 'text-silver', className)}
        {...rest}
      >
        {children}
      </p>
    )
  }
)

HelperText.displayName = 'HelperText'

export default HelperText
