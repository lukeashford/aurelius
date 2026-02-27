import React from 'react'
import {FileText} from 'lucide-react'
import {Card, type CardProps, type CardSlotLoading} from './Card'
import {cx} from '../utils'

export interface PdfCardProps extends Omit<CardProps, 'title'> {
  /**
   * URL of the PDF file
   */
  src?: string
  /**
   * Title of the document
   */
  title?: React.ReactNode
  /**
   * Subtitle or document metadata
   */
  subtitle?: React.ReactNode
  /**
   * Height of the PDF viewer
   */
  height?: string | number
  /**
   * Optional class name for the media container
   */
  mediaClassName?: string
  /**
   * Optional class name for the content container
   */
  contentClassName?: string
  loading?: CardSlotLoading
}

/**
 * A card for displaying PDF documents with an embedded viewer.
 */
export const PdfCard = React.forwardRef<HTMLDivElement, PdfCardProps>(
    (
        {
          src,
          title,
          subtitle,
          height = '400px',
          mediaClassName,
          contentClassName,
          className,
          children,
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
            <Card.Media
                className={cx('bg-obsidian', mediaClassName)}
                style={{height}}
            >
              {src && (
                  <iframe
                      src={`${src}#view=FitH`}
                      title={typeof title === 'string' ? title : 'PDF Document'}
                      className="w-full h-full border-0"
                  />
              )}
            </Card.Media>
            <Card.Header
                title={title}
                subtitle={subtitle}
                className={contentClassName}
                action={
                  <div className="p-2 bg-ash/20 text-gold shrink-0">
                    <FileText size={20}/>
                  </div>
                }
            />
            {children && <Card.Body className={contentClassName}>{children}</Card.Body>}
          </Card>
      )
    }
)

PdfCard.displayName = 'PdfCard'
