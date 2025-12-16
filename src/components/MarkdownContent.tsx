import React from 'react'

export interface MarkdownContentProps extends React.HTMLAttributes<HTMLDivElement> {
}

function cx(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export const MarkdownContent = React.forwardRef<HTMLDivElement, MarkdownContentProps>(
    ({children, className, ...rest}, ref) => {
      return (
          <div
              ref={ref}
              className={cx(
                  'prose prose-invert max-w-none',
                  // Headings
                  'prose-headings:font-semibold prose-headings:tracking-tight',
                  'prose-h1:text-gold prose-h1:text-3xl prose-h1:mb-4',
                  'prose-h2:text-gold prose-h2:text-2xl prose-h2:mb-3',
                  'prose-h3:text-white prose-h3:text-xl prose-h3:mb-2',
                  'prose-h4:text-white prose-h4:text-lg prose-h4:mb-2',
                  'prose-h5:text-white prose-h5:text-base prose-h5:mb-2',
                  'prose-h6:text-white prose-h6:text-sm prose-h6:mb-2',
                  // Paragraphs
                  'prose-p:text-silver prose-p:leading-relaxed prose-p:mb-4',
                  // Lists
                  'prose-ul:text-silver prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4',
                  'prose-ol:text-silver prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4',
                  'prose-li:mb-1',
                  // Links
                  'prose-a:text-gold prose-a:no-underline prose-a:hover:text-gold-light prose-a:hover:underline',
                  // Code
                  'prose-code:text-gold-light prose-code:bg-obsidian prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-none prose-code:font-mono prose-code:text-sm',
                  'prose-pre:bg-obsidian prose-pre:border prose-pre:border-ash prose-pre:rounded-none prose-pre:p-4 prose-pre:overflow-x-auto',
                  'prose-code:bg-transparent prose-code:p-0 prose-code:text-silver',
                  // Blockquotes
                  'prose-blockquote:border-l-4 prose-blockquote:border-gold prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-silver',
                  // Strong and emphasis
                  'prose-strong:text-white prose-strong:font-semibold',
                  'prose-em:text-silver prose-em:italic',
                  // HR
                  'prose-hr:border-ash prose-hr:my-6',
                  className
              )}
              {...rest}
          >
            {children}
          </div>
      )
    }
)

MarkdownContent.displayName = 'MarkdownContent'

export default MarkdownContent
