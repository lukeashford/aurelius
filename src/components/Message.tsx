import React from 'react'
import { MarkdownContent } from './MarkdownContent'
import { StreamingCursor } from './StreamingCursor'
import { cx } from '../utils/cx'

export type MessageVariant = 'user' | 'assistant'

export interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: MessageVariant
  content: string
  isStreaming?: boolean
}

const variantStyles: Record<MessageVariant, string> = {
  user: 'bg-gold text-obsidian ml-auto',
  assistant: 'bg-charcoal border border-ash text-white mr-auto',
}

export const Message = React.forwardRef<HTMLDivElement, MessageProps>(
    ({variant = 'assistant', className, content, isStreaming, ...rest},
        ref) => {
      const isUser = variant === 'user'

      return (
          <div
              ref={ref}
              className={cx(
                  'px-3 py-2 w-fit',
                  variantStyles[variant],
                  className
              )}
              {...rest}
          >
            <MarkdownContent
                content={content}
                className={cx('prose-sm', isUser ? 'prose-inherit' : 'prose-invert')}
            />
            {isStreaming && <StreamingCursor className="ml-0.5"/>}
          </div>
      )
    }
)

Message.displayName = 'Message'

export default Message