import React from 'react'
import {MarkdownContent} from '../MarkdownContent'
import {cx} from '../../utils'
import type {
  ArtifactSpotlightSection as SpotlightData,
  SpotlightVariant,
} from './types'

export interface ArtifactSpotlightSectionProps {
  data: SpotlightData
}

const VARIANT_CLASSES: Record<SpotlightVariant, string | null> = {
  framed: null,
  'full-bleed': 'deliverable-spotlight-variant-full-bleed',
  'side-by-side': 'deliverable-spotlight-variant-side-by-side',
}

/**
 * A single hero artifact image with optional prose alongside. Reads at full
 * page width on screen and prints to a single page (or a full-bleed page for
 * the `full-bleed` variant).
 */
export function ArtifactSpotlightSection({data}: ArtifactSpotlightSectionProps) {
  const variant: SpotlightVariant = data.variant ?? 'framed'
  return (
      <section className={cx('deliverable-page', VARIANT_CLASSES[variant])}>
        {data.heading && (
            <h2 className="deliverable-heading">{data.heading}</h2>
        )}
        <div className="deliverable-spotlight-media">
          {data.artifact.url
              ? (
                  <img
                      src={data.artifact.url}
                      alt={data.artifact.title ?? ''}
                      className="deliverable-spotlight-img"
                  />
              )
              : (
                  <div className="deliverable-spotlight-missing">
                    Missing image
                  </div>
              )}
        </div>
        {data.body && (
            <MarkdownContent
                content={data.body}
                className="deliverable-spotlight-body"
            />
        )}
      </section>
  )
}
