import React from 'react'

export interface SelectOption {
  label: string
  value: string | number
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
  options?: SelectOption[]
}

function cx(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ error = false, className, disabled, options, children, ...rest }, ref) => {
    const base = 'select'
    const errorCls = error ? 'border-error focus:border-error focus:ring-error' : ''

    return (
      <select
        ref={ref}
        className={cx(base, errorCls, disabled && 'opacity-90', className)}
        disabled={disabled}
        {...rest}
      >
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
    )
  }
)

Select.displayName = 'Select'

export default Select
