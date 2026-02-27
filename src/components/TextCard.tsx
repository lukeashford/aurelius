import React from 'react'
import {Card, type CardProps, type CardSlotLoading} from './Card'
import {MarkdownContent} from './MarkdownContent'
import {cx} from '../utils'

export interface TextCardProps extends Omit<CardProps, 'title'> {
  /**
   * Text content to display (Markdown, HTML, or plain text)
   */
  content: string
  /**
   * Optional title for the card
   */
  title?: React.ReactNode
  /**
   * Optional subtitle or metadata
   */
  subtitle?: React.ReactNode
  /**
   * Whether the content should be treated as Markdown
   * @default true
   */
  isMarkdown?: boolean
  /**
   * Maximum height of the content area before scrolling
   * @default '16rem'
   */
  maxHeight?: string | number
  /**
   * Optional class name for the content container
   */
  contentClassName?: string
  loading?: CardSlotLoading
}

/**
 * A card for displaying text content, supporting Markdown and HTML formatting.
 */
export const TextCard = React.forwardRef<HTMLDivElement, TextCardProps>(
    (
        {
          content,
          title,
          subtitle,
          isMarkdown = true,
          maxHeight = '16rem',
          contentClassName,
          className,
          loading,
          ...props
        },
        ref
    ) => {
      return (
          <Card
              ref={ref}
              className={cx('p-0 overflow-hidden w-full', className)}
              loading={loading}
              {...props}
          >
            <Card.Header
                title={title}
                subtitle={subtitle}
            />
            <Card.Body
                className={cx('overflow-y-auto', contentClassName)}
                style={{maxHeight}}
            >
              <MarkdownContent
                  content={content}
                  isMarkdown={isMarkdown}
                  className="prose-sm prose-invert max-w-none"
              />
            </Card.Body>
          </Card>
      )
    }
)

TextCard.displayName = 'TextCard'

export default TextCard
