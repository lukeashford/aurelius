import React, {useEffect, useRef, useState} from 'react'
import {MarkdownContent} from './MarkdownContent'
import {cx} from '../utils/cx'

export type MessageVariant = 'user' | 'assistant'

export interface MessageBranchInfo {
  /**
   * Current branch index (1-based)
   */
  current: number
  /**
   * Total number of sibling branches
   */
  total: number
  /**
   * Navigate to previous branch
   */
  onPrevious?: () => void
  /**
   * Navigate to next branch
   */
  onNext?: () => void
}

export interface MessageActionsConfig {
  /**
   * Called when user edits a user message (creates a branch)
   */
  onEdit?: (newContent: string) => void
  /**
   * Called when user retries an assistant message (creates a branch)
   */
  onRetry?: () => void
  /**
   * Whether to show the copy button
   * @default true
   */
  showCopy?: boolean
}

export interface MessageProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  /**
   * Whether the message is from the user or the assistant
   */
  variant?: MessageVariant
  /**
   * The message content (supports Markdown if string)
   */
  content: string | React.ReactNode
  /**
   * Whether the message is currently being streamed (shows cursor)
   */
  isStreaming?: boolean
  /**
   * Branch navigation info (shows branch indicator if provided and total > 1)
   */
  branchInfo?: MessageBranchInfo
  /**
   * Actions configuration (shows action bar if provided)
   */
  actions?: MessageActionsConfig
  /**
   * Whether to hide actions (e.g., during streaming)
   */
  hideActions?: boolean
}

const variantStyles: Record<MessageVariant, string> = {
  user: 'bg-gold text-obsidian ml-auto',
  assistant: 'bg-charcoal border border-ash text-white mr-auto',
}

// Inline action button component
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
            'hover:bg-white/5',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent',
            className
        )}
        aria-label={label}
    >
      {children}
    </button>
)

// Simple inline icons to avoid importing full icon library
const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
)

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
         className="w-3.5 h-3.5 text-success">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
)

const PencilIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
      <path d="m15 5 4 4"/>
    </svg>
)

const RetryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
      <path d="M21 3v5h-5"/>
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
      <path d="M8 16H3v5"/>
    </svg>
)

const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
      <path d="m15 18-6-6 6-6"/>
    </svg>
)

const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
      <path d="m9 18 6-6-6-6"/>
    </svg>
)

const GitBranchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
         className="w-3 h-3 mr-0.5 text-silver/50">
      <line x1="6" x2="6" y1="3" y2="15"/>
      <circle cx="18" cy="6" r="3"/>
      <circle cx="6" cy="18" r="3"/>
      <path d="M18 9a9 9 0 0 1-9 9"/>
    </svg>
)

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M18 6 6 18"/>
      <path d="m6 6 12 12"/>
    </svg>
)

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="m22 2-7 20-4-9-9-4Z"/>
      <path d="M22 2 11 13"/>
    </svg>
)

export const Message = React.forwardRef<HTMLDivElement, MessageProps>(
    ({
      variant = 'assistant',
      className,
      content,
      isStreaming,
      branchInfo,
      actions,
      hideActions,
      ...rest
    }, ref) => {
      const isUser = variant === 'user'
      const [copied, setCopied] = useState(false)
      const [isEditing, setIsEditing] = useState(false)
      const [editValue, setEditValue] = useState(typeof content === 'string' ? content : '')
      const textareaRef = useRef<HTMLTextAreaElement>(null)

      const showBranchNav = branchInfo && branchInfo.total > 1
      const showActions = actions && !hideActions && !isStreaming

      // Auto-resize textarea when editing
      useEffect(() => {
        if (isEditing && textareaRef.current) {
          const textarea = textareaRef.current
          textarea.style.height = 'auto'
          textarea.style.height = `${textarea.scrollHeight}px`
          textarea.focus()
          // Move cursor to end
          textarea.setSelectionRange(textarea.value.length, textarea.value.length)
        }
      }, [isEditing])

      const handleCopy = async () => {
        if (typeof content !== 'string') {
          return
        }

        try {
          await navigator.clipboard.writeText(content)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch {
          // Fallback
          const textArea = document.createElement('textarea')
          textArea.value = content
          document.body.appendChild(textArea)
          textArea.select()
          document.execCommand('copy')
          document.body.removeChild(textArea)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }
      }

      const handleStartEdit = () => {
        if (typeof content === 'string') {
          setEditValue(content)
          setIsEditing(true)
        }
      }

      const handleCancelEdit = () => {
        setIsEditing(false)
        if (typeof content === 'string') {
          setEditValue(content)
        }
      }

      const handleSubmitEdit = () => {
        const trimmed = editValue.trim()
        if (typeof content === 'string' && trimmed && trimmed !== content) {
          actions?.onEdit?.(trimmed)
        }
        setIsEditing(false)
      }

      const handleEditKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault()
          handleSubmitEdit()
        } else if (e.key === 'Escape') {
          handleCancelEdit()
        }
      }

      const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditValue(e.target.value)
        // Auto-resize
        const textarea = e.target
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
      }

      return (
          <div
              ref={ref}
              className={cx(
                  'flex flex-col',
                  isUser ? 'items-end' : 'items-start',
                  className
              )}
              {...rest}
          >
            {/* Message bubble OR Edit input (replaces message when editing) */}
            {isUser && isEditing ? (
                <div className="w-full max-w-11/12">
                  <div className="relative bg-gold">
              <textarea
                  ref={textareaRef}
                  value={editValue}
                  onChange={handleEditChange}
                  onKeyDown={handleEditKeyDown}
                  className="w-full bg-transparent text-obsidian px-3 py-2 pr-20 resize-none outline-none min-h-10 text-sm"
                  rows={1}
              />
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-0.5">
                      <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="p-1.5 text-obsidian/60 hover:text-obsidian transition-colors"
                          aria-label="Cancel edit"
                      >
                        <XIcon/>
                      </button>
                      <button
                          type="button"
                          onClick={handleSubmitEdit}
                          disabled={!editValue.trim() || editValue.trim() === content}
                          className="p-1.5 text-obsidian/60 hover:text-obsidian transition-colors disabled:opacity-30"
                          aria-label="Submit edit"
                      >
                        <SendIcon/>
                      </button>
                    </div>
                  </div>
                </div>
            ) : (
                <div
                    className={cx(
                        'px-3 py-2 w-fit max-w-11/12',
                        variantStyles[variant]
                    )}
                >
                  {typeof content === 'string' ? (
                      <MarkdownContent
                          content={content}
                          className={cx('prose-sm', isUser ? 'prose-inherit' : 'prose-invert')}
                          isStreaming={isStreaming}
                          cursorClassName="ml-0.5"
                      />
                  ) : content}
                </div>
            )}

            {/* Action bar - below the message, includes branch nav on the right */}
            {showActions && !isEditing && (
                <div className={cx(
                    'flex items-center gap-0.5 mt-1',
                    isUser ? 'mr-1' : 'ml-1'
                )}>
                  {/* Copy - available for both */}
                  {(actions.showCopy !== false) && (
                      <ActionButton onClick={handleCopy}
                                    label={copied ? 'Copied!' : 'Copy message'}>
                        {copied ? <CheckIcon/> : <CopyIcon/>}
                      </ActionButton>
                  )}

                  {/* Edit - only for user messages */}
                  {isUser && actions.onEdit && typeof content === 'string' && (
                      <ActionButton onClick={handleStartEdit} label="Edit message">
                        <PencilIcon/>
                      </ActionButton>
                  )}

                  {/* Retry - only for assistant messages */}
                  {!isUser && actions.onRetry && (
                      <ActionButton onClick={actions.onRetry} label="Regenerate response">
                        <RetryIcon/>
                      </ActionButton>
                  )}

                  {/* Branch navigator - to the right of action buttons */}
                  {showBranchNav && (
                      <>
                        <div className="w-px h-4 bg-ash/40 mx-1"/>
                        <div className="flex items-center gap-0.5 text-silver/70">
                          <GitBranchIcon/>
                          <button
                              type="button"
                              onClick={branchInfo.onPrevious}
                              disabled={branchInfo.current <= 1}
                              className={cx(
                                  'p-0.5 hover:text-white hover:bg-white/10 transition-colors',
                                  'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-silver/70'
                              )}
                              aria-label="Previous branch"
                          >
                            <ChevronLeftIcon/>
                          </button>
                          <span className="text-xs tabular-nums min-w-6 text-center">
                    {branchInfo.current}/{branchInfo.total}
                  </span>
                          <button
                              type="button"
                              onClick={branchInfo.onNext}
                              disabled={branchInfo.current >= branchInfo.total}
                              className={cx(
                                  'p-0.5 hover:text-white hover:bg-white/10 transition-colors',
                                  'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-silver/70'
                              )}
                              aria-label="Next branch"
                          >
                            <ChevronRightIcon/>
                          </button>
                        </div>
                      </>
                  )}
                </div>
            )}
          </div>
      )
    }
)

Message.displayName = 'Message'

export default Message
