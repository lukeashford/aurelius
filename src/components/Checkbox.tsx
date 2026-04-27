import React, {useCallback, useId} from 'react'
import {composeRefs, cx} from '../utils'

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const checkmarkSvg = "url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%231A1A1A' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e\")"

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({className, label, id, onChange, ...rest}, ref) => {
      const generatedId = useId()
      const inputId = id || rest.name || generatedId

      const initBackground = useCallback((node: HTMLInputElement | null) => {
        if (node && node.checked) {
          node.style.backgroundImage = checkmarkSvg
        }
      }, [])

      const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        e.currentTarget.style.backgroundImage = e.currentTarget.checked ? checkmarkSvg : 'none'
        onChange?.(e)
      }, [onChange])

      return (
          <div className="flex items-center">
            <input
                {...rest}
                type="checkbox"
                id={inputId}
                ref={composeRefs(initBackground, ref)}
                className={cx(
                    'appearance-none h-4 w-4 border border-ash bg-graphite',
                    'checked:bg-gold checked:border-gold',
                    'focus:ring-1 focus:ring-gold focus:ring-offset-1 focus:ring-offset-obsidian',
                    'transition duration-200 ease-in-out cursor-pointer',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    className
                )}
                style={{
                  backgroundPosition: 'center',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                }}
                onChange={handleChange}
            />
            {label && (
                <label htmlFor={inputId}
                       className="ml-2 text-sm text-silver cursor-pointer select-none">
                  {label}
                </label>
            )}
          </div>
      )
    }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
