import React from 'react'
import {cx} from '../../utils'
import type {ArtifactImageGridSection as GridData} from './types'

export interface ArtifactImageGridSectionProps {
  data: GridData
}

const COLUMN_CLASSES: Record<1 | 2 | 3, string> = {
  1: 'deliverable-image-grid-cols-1',
  2: 'deliverable-image-grid-cols-2',
  3: 'deliverable-image-grid-cols-3',
}

/**
 * Grid of project artifact images with optional captions. The number of
 * columns is fixed by the spec (1–3); the renderer enforces a sensible aspect
 * ratio per item and lets the browser flow rows.
 */
export function ArtifactImageGridSection({data}: ArtifactImageGridSectionProps) {
  const columns = clampColumns(data.columns)
  return (
      <section className="deliverable-page">
        {data.heading && (
            <h2 className="deliverable-heading">{data.heading}</h2>
        )}
        <div className={cx('deliverable-image-grid', COLUMN_CLASSES[columns])}>
          {data.items.map((item, idx) => (
              <figure key={idx} className="deliverable-image-item">
                {item.artifact.url
                    ? (
                        <img
                            src={item.artifact.url}
                            alt={item.artifact.title ?? ''}
                            className="deliverable-image-img"
                        />
                    )
                    : (
                        <div className="deliverable-image-missing">
                          Missing image
                        </div>
                    )}
                {item.caption && (
                    <figcaption className="deliverable-image-caption">
                      {item.caption}
                    </figcaption>
                )}
              </figure>
          ))}
        </div>
      </section>
  )
}

function clampColumns(n: number): 1 | 2 | 3 {
  if (n <= 1) return 1
  if (n === 2) return 2
  return 3
}
