import React, {useState} from 'react'
import {cx} from '../utils'
import {Tooltip} from './Tooltip'
import {
  File,
  FileArchive,
  FileAudio,
  FileCode,
  FileImage,
  FileText,
  FileVideo,
  Loader2,
  X
} from 'lucide-react'

export type FileChipStatus =
    | 'pending'
    | 'uploading'
    | 'uploaded'
    | 'analyzing'
    | 'analyzed'
    | 'upload_failed'
    | 'analysis_failed'

export interface FileChipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onClick'> {
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
   * Error message to display (when status is an error)
   */
  error?: string
  /**
   * Backend artifact id, set once the upload has been integrated. When both
   * `artifactId` and `onOpen` are present, the chip becomes clickable.
   */
  artifactId?: string
  /**
   * Click handler invoked with `artifactId` when the chip is clicked.
   * Compose-box (pre-integrate) chips should not pass this — the chip stays
   * non-clickable except for its remove button.
   */
  onOpen?: (artifactId: string) => void
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return '0 B'
  }
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Get icon component based on MIME type
 */
function getFileIcon(type?: string) {
  if (!type) {
    return File
  }

  if (type.startsWith('image/')) {
    return FileImage
  }
  if (type.startsWith('video/')) {
    return FileVideo
  }
  if (type.startsWith('audio/')) {
    return FileAudio
  }
  if (type.startsWith('text/')) {
    return FileText
  }
  if (type.includes('javascript') || type.includes('typescript') || type.includes('json')
      || type.includes('xml')) {
    return FileCode
  }
  if (type.includes('zip') || type.includes('rar') || type.includes('tar') || type.includes('gz')) {
    return FileArchive
  }

  return File
}

const statusBorderClass: Record<FileChipStatus, string> = {
  pending: 'border-silver/30',
  uploading: 'border-gold/50',
  uploaded: 'border-info/50',
  analyzing: 'border-info/50',
  analyzed: 'border-success/50',
  upload_failed: 'border-error/50',
  analysis_failed: 'border-error/50',
}

const statusHoverLabel: Record<FileChipStatus, string | null> = {
  pending: null,
  uploading: 'Uploading',
  uploaded: 'Analyzing',
  analyzing: 'Analyzing',
  analyzed: null,
  upload_failed: 'Upload failed',
  analysis_failed: "Couldn't process this file",
}

function isErrorStatus(status: FileChipStatus): boolean {
  return status === 'upload_failed' || status === 'analysis_failed'
}

export const FileChip = React.forwardRef<HTMLDivElement, FileChipProps>(
    (
        {
          name,
          size,
          type,
          status = 'analyzed',
          previewUrl,
          onRemove,
          removable = true,
          error,
          artifactId,
          onOpen,
          className,
          title,
          ...rest
        },
        ref
    ) => {
      const Icon = getFileIcon(type)
      const isImage = type?.startsWith('image/')
      const showPreview = isImage && previewUrl

      const clickable = !!(artifactId && onOpen)
      const hoverLabel = statusHoverLabel[status]
      // Tooltip on hover/focus surfaces the lifecycle state. Errors take
      // precedence over the generic status label so the user sees the
      // specific reason. `analyzed` chips have no tooltip — the chip is
      // interactive on its own and the filename in the strip already names
      // it.
      const tooltipContent: string | null = isErrorStatus(status)
          ? (error ?? hoverLabel ?? null)
          : hoverLabel
      const [hovered, setHovered] = useState(false)
      const [focused, setFocused] = useState(false)
      const showError = isErrorStatus(status)

      const handleClick = () => {
        if (clickable) {
          onOpen!(artifactId!)
        }
      }

      const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!clickable) {
          return
        }
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen!(artifactId!)
        }
      }

      const tooltipOpen = tooltipContent !== null && (hovered || focused)

      const chip = (
          <div
              {...rest}
              ref={ref}
              className={cx(
                  'group relative inline-flex items-center gap-2 px-2 py-1.5',
                  'bg-charcoal border text-sm text-white',
                  'transition-colors duration-150',
                  statusBorderClass[status],
                  showError && 'bg-error/10',
                  clickable && 'cursor-pointer hover:bg-graphite',
                  className
              )}
              role={clickable ? 'button' : 'listitem'}
              tabIndex={clickable ? 0 : undefined}
              onClick={clickable ? handleClick : undefined}
              onKeyDown={clickable ? handleKeyDown : undefined}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              title={title}
              aria-label={hoverLabel ? `${name}: ${hoverLabel}` : name}
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
                    showError ? 'text-error' : 'text-silver'
                )}/>
            )}

            {/* File info */}
            <div className="flex flex-col min-w-0 flex-1">
          <span className="truncate max-w-40" title={name}>
            {name}
          </span>
              {size !== undefined && !showError && (
                  <span className="text-xs text-silver/60">
              {formatBytes(size)}
            </span>
              )}
              {showError && error && (
                  <span className="text-xs text-error truncate" title={error}>
              {error}
            </span>
              )}
            </div>

            {/* Status indicator */}
            {status === 'uploading' && (
                <Loader2 className="w-3.5 h-3.5 text-gold animate-spin flex-shrink-0"/>
            )}
            {(status === 'uploaded' || status === 'analyzing') && (
                <Loader2 className="w-3.5 h-3.5 text-info animate-spin flex-shrink-0"/>
            )}
            {status === 'pending' && (
                <div className="w-2 h-2 rounded-full bg-silver/50 flex-shrink-0"/>
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
                  <X className="w-3.5 h-3.5"/>
                </button>
            )}
          </div>
      )

      if (tooltipContent === null) {
        return chip
      }
      return (
          <Tooltip content={tooltipContent} open={tooltipOpen} side="top">
            {chip}
          </Tooltip>
      )
    }
)

FileChip.displayName = 'FileChip'

export default FileChip
