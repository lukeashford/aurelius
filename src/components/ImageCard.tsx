import React from 'react'
import { Card, type CardProps } from './Card'
import { cx } from '../utils/cx'

export type AspectRatioPreset = 'landscape' | 'portrait' | 'square'
export type AspectRatio = AspectRatioPreset | `${number}/${number}`

export interface ImageCardProps extends Omit<CardProps, 'title'> {
  src: string
  alt: string
  title?: React.ReactNode
  subtitle?: React.ReactNode
  aspectRatio?: AspectRatio
  objectFit?: 'cover' | 'contain'
  overlay?: React.ReactNode
  mediaClassName?: string
  contentClassName?: string
}

const ASPECT_RATIO_PRESETS: Record<AspectRatioPreset, string> = {
  landscape: '3 / 2',
  portrait: '2 / 3',
  square: '1 / 1',
}

function resolveAspectRatio(ratio: AspectRatio): string {
  if (ratio in ASPECT_RATIO_PRESETS) {
    return ASPECT_RATIO_PRESETS[ratio as AspectRatioPreset]
  }
  return ratio.replace('/', ' / ')
}

export const ImageCard = React.forwardRef<HTMLDivElement, ImageCardProps>(
    (
        {
          src,
          alt,
          title,
          subtitle,
          aspectRatio,
          objectFit = 'cover',
          overlay,
          mediaClassName,
          contentClassName,
          className,
          children,
          ...props
        },
        ref
    ) => {
      const hasAspectRatio = aspectRatio !== undefined
      const isContain = objectFit === 'contain'

      return (
          <Card ref={ref} className={cx('p-0 overflow-hidden group w-fit', className)} {...props}>
            {/* Media container */}
            <div
                className={cx(
                    'relative',
                    hasAspectRatio && 'overflow-hidden',
                    mediaClassName
                )}
                style={hasAspectRatio ? {aspectRatio: resolveAspectRatio(aspectRatio)} : undefined}
            >
              <img
                  src={src}
                  alt={alt}
                  className={cx(
                      'block max-w-full',
                      hasAspectRatio && 'w-full h-full',
                      hasAspectRatio && (isContain ? 'object-contain' : 'object-cover'),
                      !hasAspectRatio && 'h-auto'
                  )}
              />

              {/* Hover overlay */}
              {overlay && (
                  <div
                      className="absolute inset-0 bg-obsidian/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    {overlay}
                  </div>
              )}
            </div>

            {/* Content section */}
            {(title || subtitle || children) && (
                <div className={cx('px-4 pt-4', contentClassName)}>
                  {title && <h4 className="text-lg font-semibold leading-tight">{title}</h4>}
                  {subtitle && <p className="text-sm text-silver leading-normal">{subtitle}</p>}
                  {children}
                </div>
            )}
          </Card>
      )
    }
)

ImageCard.displayName = 'ImageCard'