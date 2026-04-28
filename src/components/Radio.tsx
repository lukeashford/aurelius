import React, {useCallback, useId} from 'react'
import {composeRefs, cx} from '../utils'

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const radioDotSvg = "url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%231A1A1A' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e\")"

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
    ({className, label, id, onChange, ...rest}, ref) => {
      const generatedId = useId()
      const inputId = id || rest.name || generatedId

      const initBackground = useCallback((node: HTMLInputElement | null) => {
        if (node && node.checked) {
          node.style.backgroundImage = radioDotSvg
        }
      }, [])

      const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.currentTarget
        if (input.checked) {
          input.style.backgroundImage = radioDotSvg
          // Clear other radios in the same group. Browsers already uncheck siblings,
          // but the inline-style background dot doesn't get a change event there.
          if (input.name) {
            const escaped = typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
                ? CSS.escape(input.name)
                : input.name.replace(/["\\\]]/g, '\\$&')
            const radios = input.ownerDocument.querySelectorAll<HTMLInputElement>(
                `input[type="radio"][name="${escaped}"]`)
            radios.forEach((radio) => {
              if (radio !== input) {
                radio.style.backgroundImage = 'none'
              }
            })
          }
        } else {
          input.style.backgroundImage = 'none'
        }
        onChange?.(e)
      }, [onChange])

      return (
          <div className="flex items-center">
            <input
                {...rest}
                type="radio"
                id={inputId}
                ref={composeRefs(initBackground, ref)}
                className={cx(
                    'appearance-none h-4 w-4 border border-ash rounded-full bg-graphite',
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

Radio.displayName = 'Radio'

export default Radio
