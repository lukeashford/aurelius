import React from 'react'
import {Card, type CardProps, type CardSlotLoading} from './Card'
import {cx} from '../utils'
import type {Deliverable} from './deliverable'

export interface DeliverableCardProps extends Omit<CardProps, 'title'> {
  /**
   * Resolved deliverable spec — every artifact reference already inflated.
   * Same shape the full DeliverableRenderer accepts.
   */
  deliverable?: Deliverable
  /** Optional override for the cover title (otherwise derived from the spec). */
  title?: React.ReactNode
  /** Optional subtitle shown below the title. */
  subtitle?: React.ReactNode
  /** The artifact's `@-handle` — see `Card.Header.handle`. */
  handle?: string
  loading?: CardSlotLoading
}

/**
 * Compact preview of a deliverable for surfaces that can't host the full
 * multi-page renderer (chat tree, artifact lists). Surfaces the deliverable's
 * cover info plus its section count. The whole card is clickable — the
 * affordance is the same expand-icon overlay that {@link ArtifactCard} shows
 * for every artifact kind, so we don't add a "Open preview" lure here.
 */
export const DeliverableCard = React.forwardRef<HTMLDivElement, DeliverableCardProps>(
    (
        {
          deliverable,
          title,
          subtitle,
          handle,
          className,
          loading,
          ...props
        },
        ref,
    ) => {
      const cover = deliverable?.sections.find(
          (s): s is Extract<typeof s, { type: 'COVER' }> => s.type === 'COVER',
      )
      const eyebrow = cover?.eyebrow
      const headline = title ?? cover?.title ?? deliverable?.title
      const tagline = subtitle ?? cover?.subtitle ?? deliverable?.subtitle
      const accent = deliverable?.accentColor?.trim()
      const style = accent
          ? ({'--deliverable-accent': accent} as React.CSSProperties)
          : undefined
      const sectionCount = deliverable?.sections.length ?? 0

      return (
          <Card
              ref={ref}
              variant="outlined"
              interactive
              loading={loading}
              className={cx('deliverable-card overflow-hidden w-full', className)}
              style={style}
              {...props}
          >
            <div className="deliverable-card-cover">
              {eyebrow && (
                  <p className="deliverable-card-eyebrow">{eyebrow}</p>
              )}
              {headline && (
                  <p className="deliverable-card-title">{headline}</p>
              )}
              {tagline && (
                  <p className="deliverable-card-subtitle">{tagline}</p>
              )}
            </div>
            <div className="deliverable-card-meta flex items-center justify-between">
              <span>
                {sectionCount} {sectionCount === 1 ? 'section' : 'sections'}
              </span>
              {handle && <Card.Handle handle={handle}/>}
            </div>
          </Card>
      )
    },
)

DeliverableCard.displayName = 'DeliverableCard'
