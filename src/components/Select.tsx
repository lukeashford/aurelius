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

const selectBgImage = "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23C9A227' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")"

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ error = false, className, disabled, options, children, ...rest }, ref) => {
    return (
      <select
        ref={ref}
        className={cx(
          'appearance-none bg-graphite border border-ash rounded-none text-white px-3 py-2 pr-8',
          'focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-error focus:border-error focus:ring-error',
          className
        )}
        style={{
          backgroundImage: selectBgImage,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
        }}
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
