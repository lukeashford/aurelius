import React from 'react'
import ReactPlayer from 'react-player'
import {Card, type CardProps} from './Card'
import {cx} from '../utils'

export type VideoAspectRatioPreset = 'video' | 'cinema' | 'square'
export type VideoAspectRatio = VideoAspectRatioPreset | `${number}/${number}`

export interface VideoCardProps extends Omit<CardProps, 'title'> {
  src?: string
  title?: React.ReactNode
  subtitle?: React.ReactNode
  aspectRatio?: VideoAspectRatio
  playing?: boolean
  controls?: boolean
  light?: boolean | string
  volume?: number
  muted?: boolean
  loop?: boolean
  mediaClassName?: string
  contentClassName?: string
  playerProps?: any
}

const ASPECT_RATIO_PRESETS: Record<VideoAspectRatioPreset, string> = {
  video: '16 / 9',
  cinema: '21 / 9',
  square: '1 / 1',
}

function resolveAspectRatio(ratio: VideoAspectRatio): string {
  if (ratio in ASPECT_RATIO_PRESETS) {
    return ASPECT_RATIO_PRESETS[ratio as VideoAspectRatioPreset]
  }
  return ratio.replace('/', ' / ')
}

export const VideoCard = React.forwardRef<HTMLDivElement, VideoCardProps>(
    (
        {
          src,
          title,
          subtitle,
          aspectRatio = 'video',
          playing = false,
          controls = true,
          light = false,
          volume,
          muted = false,
          loop = false,
          mediaClassName,
          contentClassName,
          className,
          children,
          playerProps,
          isLoading,
          ...props
        },
        ref
    ) => {
      return (
          <Card
              ref={ref}
              className={cx('p-0 overflow-hidden w-full', className)}
              isLoading={isLoading}
              {...props}
          >
            <Card.Media
                className={mediaClassName}
                style={{aspectRatio: resolveAspectRatio(aspectRatio)}}
            >
              {src && (
                  <ReactPlayer
                      src={src}
                      playing={playing}
                      controls={controls}
                      light={light}
                      volume={volume}
                      muted={muted}
                      loop={loop}
                      width="100%"
                      height="100%"
                      className="absolute top-0 left-0"
                      {...playerProps}
                  />
              )}
            </Card.Media>
            <Card.Header
                title={title}
                subtitle={subtitle}
                className={contentClassName}
            />
            {children && <Card.Body className={contentClassName}>{children}</Card.Body>}
          </Card>
      )
    }
)

VideoCard.displayName = 'VideoCard'
