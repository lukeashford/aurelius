import React, { useCallback } from 'react'
import { Modal, type ModalProps } from './Modal'
import { Button } from './Button'
import { cx } from '../utils/cx'

// ConfirmDialog - for confirmation actions
export interface ConfirmDialogProps extends Omit<ModalProps, 'children'> {
  /** Description text */
  description?: React.ReactNode
  /** Text for the confirm button */
  confirmText?: string
  /** Text for the cancel button */
  cancelText?: string
  /** Callback when confirmed */
  onConfirm: () => void | Promise<void>
  /** Callback when cancelled */
  onCancel?: () => void
  /** Variant of the confirm button */
  confirmVariant?: 'primary' | 'important' | 'danger'
  /** Whether the confirm action is loading */
  isLoading?: boolean
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title = 'Confirm',
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  onClose,
  confirmVariant = 'important',
  isLoading = false,
  ...props
}) => {
  const handleCancel = useCallback(() => {
    onCancel?.()
    onClose()
  }, [onCancel, onClose])

  const handleConfirm = useCallback(async () => {
    await onConfirm()
    onClose()
  }, [onConfirm, onClose])

  return (
    <Modal title={title} onClose={onClose} {...props}>
      {description && (
        <p className="text-sm text-silver mb-6">{description}</p>
      )}
      <div className="flex justify-end gap-3">
        <Button variant="outlined" onClick={handleCancel} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          variant={confirmVariant}
          onClick={handleConfirm}
          loading={isLoading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  )
}

ConfirmDialog.displayName = 'ConfirmDialog'

// AlertDialog - for important alerts
export interface AlertDialogProps extends Omit<ModalProps, 'children'> {
  /** Description text */
  description?: React.ReactNode
  /** Text for the acknowledge button */
  acknowledgeText?: string
  /** Variant based on alert type */
  variant?: 'default' | 'warning' | 'error'
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  title = 'Alert',
  description,
  acknowledgeText = 'OK',
  variant = 'default',
  onClose,
  ...props
}) => {
  const titleClass = cx(
    variant === 'warning' && 'text-warning',
    variant === 'error' && 'text-error'
  )

  return (
    <Modal onClose={onClose} {...props}>
      <h3 className={cx('text-xl font-semibold mb-2', titleClass)}>{title}</h3>
      {description && (
        <p className="text-sm text-silver mb-6">{description}</p>
      )}
      <div className="flex justify-end">
        <Button variant="primary" onClick={onClose}>
          {acknowledgeText}
        </Button>
      </div>
    </Modal>
  )
}

AlertDialog.displayName = 'AlertDialog'

// PromptDialog - for user input
export interface PromptDialogProps extends Omit<ModalProps, 'children'> {
  /** Description text */
  description?: React.ReactNode
  /** Placeholder for the input */
  placeholder?: string
  /** Default value for the input */
  defaultValue?: string
  /** Text for the submit button */
  submitText?: string
  /** Text for the cancel button */
  cancelText?: string
  /** Callback with the input value when submitted */
  onSubmit: (value: string) => void | Promise<void>
  /** Callback when cancelled */
  onCancel?: () => void
  /** Whether the submit action is loading */
  isLoading?: boolean
}

export const PromptDialog: React.FC<PromptDialogProps> = ({
  title = 'Enter Value',
  description,
  placeholder,
  defaultValue = '',
  submitText = 'Submit',
  cancelText = 'Cancel',
  onSubmit,
  onCancel,
  onClose,
  isLoading = false,
  ...props
}) => {
  const [value, setValue] = React.useState(defaultValue)

  const handleCancel = useCallback(() => {
    onCancel?.()
    onClose()
  }, [onCancel, onClose])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      await onSubmit(value)
      onClose()
    },
    [onSubmit, value, onClose]
  )

  return (
    <Modal title={title} onClose={onClose} {...props}>
      <form onSubmit={handleSubmit}>
        {description && (
          <p className="text-sm text-silver mb-4">{description}</p>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className={cx(
            'w-full px-3 py-2 bg-graphite border border-ash',
            'text-white placeholder:text-zinc',
            'focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none',
            'mb-6'
          )}
          autoFocus
        />
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outlined"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button type="submit" variant="important" loading={isLoading}>
            {submitText}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

PromptDialog.displayName = 'PromptDialog'
