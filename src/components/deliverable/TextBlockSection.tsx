import React from 'react'
import {MarkdownContent} from '../MarkdownContent'
import type {TextBlockSection as TextData} from './types'

export interface TextBlockSectionProps {
  data: TextData
}

/**
 * Prose section. Body is rendered as Markdown.
 */
export function TextBlockSection({data}: TextBlockSectionProps) {
  return (
      <section className="deliverable-page">
        {data.heading && (
            <h2 className="deliverable-heading">{data.heading}</h2>
        )}
        <MarkdownContent
            content={data.body}
            className="deliverable-text-block"
        />
      </section>
  )
}
