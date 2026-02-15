import React from 'react'
import {FileText} from 'lucide-react'
import {Card, type CardProps} from './Card'
import {cx} from '../utils'

export interface PdfCardProps extends Omit<CardProps, 'title'> {
  /**
   * URL of the PDF file
   */
  url: string
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
}

/**
 * A card for displaying PDF documents with an embedded viewer.
 */
export const PdfCard = React.forwardRef<HTMLDivElement, PdfCardProps>(
    (
        {
          url,
          title,
          subtitle,
          height = '400px',
          mediaClassName,
          contentClassName,
          className,
          children,
          ...props
        },
        ref
    ) => {
      return (
          <Card ref={ref} className={cx('p-0 overflow-hidden group w-full', className)} {...props}>
            {/* Media container - PDF Viewer */}
            <div
                className={cx('relative w-full bg-obsidian', mediaClassName)}
                style={{height}}
            >
              <iframe
                  src={`${url}#view=FitH`}
                  title={typeof title === 'string' ? title : 'PDF Document'}
                  className="w-full h-full border-0"
              />
            </div>

            {/* Content section */}
            {(title || subtitle || children) && (
                <div className={cx('px-4 py-4 border-t border-ash', contentClassName)}>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-ash/20 text-gold shrink-0">
                      <FileText size={20}/>
                    </div>
                    <div className="min-w-0 flex-1">
                      {title && (
                          <h4 className="text-sm font-semibold text-white truncate leading-tight">
                            {title}
                          </h4>
                      )}
                      {subtitle && (
                          <p className="text-xs text-silver truncate mt-1 leading-normal">
                            {subtitle}
                          </p>
                      )}
                      {children}
                    </div>
                  </div>
                </div>
            )}
          </Card>
      )
    }
)

PdfCard.displayName = 'PdfCard'
