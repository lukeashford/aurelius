import React from 'react'

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

function cx(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...rest }, ref) => {
    const inputId = id || rest.name || Math.random().toString(36).substr(2, 9)

    return (
      <div className="flex items-center">
        <input
          type="checkbox"
          id={inputId}
          ref={ref}
          className={cx('aurelius-checkbox', className)}
          {...rest}
        />
        {label && (
          <label htmlFor={inputId} className="ml-2 text-sm text-silver cursor-pointer select-none">
            {label}
          </label>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
