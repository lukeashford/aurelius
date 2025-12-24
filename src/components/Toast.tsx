import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cx } from '../utils/cx'

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info'
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'

export interface ToastData {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
  action?: React.ReactNode
}

interface ToastContextValue {
  toasts: ToastData[]
  addToast: (toast: Omit<ToastData, 'id'>) => string
  removeToast: (id: string) => void
  position: ToastPosition
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  const toast = useCallback(
    (options: Omit<ToastData, 'id'>) => {
      return context.addToast(options)
    },
    [context]
  )

  return {
    toast,
    dismiss: context.removeToast,
  }
}

// ToastProvider - wrap your app with this
export interface ToastProviderProps {
  children: React.ReactNode
  /** Position of toasts on screen */
  position?: ToastPosition
  /** Default duration for toasts (ms) */
  defaultDuration?: number
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'bottom-right',
  defaultDuration = 5000,
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const addToast = useCallback(
    (toast: Omit<ToastData, 'id'>) => {
      const id = Math.random().toString(36).substr(2, 9)
      const newToast: ToastData = {
        ...toast,
        id,
        duration: toast.duration ?? defaultDuration,
      }
      setToasts((prev) => [...prev, newToast])
      return id
    },
    [defaultDuration]
  )

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, position }}>
      {children}
      {mounted && <ToastViewport />}
    </ToastContext.Provider>
  )
}

ToastProvider.displayName = 'ToastProvider'

// ToastViewport - container for all toasts
const ToastViewport: React.FC = () => {
  const context = useContext(ToastContext)
  if (!context) return null

  const { toasts, position } = context

  const positionClasses: Record<ToastPosition, string> = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  }

  return createPortal(
    <div
      className={cx(
        'fixed z-50 flex flex-col gap-2 pointer-events-none',
        positionClasses[position]
      )}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>,
    document.body
  )
}

// Individual Toast
interface ToastProps extends ToastData {}

const VARIANT_STYLES: Record<ToastVariant, string> = {
  default: 'bg-charcoal border-ash',
  success: 'bg-charcoal border-success/50',
  error: 'bg-charcoal border-error/50',
  warning: 'bg-charcoal border-warning/50',
  info: 'bg-charcoal border-info/50',
}

const VARIANT_ICONS: Record<ToastVariant, React.ReactNode> = {
  default: null,
  success: <CheckCircle className="h-5 w-5 text-success" />,
  error: <AlertCircle className="h-5 w-5 text-error" />,
  warning: <AlertTriangle className="h-5 w-5 text-warning" />,
  info: <Info className="h-5 w-5 text-info" />,
}

const Toast: React.FC<ToastProps> = ({
  id,
  title,
  description,
  variant = 'default',
  duration,
  action,
}) => {
  const context = useContext(ToastContext)

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        context?.removeToast(id)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [id, duration, context])

  const icon = VARIANT_ICONS[variant]

  return (
    <div
      role="alert"
      className={cx(
        'pointer-events-auto w-80 p-4 border shadow-lg animate-slide-in-right',
        VARIANT_STYLES[variant]
      )}
    >
      <div className="flex gap-3">
        {icon && <div className="shrink-0 mt-0.5">{icon}</div>}
        <div className="flex-1 min-w-0">
          {title && (
            <p className="text-sm font-medium text-white">{title}</p>
          )}
          {description && (
            <p className="text-sm text-silver mt-1">{description}</p>
          )}
          {action && <div className="mt-3">{action}</div>}
        </div>
        <button
          onClick={() => context?.removeToast(id)}
          className="shrink-0 text-silver hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </button>
      </div>
    </div>
  )
}

Toast.displayName = 'Toast'
