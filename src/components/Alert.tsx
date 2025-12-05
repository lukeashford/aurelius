import React from 'react'
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

export type AlertVariant = 'info' | 'success' | 'warning' | 'error'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  title?: string
}

function cx(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
}

const variantStyles = {
  info: 'bg-info/10 border-info text-info',
  success: 'bg-success/10 border-success text-success',
  warning: 'bg-warning/10 border-warning text-warning',
  error: 'bg-error/10 border-error text-error',
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'info', title, children, className, ...rest }, ref) => {
    const Icon = icons[variant]

    return (
      <div
        ref={ref}
        role="alert"
        className={cx(
          'relative w-full p-4 rounded-none border border-l-4 flex gap-3',
          variantStyles[variant],
          className
        )}
        {...rest}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <div className="flex-1">
          {title && <h5 className="mb-1 font-medium leading-none tracking-tight text-current">{title}</h5>}
          <div className="text-sm opacity-90">{children}</div>
        </div>
      </div>
    )
  }
)

Alert.displayName = 'Alert'

export default Alert
