import React from 'react'
import { cx } from '../utils/cx'

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...rest }, ref) => {
    return (
      <label
        ref={ref}
        className={cx('block text-sm font-medium text-silver mb-1.5', className)}
        {...rest}
      >
        {children}
        {required && <span className="text-error ml-1">*</span>}
      </label>
    )
  }
)

Label.displayName = 'Label'

export default Label
