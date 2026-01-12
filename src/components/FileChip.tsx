import React from 'react'
import {cx} from '../utils/cx'
import {File, FileImage, FileVideo, FileAudio, FileText, FileCode, FileArchive, X, Loader2} from 'lucide-react'

export type FileChipStatus = 'pending' | 'uploading' | 'complete' | 'error'

export interface FileChipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * File name to display
   */
  name: string
  /**
   * File size in bytes (optional, will be formatted)
   */
  size?: number
  /**
   * MIME type for icon selection
   */
  type?: string
  /**
   * Upload/processing status
   */
  status?: FileChipStatus
  /**
   * Preview image URL (for images)
   */
  previewUrl?: string
  /**
   * Called when the remove button is clicked
   */
  onRemove?: () => void
  /**
   * Whether the chip is removable
   */
  removable?: boolean
  /**
   * Error message to display (when status is 'error')
   */
  error?: string
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Get icon component based on MIME type
 */
function getFileIcon(type?: string) {
  if (!type) return File

  if (type.startsWith('image/')) return FileImage
  if (type.startsWith('video/')) return FileVideo
  if (type.startsWith('audio/')) return FileAudio
  if (type.startsWith('text/')) return FileText
  if (type.includes('javascript') || type.includes('typescript') || type.includes('json') || type.includes('xml')) {
    return FileCode
  }
  if (type.includes('zip') || type.includes('rar') || type.includes('tar') || type.includes('gz')) {
    return FileArchive
  }

  return File
}

const statusStyles: Record<FileChipStatus, string> = {
  pending: 'border-silver/30',
  uploading: 'border-gold/50',
  complete: 'border-success/50',
  error: 'border-error/50',
}

export const FileChip = React.forwardRef<HTMLDivElement, FileChipProps>(
  (
    {
      name,
      size,
      type,
      status = 'complete',
      previewUrl,
      onRemove,
      removable = true,
      error,
      className,
      ...rest
    },
    ref
  ) => {
    const Icon = getFileIcon(type)
    const isImage = type?.startsWith('image/')
    const showPreview = isImage && previewUrl

    return (
      <div
        ref={ref}
        className={cx(
          'group relative inline-flex items-center gap-2 px-2 py-1.5',
          'bg-charcoal border text-sm text-white',
          'transition-colors duration-150',
          statusStyles[status],
          status === 'error' && 'bg-error/10',
          className
        )}
        role="listitem"
        {...rest}
      >
        {/* Preview thumbnail or icon */}
        {showPreview ? (
          <div className="w-8 h-8 flex-shrink-0 overflow-hidden bg-slate">
            <img
              src={previewUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <Icon className={cx(
            'w-4 h-4 flex-shrink-0',
            status === 'error' ? 'text-error' : 'text-silver'
          )} />
        )}

        {/* File info */}
        <div className="flex flex-col min-w-0 flex-1">
          <span className="truncate max-w-40" title={name}>
            {name}
          </span>
          {size !== undefined && status !== 'error' && (
            <span className="text-xs text-silver/60">
              {formatBytes(size)}
            </span>
          )}
          {status === 'error' && error && (
            <span className="text-xs text-error truncate" title={error}>
              {error}
            </span>
          )}
        </div>

        {/* Status indicator */}
        {status === 'uploading' && (
          <Loader2 className="w-3.5 h-3.5 text-gold animate-spin flex-shrink-0" />
        )}
        {status === 'pending' && (
          <div className="w-2 h-2 rounded-full bg-silver/50 flex-shrink-0" />
        )}

        {/* Remove button */}
        {removable && onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className={cx(
              'p-0.5 text-silver/40 hover:text-white transition-colors',
              'hover:bg-white/10',
              'opacity-0 group-hover:opacity-100',
              'focus:opacity-100'
            )}
            aria-label={`Remove ${name}`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    )
  }
)

FileChip.displayName = 'FileChip'

export default FileChip
