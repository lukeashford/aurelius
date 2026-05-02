import React from 'react'
import type {ColorPaletteSection as PaletteData} from './types'

export interface ColorPaletteSectionProps {
  data: PaletteData
}

/**
 * Color palette presented as labelled swatches with hex values.
 */
export function ColorPaletteSection({data}: ColorPaletteSectionProps) {
  return (
      <section className="deliverable-page">
        {data.heading && (
            <h2 className="deliverable-heading">{data.heading}</h2>
        )}
        <div className="deliverable-palette">
          {data.swatches.map((swatch, idx) => (
              <div key={idx} className="deliverable-palette-item">
                <div
                    className="deliverable-palette-chip"
                    style={{backgroundColor: swatch.color}}
                    aria-label={swatch.label}
                />
                <p className="deliverable-palette-label">{swatch.label}</p>
                <p className="deliverable-palette-hex">{swatch.color.toUpperCase()}</p>
              </div>
          ))}
        </div>
      </section>
  )
}
