import React, { useState } from 'react'

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
}

function cx(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked: controlledChecked, defaultChecked = false, onCheckedChange, disabled, className, label, ...rest }, ref) => {
    const [internalChecked, setInternalChecked] = useState(defaultChecked)
    const isControlled = controlledChecked !== undefined
    const checked = isControlled ? controlledChecked : internalChecked

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return
      const newChecked = !checked
      if (!isControlled) {
        setInternalChecked(newChecked)
      }
      onCheckedChange?.(newChecked)
      rest.onClick?.(e)
    }

    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          data-state={checked ? 'checked' : 'unchecked'}
          disabled={disabled}
          ref={ref}
          onClick={handleClick}
          className={cx('switch', className)}
          {...rest}
        >
          <span className="switch-thumb" />
        </button>
        {label && (
          <span className="text-sm text-silver cursor-pointer" onClick={() => !disabled && handleClick({} as any)}>
            {label}
          </span>
        )}
      </div>
    )
  }
)

Switch.displayName = 'Switch'

export default Switch
