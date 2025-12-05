import React from 'react'

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

function cx(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...rest }, ref) => {
    return (
      <label
        ref={ref}
        className={cx('aurelius-label', required && 'aurelius-label--required', className)}
        {...rest}
      >
        {children}
      </label>
    )
  }
)

Label.displayName = 'Label'

export default Label
