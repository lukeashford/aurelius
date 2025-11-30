import React from 'react'

export interface HelperTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: boolean
}

function cx(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
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
