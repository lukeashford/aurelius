import React from 'react'
import {MarkdownContent} from '../MarkdownContent'
import type {ArtifactSpotlightSection as SpotlightData} from './types'

export interface ArtifactSpotlightSectionProps {
  data: SpotlightData
}

/**
 * A single hero artifact image with optional prose alongside. Reads at full
 * page width on screen and prints to a single page.
 */
export function ArtifactSpotlightSection({data}: ArtifactSpotlightSectionProps) {
  return (
      <section className="deliverable-page">
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
