import React, {useEffect, useRef} from 'react'
import {Message, type MessageProps, type MessageVariant} from './Message'
import {cx} from '../utils/cx'

export interface ChatHistoryItem extends Omit<MessageProps, 'variant' | 'children'> {
  id?: string
  variant?: MessageVariant
}

export interface ChatHistoryProps extends React.HTMLAttributes<HTMLDivElement> {
  messages: ChatHistoryItem[]
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({messages, className, ...rest}) => {
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = innerRef.current
    if (!el) {
      return
    }

    if (typeof el.scrollTo === 'function') {
      el.scrollTo({top: el.scrollHeight, behavior: 'smooth'})
    } else {
      el.scrollTop = el.scrollHeight
    }
  }, [messages])

  return (
      <div
          ref={innerRef}
          className={cx(
              'flex flex-col gap-3 justify-end w-full h-96 bg-charcoal/50 border border-ash/40 p-4 overflow-y-auto',
              className
          )}
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

ChatHistory.displayName = 'ChatHistory'

export default ChatHistory