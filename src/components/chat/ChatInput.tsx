import React, {useState, useCallback, useRef, useEffect} from 'react'
import {cx} from '../../utils/cx'

export type ChatInputPosition = 'centered' | 'bottom'

export interface ChatInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
  /**
   * Position of the input: 'centered' for empty state, 'bottom' for conversation mode
   */
  position?: ChatInputPosition
  /**
   * Placeholder text for the input
   */
  placeholder?: string
  /**
   * Helper text shown above the input in centered mode
   */
  helperText?: React.ReactNode
  /**
   * Called when the user submits a message
   */
  onSubmit?: (message: string) => void
  /**
   * Whether the input is disabled (e.g., during streaming)
   */
  disabled?: boolean
  /**
   * Whether to animate the transition between positions
   */
  animate?: boolean
}

export const ChatInput = React.forwardRef<HTMLDivElement, ChatInputProps>(
  (
    {
      position = 'bottom',
      placeholder = 'Send a message...',
      helperText,
      onSubmit,
      disabled = false,
      animate = true,
      className,
      ...rest
    },
    ref
  ) => {
    const [value, setValue] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleSubmit = useCallback(() => {
      const trimmed = value.trim()
      if (!trimmed || disabled) return

      onSubmit?.(trimmed)
      setValue('')

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }, [value, disabled, onSubmit])

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault()
          handleSubmit()
        }
      },
      [handleSubmit]
    )

    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value)

      // Auto-resize textarea
      const textarea = e.target
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }, [])

    // Focus input when it becomes enabled
    useEffect(() => {
      if (!disabled && textareaRef.current) {
        textareaRef.current.focus()
      }
    }, [disabled])

    const isCentered = position === 'centered'

    return (
      <div
        ref={ref}
        className={cx(
          'w-full',
          isCentered && 'flex flex-col items-center justify-center',
          animate && 'transition-all duration-300 ease-out',
          className
        )}
        {...rest}
      >
        {/* Helper text for centered mode */}
        {isCentered && helperText && (
          <p className="text-silver text-sm mb-4 text-center">{helperText}</p>
        )}

        {/* Input container */}
        <div
          className={cx(
            'relative w-full bg-charcoal border border-ash/60 rounded-lg',
            'focus-within:border-gold/60 focus-within:ring-1 focus-within:ring-gold/20',
            'transition-colors duration-200',
            isCentered && 'max-w-2xl'
          )}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={cx(
              'w-full bg-transparent text-white placeholder:text-silver/60',
              'px-4 py-3 pr-12 resize-none outline-none min-h-12',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            style={{maxHeight: 200}}
          />

          {/* Submit button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!value.trim() || disabled}
            className={cx(
              'absolute right-2 bottom-2 p-2 rounded-md',
              'transition-colors duration-200',
              value.trim() && !disabled
                ? 'text-gold hover:bg-gold/10'
                : 'text-silver/40 cursor-not-allowed'
            )}
            aria-label="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
      </div>
    )
  }
)

ChatInput.displayName = 'ChatInput'

export default ChatInput
