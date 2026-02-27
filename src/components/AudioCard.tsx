import React from 'react'
import ReactPlayer from 'react-player'
import {Music} from 'lucide-react'
import {Card, type CardProps, type CardSlotLoading} from './Card'
import {cx} from '../utils'

export interface AudioCardProps extends Omit<CardProps, 'title'> {
  src?: string
  title?: React.ReactNode
  subtitle?: React.ReactNode
  playing?: boolean
  controls?: boolean
  volume?: number
  muted?: boolean
  loop?: boolean
  mediaClassName?: string
  contentClassName?: string
  playerProps?: any
  height?: string | number
  loading?: CardSlotLoading
}

export const AudioCard = React.forwardRef<HTMLDivElement, AudioCardProps>(
    (
        {
          src,
          title,
          subtitle,
          playing = false,
          controls = true,
          volume,
          muted = false,
          loop = false,
          mediaClassName,
          contentClassName,
          className,
          children,
          playerProps,
          height = '40px',
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
            <Card.Media className={cx('bg-obsidian py-8 flex flex-col items-center justify-center',
                mediaClassName)}>
              <div className="mb-4 text-gold">
                <Music size={48}/>
              </div>

              {src && (
                  <div className="w-full px-4">
                    <ReactPlayer
                        src={src}
                        playing={playing}
                        controls={controls}
                        volume={volume}
                        muted={muted}
                        loop={loop}
                        width="100%"
                        height={height}
                        style={{backgroundColor: 'transparent'}}
                        config={{
                          file: {
                            forceAudio: true,
                            attributes: {
                              style: {width: '100%', height: height}
                            }
                          }
                        }}
                        {...playerProps}
                    />
                  </div>
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

AudioCard.displayName = 'AudioCard'
