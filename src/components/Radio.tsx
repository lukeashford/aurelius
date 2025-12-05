import React from 'react'

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

function cx(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, ...rest }, ref) => {
    const inputId = id || rest.name || Math.random().toString(36).substr(2, 9)

    return (
      <div className="flex items-center">
        <input
          type="radio"
          id={inputId}
          ref={ref}
          className={cx('aurelius-radio', className)}
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

Radio.displayName = 'Radio'

export default Radio
