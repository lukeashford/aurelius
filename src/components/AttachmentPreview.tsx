import React from 'react'
import {cx} from '../utils'
import {FileChip, type FileChipStatus} from './FileChip'

export interface AttachmentItem {
  /**
   * Unique identifier
   */
  id: string
  /**
   * The file's name, size and MIME type. A real `File` object satisfies this
   * shape — compose-box callers pass File instances directly. Above-message
   * (post-send) rendering supplies a synthetic record built from persisted
   * attachment metadata.
   */
  file: Pick<File, 'name' | 'size' | 'type'>
  /**
   * Blob URL for image previews
   */
  previewUrl?: string
  /**
   * Current status
   */
  status: FileChipStatus
  /**
   * Error message if status is an error variant
   */
  error?: string
  /**
   * Backend artifact id, set once the upload has been integrated. Required to
   * make the chip clickable to open the artifact card modal.
   */
  artifactId?: string
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
  /**
   * Click handler for chips with an artifactId. When set, chips that carry an
   * artifactId become clickable and forward the id to this handler.
   */
  onOpen?: (artifactId: string) => void
}

export const AttachmentPreview = React.forwardRef<HTMLDivElement, AttachmentPreviewProps>(
    (
        {
          attachments,
          onRemove,
          removable = true,
          maxVisible,
          onOpen,
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
                    artifactId={attachment.artifactId}
                    onOpen={onOpen}
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
