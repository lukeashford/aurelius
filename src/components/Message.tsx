import React, {useCallback, useEffect, useRef, useState} from 'react'
import {Check, ChevronLeft, ChevronRight, Copy, GitBranch, Pencil, RotateCcw, Send, X} from 'lucide-react'
import {MarkdownContent} from './MarkdownContent'
import {cx, useCopyToClipboard} from '../utils'

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

const VARIANT_STYLES: Record<MessageVariant, string> = {
  user: 'bg-gold text-obsidian ml-auto',
  assistant: 'bg-charcoal border border-ash text-white mr-auto',
}

const ACTION_BUTTON_CLASSES = cx(
    'p-1.5 text-silver/60 hover:text-silver transition-colors duration-150',
    'hover:bg-white/5',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent',
)

const BRANCH_BUTTON_CLASSES = cx(
    'p-0.5 hover:text-white hover:bg-white/10 transition-colors',
    'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-silver/70',
)

interface ActionButtonProps {
  onClick: () => void
  label: string
  children: React.ReactNode
  disabled?: boolean
}

function ActionButton({onClick, label, children, disabled}: ActionButtonProps) {
  return (
      <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={ACTION_BUTTON_CLASSES}
          aria-label={label}
      >
        {children}
      </button>
  )
}

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
      const {copied, copy} = useCopyToClipboard()
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
          textarea.setSelectionRange(textarea.value.length, textarea.value.length)
        }
      }, [isEditing])

      const handleCopy = useCallback(() => {
        if (typeof content === 'string') {
          void copy(content)
        }
      }, [copy, content])

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
                        <X className="w-4 h-4"/>
                      </button>
                      <button
                          type="button"
                          onClick={handleSubmitEdit}
                          disabled={!editValue.trim() || editValue.trim() === content}
                          className="p-1.5 text-obsidian/60 hover:text-obsidian transition-colors disabled:opacity-30"
                          aria-label="Submit edit"
                      >
                        <Send className="w-4 h-4"/>
                      </button>
                    </div>
                  </div>
                </div>
            ) : (
                <div
                    className={cx(
                        'px-3 py-2 w-fit max-w-11/12',
                        VARIANT_STYLES[variant]
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
                        {copied
                            ? <Check className="w-3.5 h-3.5 text-success"/>
                            : <Copy className="w-3.5 h-3.5"/>}
                      </ActionButton>
                  )}

                  {/* Edit - only for user messages */}
                  {isUser && actions.onEdit && typeof content === 'string' && (
                      <ActionButton onClick={handleStartEdit} label="Edit message">
                        <Pencil className="w-3.5 h-3.5"/>
                      </ActionButton>
                  )}

                  {/* Retry - only for assistant messages */}
                  {!isUser && actions.onRetry && (
                      <ActionButton onClick={actions.onRetry} label="Regenerate response">
                        <RotateCcw className="w-3.5 h-3.5"/>
                      </ActionButton>
                  )}

                  {/* Branch navigator - to the right of action buttons */}
                  {showBranchNav && (
                      <>
                        <div className="w-px h-4 bg-ash/40 mx-1"/>
                        <div className="flex items-center gap-0.5 text-silver/70">
                          <GitBranch className="w-3 h-3 mr-0.5 text-silver/50"/>
                          <button
                              type="button"
                              onClick={branchInfo.onPrevious}
                              disabled={branchInfo.current <= 1}
                              className={BRANCH_BUTTON_CLASSES}
                              aria-label="Previous branch"
                          >
                            <ChevronLeft className="w-3 h-3"/>
                          </button>
                          <span className="text-xs tabular-nums min-w-6 text-center">
                    {branchInfo.current}/{branchInfo.total}
                  </span>
                          <button
                              type="button"
                              onClick={branchInfo.onNext}
                              disabled={branchInfo.current >= branchInfo.total}
                              className={BRANCH_BUTTON_CLASSES}
                              aria-label="Next branch"
                          >
                            <ChevronRight className="w-3 h-3"/>
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
