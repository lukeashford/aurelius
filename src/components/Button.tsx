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
      const variantClass =
          variant === 'primary'
              ? 'aurelius-btn--primary'
              : variant === 'important'
                  ? 'aurelius-btn--important'
                  : variant === 'elevated'
                      ? 'aurelius-btn--elevated'
                      : variant === 'outlined'
                          ? 'aurelius-btn--outlined'
                          : variant === 'featured'
                              ? 'aurelius-btn--featured'
                              : variant === 'ghost'
                                  ? 'aurelius-btn--ghost'
                                  : 'aurelius-btn--danger'

      const sizeClass = `aurelius-btn--${size}`

      return (
          <button
              ref={ref}
              className={cx('aurelius-btn', variantClass, sizeClass, loading && 'opacity-80', className)}
              disabled={isDisabled}
              {...rest}
          >
            {loading && (
                <span className="mr-2 inline-block h-4 w-4 animate-pulse rounded-full bg-gold"
                      aria-hidden/>
            )}
            {children}
          </button>
      )
    }
)

Button.displayName = 'Button'

export default Button
