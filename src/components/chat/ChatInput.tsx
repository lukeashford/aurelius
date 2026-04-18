import React, {useCallback, useEffect, useRef, useState} from 'react'
import {cx} from '../../utils'
import {Paperclip, Send, Square, X} from 'lucide-react'
import {type AttachmentItem, AttachmentPreview} from '../AttachmentPreview'
import {createPreviewUrl, generateId, isImageFile} from './types'

export interface ChatInputNotice {
  /**
   * Visual severity: 'warning' shows a dismissible amber notice, 'error' shows a persistent red
   * notice
   */
  variant: 'warning' | 'error'
  /**
   * Content to render — plain text or any React node (e.g. text + button for error state)
   */
  content: React.ReactNode
  /**
   * Whether to show a dismiss (×) button. Defaults to true for warning, ignored for error.
   */
  dismissible?: boolean
  /**
   * Called when the dismiss button is clicked. Consumer controls whether the notice disappears.
   */
  onDismiss?: () => void
}

export type ChatInputPosition = 'centered' | 'bottom'

export type AttachmentStatus = 'pending' | 'uploading' | 'complete' | 'error'

export interface Attachment {
  id: string
  file: File
  previewUrl?: string
  status: AttachmentStatus
  error?: string
  progress?: number
}

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
  onSubmit?: (message: string, attachments?: Attachment[]) => void
  /**
   * Whether the input is disabled (e.g., during streaming)
   */
  disabled?: boolean
  /**
   * Whether to animate the transition between positions
   */
  animate?: boolean
  /**
   * Whether the assistant is currently streaming (shows Stop button)
   */
  isStreaming?: boolean
  /**
   * Called when the Stop button is clicked during streaming
   */
  onStop?: () => void
  /**
   * Current attachments (controlled mode)
   */
  attachments?: Attachment[]
  /**
   * Called when attachments change (controlled mode)
   */
  onAttachmentsChange?: (attachments: Attachment[]) => void
  /**
   * Whether to show the attachment button
   */
  showAttachmentButton?: boolean
  /**
   * Accepted file types for attachments
   */
  acceptedFileTypes?: string
  /**
   * Optional notice displayed above the input (e.g. credit warnings or exhaustion messages)
   */
  notice?: ChatInputNotice
  /**
   * Called whenever the input value changes, giving the consumer access to the current text
   */
  onInputChange?: (value: string) => void
  /**
   * Initial value for the input, used for state restoration (e.g. from DB or localStorage)
   */
  initialInputValue?: string
  /**
   * Whether to automatically focus the input when it becomes enabled
   */
  autoFocus?: boolean
}

/**
 * ChatInput is a context-aware input component that can transition between
 * a centered position (for empty states) and a bottom position (for active conversations).
 *
 * Features:
 * - Auto-expanding textarea
 * - File attachments with preview
 * - Drag and drop support
 * - Streaming state with stop button
 * - Animated transition between positions
 */
export const ChatInput = React.forwardRef<HTMLDivElement, ChatInputProps>(
    (
        {
          position = 'bottom',
          placeholder = 'Send a message...',
          helperText,
          onSubmit,
          disabled = false,
          animate = true,
          isStreaming = false,
          onStop,
          attachments: controlledAttachments,
          onAttachmentsChange,
          showAttachmentButton = true,
          acceptedFileTypes,
          notice,
          onInputChange,
          initialInputValue = '',
          autoFocus = false,
          className,
          ...rest
        },
        ref
    ) => {
      const [value, setValue] = useState(initialInputValue)
      const [localAttachments, setLocalAttachments] = useState<Attachment[]>([])
      const [isDragOver, setIsDragOver] = useState(false)
      const textareaRef = useRef<HTMLTextAreaElement>(null)
      const fileInputRef = useRef<HTMLInputElement>(null)

      // Determine if using controlled or uncontrolled attachments
      const attachments = controlledAttachments ?? localAttachments
      const setAttachments = useCallback(
          (newAttachments: Attachment[] | ((prev: Attachment[]) => Attachment[])) => {
            if (onAttachmentsChange) {
              if (typeof newAttachments === 'function') {
                onAttachmentsChange(newAttachments(attachments))
              } else {
                onAttachmentsChange(newAttachments)
              }
            } else {
              setLocalAttachments(newAttachments)
            }
          },
          [attachments, onAttachmentsChange]
      )

      const handleSubmit = useCallback(() => {
        const trimmed = value.trim()
        if (!trimmed || disabled || isStreaming) {
          return
        }

        onSubmit?.(trimmed, attachments.length > 0 ? attachments : undefined)
        setValue('')
        setAttachments([])

        // Reset textarea height
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto'
        }
      }, [value, disabled, isStreaming, onSubmit, attachments, setAttachments])

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
        onInputChange?.(e.target.value)

        // Auto-resize textarea
        const textarea = e.target
        textarea.style.height = 'auto'
        textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
      }, [onInputChange])

      // Focus input when it becomes enabled
      useEffect(() => {
        if (autoFocus && !disabled && !isStreaming && textareaRef.current) {
          textareaRef.current.focus()
        }
      }, [disabled, isStreaming, autoFocus])

      // File handling
      const addFiles = useCallback(
          (files: FileList | File[]) => {
            const newAttachments: Attachment[] = Array.from(files).map((file) => ({
              id: generateId(),
              file,
              previewUrl: isImageFile(file) ? createPreviewUrl(file) : undefined,
              status: 'pending' as const,
            }))
            setAttachments((prev) => [...prev, ...newAttachments])
          },
          [setAttachments]
      )

      const handleFileSelect = useCallback(
          (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files
            if (files && files.length > 0) {
              addFiles(files)
            }
            // Reset input so the same file can be selected again
            e.target.value = ''
          },
          [addFiles]
      )

      const handleRemoveAttachment = useCallback(
          (id: string) => {
            setAttachments((prev) => {
              const attachment = prev.find((a) => a.id === id)
              if (attachment?.previewUrl) {
                URL.revokeObjectURL(attachment.previewUrl)
              }
              return prev.filter((a) => a.id !== id)
            })
          },
          [setAttachments]
      )

      // Drag and drop handlers
      const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(true)
      }, [])

      const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        // Only set to false if we're leaving the container entirely
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsDragOver(false)
        }
      }, [])

      const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
      }, [])

      const handleDrop = useCallback(
          (e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            setIsDragOver(false)

            const files = e.dataTransfer.files
            if (files && files.length > 0) {
              addFiles(files)
            }
          },
          [addFiles]
      )

      const isCentered = position === 'centered'
      const hasAttachments = attachments.length > 0
      const canSubmit = value.trim() && !disabled && !isStreaming

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

            {/* Notice bar */}
            {notice && (
                <div className={cx(
                    'w-full flex items-start gap-2 px-3 py-2 mb-1 text-xs',
                    isCentered && 'max-w-lg',
                    notice.variant === 'warning'
                        ? 'bg-gold/5 border border-gold/20 text-gold/80'
                        : 'bg-error/10 border border-error/30 text-error'
                )}>
                  <span className="flex-1">{notice.content}</span>
                  {(notice.dismissible ?? notice.variant === 'warning') && notice.onDismiss && (
                      <button
                          type="button"
                          onClick={notice.onDismiss}
                          aria-label="Dismiss"
                          className={cx(
                              'shrink-0 opacity-60 hover:opacity-100 transition-opacity',
                              notice.variant === 'warning' ? 'text-gold' : 'text-error'
                          )}
                      >
                        <X className="w-3 h-3"/>
                      </button>
                  )}
                </div>
            )}

            {/* Input container */}
            <div
                className={cx(
                    'relative w-full bg-charcoal border',
                    isDragOver ? 'border-gold ring-1 ring-gold/30' : 'border-ash/60',
                    'focus-within:border-gold/60 focus-within:ring-1 focus-within:ring-gold/20',
                    'transition-colors duration-200',
                    isCentered && 'max-w-lg'
                )}
                onDragEnter={showAttachmentButton ? handleDragEnter : undefined}
                onDragLeave={showAttachmentButton ? handleDragLeave : undefined}
                onDragOver={showAttachmentButton ? handleDragOver : undefined}
                onDrop={showAttachmentButton ? handleDrop : undefined}
            >
              {/* Attachments preview */}
              {hasAttachments && (
                  <div className="px-3 pt-3 pb-1">
                    <AttachmentPreview
                        attachments={attachments as AttachmentItem[]}
                        onRemove={handleRemoveAttachment}
                        removable={!isStreaming}
                    />
                  </div>
              )}

              {/* Drag overlay */}
              {isDragOver && (
                  <div
                      className="absolute inset-0 bg-gold/10 flex items-center justify-center z-10 pointer-events-none">
                    <span className="text-gold text-sm font-medium">Drop files here</span>
                  </div>
              )}

              {/* Textarea row */}
              <div className="flex items-end">
                {/* Attachment button */}
                {showAttachmentButton && (
                    <>
                      <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={disabled || isStreaming}
                          className={cx(
                              'p-3 text-silver/60 hover:text-silver transition-colors',
                              'disabled:opacity-50 disabled:cursor-not-allowed'
                          )}
                          aria-label="Attach file"
                      >
                        <Paperclip className="w-5 h-5"/>
                      </button>
                      <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept={acceptedFileTypes}
                          onChange={handleFileSelect}
                          className="hidden"
                          aria-hidden="true"
                      />
                    </>
                )}

                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled || isStreaming}
                    rows={1}
                    className={cx(
                        'flex-1 bg-transparent text-white placeholder:text-silver/60',
                        'py-3 pr-12 resize-none outline-none min-h-12',
                        !showAttachmentButton && 'pl-4',
                        (disabled || isStreaming) && 'opacity-50 cursor-not-allowed'
                    )}
                    style={{maxHeight: 200}}
                />

                {/* Submit or Stop button */}
                {isStreaming ? (
                    <button
                        type="button"
                        onClick={onStop}
                        className={cx(
                            'absolute right-2 bottom-2 p-2',
                            'text-error hover:bg-error/10 transition-colors duration-200'
                        )}
                        aria-label="Stop generation"
                    >
                      <Square className="w-5 h-5 fill-current"/>
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className={cx(
                            'absolute right-2 bottom-2 p-2',
                            'transition-colors duration-200',
                            canSubmit
                                ? 'text-gold hover:bg-gold/10'
                                : 'text-silver/40 cursor-not-allowed'
                        )}
                        aria-label="Send message"
                    >
                      <Send className="w-5 h-5"/>
                    </button>
                )}
              </div>
            </div>
          </div>
      )
    }
)

ChatInput.displayName = 'ChatInput'

export default ChatInput
