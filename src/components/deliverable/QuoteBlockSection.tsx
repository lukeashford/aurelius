import React from 'react'
import type {QuoteBlockSection as QuoteData} from './types'

export interface QuoteBlockSectionProps {
  data: QuoteData
}

/**
 * Pulled quote with optional attribution. The renderer adds the surrounding
 * quotation marks.
 */
export function QuoteBlockSection({data}: QuoteBlockSectionProps) {
  return (
      <section className="deliverable-page deliverable-quote">
        <blockquote className="deliverable-quote-body">
          <p className="deliverable-quote-text">“{data.quote}”</p>
          {data.attribution && (
              <footer className="deliverable-quote-attribution">
                — {data.attribution}
              </footer>
          )}
        </blockquote>
      </section>
  )
}
