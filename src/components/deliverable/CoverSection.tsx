import React from 'react'
import type {CoverSection as CoverSectionData} from './types'

export interface CoverSectionProps {
  data: CoverSectionData
  /** Document-level client name from {@link Deliverable.clientName}, shown as "Prepared for {name}". */
  clientName?: string | null
}

/**
 * Title page for a deliverable. Always rendered as the first section.
 */
export function CoverSection({data, clientName}: CoverSectionProps) {
  return (
      <section className="deliverable-cover deliverable-page">
        <div className="deliverable-cover-inner">
          {data.eyebrow && (
              <p className="deliverable-cover-eyebrow">{data.eyebrow}</p>
          )}
          <h1 className="deliverable-cover-title">{data.title}</h1>
          {data.subtitle && (
              <p className="deliverable-cover-subtitle">{data.subtitle}</p>
          )}
          {clientName && (
              <p className="deliverable-cover-client">
                Prepared for{' '}
                <span className="deliverable-cover-client-name">{clientName}</span>
              </p>
          )}
        </div>
      </section>
  )
}
