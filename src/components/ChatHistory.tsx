import React from 'react'
import { Message, type MessageProps, type MessageVariant } from './Message'
import { cx } from '../utils/cx'

export interface ChatHistoryItem extends Omit<MessageProps, 'variant' | 'children'> {
  id?: string
  variant?: MessageVariant
}

export interface ChatHistoryProps extends React.HTMLAttributes<HTMLDivElement> {
  messages: ChatHistoryItem[]
}

export const ChatHistory = React.forwardRef<HTMLDivElement, ChatHistoryProps>(
    ({messages, className, ...rest}, ref) => {
      return (
          <div
              ref={ref}
              className={cx('flex flex-col gap-3 w-full', className)}
              {...rest}
          >
            {messages.map(({id, variant, className: messageClassName, ...messageProps}, index) => (
                <Message
                    key={id ?? index}
                    variant={variant}
                    className={messageClassName}
                    {...messageProps}
                />
            ))}
          </div>
      )
    }
)

ChatHistory.displayName = 'ChatHistory'

export default ChatHistory