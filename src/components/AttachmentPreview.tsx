import React from 'react'
import {cx} from '../utils/cx'
import {FileChip, type FileChipStatus} from './FileChip'

export interface AttachmentItem {
  /**
   * Unique identifier
   */
  id: string
  /**
   * The File object
   */
  file: File
  /**
   * Blob URL for image previews
   */
  previewUrl?: string
  /**
   * Current status
   */
  status: FileChipStatus
  /**
   * Error message if status is 'error'
   */
  error?: string
}

export interface AttachmentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Array of attachments to display
   */
  attachments: AttachmentItem[]
  /**
   * Called when an attachment should be removed
   */
  onRemove?: (id: string) => void
  /**
   * Whether attachments are removable
   */
  removable?: boolean
  /**
   * Maximum number of attachments to show before collapsing
   * Set to 0 or undefined to show all
   */
  maxVisible?: number
}

export const AttachmentPreview = React.forwardRef<HTMLDivElement, AttachmentPreviewProps>(
    (
        {
          attachments,
          onRemove,
          removable = true,
          maxVisible,
          className,
          ...rest
        },
        ref
    ) => {
      if (attachments.length === 0) {
        return null
      }

      const visibleAttachments = maxVisible && maxVisible > 0
          ? attachments.slice(0, maxVisible)
          : attachments

      const hiddenCount = maxVisible && maxVisible > 0
          ? Math.max(0, attachments.length - maxVisible)
          : 0

      return (
          <div
              ref={ref}
              className={cx('flex flex-wrap gap-2', className)}
              role="list"
              aria-label="Attached files"
              {...rest}
          >
            {visibleAttachments.map((attachment) => (
                <FileChip
                    key={attachment.id}
                    name={attachment.file.name}
                    size={attachment.file.size}
                    type={attachment.file.type}
                    status={attachment.status}
                    previewUrl={attachment.previewUrl}
                    error={attachment.error}
                    removable={removable}
                    onRemove={onRemove ? () => onRemove(attachment.id) : undefined}
                />
            ))}
            {hiddenCount > 0 && (
                <div
                    className="inline-flex items-center px-2 py-1.5 bg-charcoal border border-silver/30 text-sm text-silver">
                  +{hiddenCount} more
                </div>
            )}
          </div>
      )
    }
)

AttachmentPreview.displayName = 'AttachmentPreview'

export default AttachmentPreview
