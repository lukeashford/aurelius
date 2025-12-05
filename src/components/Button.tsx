import React from 'react'

export type ButtonVariant =
    | 'primary'
    | 'important'
    | 'elevated'
    | 'outlined'
    | 'featured'
    | 'ghost'
    | 'danger'

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

function cx(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({variant = 'primary', size = 'md', loading = false, className, disabled, children, ...rest},
        ref) => {
      const isDisabled = disabled || loading

      // Base button styles - common to all variants
      const base =
          'inline-flex items-center justify-center font-semibold tracking-wide ' +
          'transition-all duration-fast ' +
          'rounded-none ' +
          'disabled:opacity-50 disabled:cursor-not-allowed'

      // Variant styles
      const variantClasses = {
        primary:
            'bg-charcoal text-white border border-gold/30 ' +
            'hover:border-gold hover:shadow-glow hover:text-gold-light ' +
            'active:bg-white/5 ' +
            'focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ' +
            'focus-visible:ring-offset-obsidian',

        important:
            'bg-gold text-obsidian border border-gold ' +
            'hover:bg-gold-light hover:text-obsidian ' +
            'active:bg-gold-bright ' +
            'focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ' +
            'focus-visible:ring-offset-obsidian',

        elevated:
            'bg-charcoal text-white border-0 shadow-lg ' +
            'hover:shadow-xl hover:text-gold-light ' +
            'active:bg-white/5 ' +
            'focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ' +
            'focus-visible:ring-offset-obsidian',

        outlined:
            'bg-transparent text-white border border-ash ' +
            'hover:border-white hover:text-white ' +
            'active:bg-white/5 ' +
            'focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ' +
            'focus-visible:ring-offset-obsidian',

        featured:
            'bg-charcoal text-white border border-gold ' +
            'shadow-[0_0_10px_rgba(201,162,39,0.2)] ' +
            'hover:shadow-[0_0_15px_rgba(201,162,39,0.4)] hover:text-gold-light ' +
            'active:bg-white/5 ' +
            'focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ' +
            'focus-visible:ring-offset-obsidian',

        ghost:
            'bg-transparent text-gold border-0 ' +
            'hover:text-gold-light ' +
            'active:text-gold-bright ' +
            'focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ' +
            'focus-visible:ring-offset-obsidian',

        danger:
            'bg-error text-white border-0 ' +
            'hover:bg-error/90 ' +
            'active:bg-error/80 ' +
            'focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2 ' +
            'focus-visible:ring-offset-obsidian',
      }

      // Size styles
      const sizeClasses = {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
      }

      const variantClass = variantClasses[variant]
      const sizeClass = sizeClasses[size]

      return (
          <button
              ref={ref}
              className={cx(base, variantClass, sizeClass, loading && 'opacity-80', className)}
              disabled={isDisabled}
              {...rest}
          >
            {loading && (
                <span
                    className="mr-2 inline-block h-4 w-4 animate-pulse rounded-full bg-gold"
                    aria-hidden
                />
            )}
            {children}
          </button>
      )
    }
)

Button.displayName = 'Button'

export default Button
