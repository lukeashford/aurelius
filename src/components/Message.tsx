import React from 'react'

export type MessageVariant = 'user' | 'sent' | 'assistant' | 'received'

export interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: MessageVariant
}

function cx(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export const Message = React.forwardRef<HTMLDivElement, MessageProps>(
    ({variant = 'assistant', children, className, ...rest}, ref) => {
      const isUser = variant === 'user' || variant === 'sent'

      const variantClasses = isUser
          ? 'bg-gold text-obsidian'
          : 'bg-charcoal border border-ash text-white'

      return (
          <div
              ref={ref}
              className={cx(
                  'rounded-none px-4 py-3 max-w-4xl',
                  variantClasses,
                  isUser ? 'ml-auto' : 'mr-auto',
                  className
              )}
              {...rest}
          >
            {children}
          </div>
      )
    }
)

Message.displayName = 'Message'

export default Message
