import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
}

function cx(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error = false, className, leadingIcon, trailingIcon, disabled, ...rest }, ref) => {
    // Base input styles
    const base =
        'w-full h-10 px-3 bg-graphite border border-ash rounded-none ' +
        'text-white placeholder:text-zinc ' +
        'transition-all duration-fast ' +
        'focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none ' +
        'disabled:bg-slate disabled:text-dim disabled:cursor-not-allowed'

    // Error styles
    const errorCls = error ? 'border-error focus:border-error focus:ring-error' : ''

    return (
      <div className={cx('relative', disabled && 'opacity-90')}>
        {leadingIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-silver">
            {leadingIcon}
          </span>
        )}
        <input
          ref={ref}
          className={cx(
            base,
            errorCls,
            (leadingIcon || trailingIcon) && 'pl-9 pr-9',
            className
          )}
          disabled={disabled}
          {...rest}
        />
        {trailingIcon && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-silver">
            {trailingIcon}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
