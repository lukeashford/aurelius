import React, { useCallback } from 'react'

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

function cx(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

const radioDotSvg = "url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%231A1A1A' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e\")"

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, ...rest }, ref) => {
    const inputId = id || rest.name || Math.random().toString(36).substr(2, 9)

    const setRef = useCallback((node: HTMLInputElement | null) => {
      if (node) {
        // Set initial background image based on checked state
        if (node.checked) {
          node.style.backgroundImage = radioDotSvg
        }
      }
      // Forward ref
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    }, [ref])

    return (
      <div className="flex items-center">
        <input
          type="radio"
          id={inputId}
          ref={setRef}
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
          onChange={(e) => {
            const input = e.currentTarget
            if (input.checked) {
              input.style.backgroundImage = radioDotSvg
              // Clear other radios in the same group
              if (input.name) {
                const radios = document.querySelectorAll<HTMLInputElement>(`input[type="radio"][name="${input.name}"]`)
                radios.forEach((radio) => {
                  if (radio !== input) {
                    radio.style.backgroundImage = 'none'
                  }
                })
              }
            } else {
              input.style.backgroundImage = 'none'
            }
            rest.onChange?.(e)
          }}
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
