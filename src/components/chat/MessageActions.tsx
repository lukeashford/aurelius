import React, {useCallback, useState} from 'react'
import {cx, useCopyToClipboard} from '../../utils'
import {Check, Copy, Pencil, RotateCcw, Send, X,} from 'lucide-react'
import type {MessageVariant} from '../Message'

/**
 * @deprecated Use MessageVariant. Kept as an alias for backwards compatibility.
 */
export type MessageActionsVariant = MessageVariant

export interface MessageActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether this is for a user or assistant message
   */
  variant: MessageVariant
  /**
   * The message content for copy functionality
   */
  content: string
  /**
   * Called when user wants to edit their message
   * Consumer should handle creating a branch with the edited content
   */
  onEdit?: (newContent: string) => void
  /**
   * Called when user wants to retry/regenerate the assistant response
   * Consumer should handle creating a branch with a new response
   */
  onRetry?: () => void
  /**
   * Whether the message is currently being edited
   */
  isEditing?: boolean
  /**
   * Callback to set editing state (controlled from parent)
   */
  onEditingChange?: (isEditing: boolean) => void
  /**
   * Initial content for the edit input (defaults to content prop)
   */
  editValue?: string
}

const ActionButton: React.FC<{
  onClick: () => void
  label: string
  children: React.ReactNode
  className?: string
  disabled?: boolean
}> = ({onClick, label, children, className, disabled}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cx(
            'p-1.5 text-silver/60 hover:text-silver transition-colors duration-150',
            'hover:bg-white/5 ',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent',
            className
        )}
        aria-label={label}
    >
      {children}
    </button>
)

export const MessageActions = React.forwardRef<HTMLDivElement, MessageActionsProps>(
    (
        {
          variant,
          content,
          onEdit,
          onRetry,
          isEditing: controlledIsEditing,
          onEditingChange,
          editValue: controlledEditValue,
          className,
          ...rest
        },
        ref
    ) => {
      // Local state for uncontrolled mode
      const [localIsEditing, setLocalIsEditing] = useState(false)
      const [localEditValue, setLocalEditValue] = useState(content)
      const {copied, copy} = useCopyToClipboard()

      // Determine if controlled or uncontrolled
      const isEditing = controlledIsEditing ?? localIsEditing
      const editValue = controlledEditValue ?? localEditValue

      const setIsEditing = useCallback(
          (value: boolean) => {
            if (onEditingChange) {
              onEditingChange(value)
            } else {
              setLocalIsEditing(value)
            }
          },
          [onEditingChange]
      )

      const setEditValue = useCallback((value: string) => {
        setLocalEditValue(value)
      }, [])

      const handleCopy = useCallback(() => {
        void copy(content)
      }, [copy, content])

      const handleStartEdit = useCallback(() => {
        setLocalEditValue(content)
        setIsEditing(true)
      }, [content, setIsEditing])

      const handleCancelEdit = useCallback(() => {
        setIsEditing(false)
        setLocalEditValue(content)
      }, [content, setIsEditing])

      const handleSubmitEdit = useCallback(() => {
        const trimmed = editValue.trim()
        if (trimmed && trimmed !== content) {
          onEdit?.(trimmed)
        }
        setIsEditing(false)
      }, [editValue, content, onEdit, setIsEditing])

      const handleEditKeyDown = useCallback(
          (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmitEdit()
            } else if (e.key === 'Escape') {
              handleCancelEdit()
            }
          },
          [handleSubmitEdit, handleCancelEdit]
      )

      const isUser = variant === 'user'

      // Render edit mode inline
      if (isUser && isEditing) {
        return (
            <div
                ref={ref}
                className={cx('mt-2', className)}
                {...rest}
            >
              <div
                  className="relative bg-charcoal border border-ash/60 focus-within:border-gold/60 focus-within:ring-1 focus-within:ring-gold/20">
            <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleEditKeyDown}
                className="w-full bg-transparent text-white px-3 py-2 pr-20 resize-none outline-none min-h-16 text-sm"
                autoFocus
                rows={2}
            />
                <div className="absolute right-2 bottom-2 flex gap-1">
                  <ActionButton
                      onClick={handleCancelEdit}
                      label="Cancel edit"
                      className="text-silver/60 hover:text-error"
                  >
                    <X className="w-4 h-4"/>
                  </ActionButton>
                  <ActionButton
                      onClick={handleSubmitEdit}
                      label="Submit edit"
                      className="text-silver/60 hover:text-gold"
                      disabled={!editValue.trim() || editValue.trim() === content}
                  >
                    <Send className="w-4 h-4"/>
                  </ActionButton>
                </div>
              </div>
              <p className="text-xs text-silver/50 mt-1">
                Press Enter to submit, Esc to cancel. This will create a new branch.
              </p>
            </div>
        )
      }

      return (
          <div
              ref={ref}
              className={cx(
                  'flex items-center gap-0.5 mt-1',
                  isUser ? 'justify-end' : 'justify-start',
                  className
              )}
              {...rest}
          >
            {/* Copy - available for both user and assistant */}
            <ActionButton onClick={handleCopy} label={copied ? 'Copied!' : 'Copy message'}>
              {copied ? (
                  <Check className="w-3.5 h-3.5 text-success"/>
              ) : (
                  <Copy className="w-3.5 h-3.5"/>
              )}
            </ActionButton>

            {/* Edit - only for user messages */}
            {isUser && onEdit && (
                <ActionButton onClick={handleStartEdit} label="Edit message">
                  <Pencil className="w-3.5 h-3.5"/>
                </ActionButton>
            )}

            {/* Retry - only for assistant messages */}
            {!isUser && onRetry && (
                <ActionButton onClick={onRetry} label="Regenerate response">
                  <RotateCcw className="w-3.5 h-3.5"/>
                </ActionButton>
            )}
          </div>
      )
    }
)

MessageActions.displayName = 'MessageActions'

export default MessageActions
