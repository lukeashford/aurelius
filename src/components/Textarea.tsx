import React from 'react'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

function cx(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error = false, className, disabled, ...rest }, ref) => {
    // Base textarea styles
    const base =
        'w-full px-3 py-2 bg-graphite border border-ash rounded-none ' +
        'text-white placeholder:text-zinc min-h-[80px] ' +
        'transition-all duration-fast ' +
        'focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none ' +
        'disabled:bg-slate disabled:text-dim disabled:cursor-not-allowed'

    // Error styles
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
