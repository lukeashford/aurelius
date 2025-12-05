import React, { useCallback } from 'react'

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

function cx(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

const checkmarkSvg = "url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%231A1A1A' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e\")"

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...rest }, ref) => {
    const inputId = id || rest.name || Math.random().toString(36).substr(2, 9)

    const setRef = useCallback((node: HTMLInputElement | null) => {
      if (node) {
        // Set initial background image based on checked state
        if (node.checked) {
          node.style.backgroundImage = checkmarkSvg
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
          type="checkbox"
          id={inputId}
          ref={setRef}
          className={cx(
            'appearance-none h-4 w-4 border border-ash rounded-sm bg-graphite',
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
              input.style.backgroundImage = checkmarkSvg
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

Checkbox.displayName = 'Checkbox'

export default Checkbox
