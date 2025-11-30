import React from 'react'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

function cx(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error = false, className, disabled, ...rest }, ref) => {
    const base = 'textarea'
    const errorCls = error ? 'border-error focus:border-error focus:ring-error' : ''

    return (
      <textarea
        ref={ref}
        className={cx(base, errorCls, disabled && 'opacity-90', className)}
        disabled={disabled}
        {...rest}
      />
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea
