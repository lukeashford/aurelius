import React from 'react'

export interface StreamingCursorProps extends React.HTMLAttributes<HTMLSpanElement> {
}

function cx(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export const StreamingCursor = React.forwardRef<HTMLSpanElement, StreamingCursorProps>(
    ({className, ...rest}, ref) => {
      return (
          <span
              ref={ref}
              className={cx(
                  'inline-block w-1.5 h-4 bg-gold animate-pulse',
                  className
              )}
              aria-hidden
              {...rest}
          />
      )
    }
)

StreamingCursor.displayName = 'StreamingCursor'

export default StreamingCursor
