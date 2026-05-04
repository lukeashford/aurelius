import React, {useState} from 'react'
import {Button} from '../Button'
import {cx} from '../../utils'
import type {Deliverable, DeliverableSection, DeliverableTheme} from './types'
import {CoverSection} from './CoverSection'
import {ArtifactImageGridSection} from './ArtifactImageGridSection'
import {ArtifactSpotlightSection} from './ArtifactSpotlightSection'
import {TextBlockSection} from './TextBlockSection'
import {ColorPaletteSection} from './ColorPaletteSection'
import {QuoteBlockSection} from './QuoteBlockSection'

const THEME_CLASSES: Record<DeliverableTheme, string | null> = {
  cinematic: null,
  editorial: 'deliverable-theme-editorial',
  minimal: 'deliverable-theme-minimal',
}

export interface DeliverableRendererProps {
  /** Resolved deliverable spec — every artifact reference already inflated. */
  deliverable: Deliverable
  /**
   * Called when the viewer requests a PDF download. The host application is
   * responsible for fetching and triggering the file save (the URL knows
   * about share tokens and credentials we don't). When omitted, the download
   * affordance is hidden.
   */
  onDownloadPdf?: () => void | Promise<void>
  /** Hide the floating action bar entirely. Used when rendering for print. */
  hideActions?: boolean
  className?: string
}

/**
 * Render a presentable deliverable (moodboard, pitch deck) from a structured
 * spec. The same component drives the on-screen view and the print/PDF
 * version — `@media print` styles in `aurelius/styles/base.css` keep them in
 * sync. To produce a PDF, drive the page with headless Chromium and let the
 * print stylesheet do the work.
 *
 * The renderer is purely presentational: it takes a fully resolved spec
 * (artifact URLs already inflated by the caller) and dispatches each section
 * to its typed sub-renderer. Unknown section types are skipped silently
 * forward-compat for new section variants added by the backend.
 */
export function DeliverableRenderer({
  deliverable,
  onDownloadPdf,
  hideActions = false,
  className,
}: DeliverableRendererProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const accent = deliverable.accentColor?.trim()
  const style = accent
      ? ({'--deliverable-accent': accent} as React.CSSProperties)
      : undefined
  const theme: DeliverableTheme = deliverable.theme ?? 'cinematic'
  const themeClass = THEME_CLASSES[theme]

  const handleDownload = async () => {
    if (!onDownloadPdf || isDownloading) return
    setIsDownloading(true)
    try {
      await onDownloadPdf()
    } finally {
      setIsDownloading(false)
    }
  }

  return (
      <div
          className={cx('deliverable', themeClass, className)}
          style={style}
      >
        {deliverable.sections.map((section, idx) =>
            renderSection(section, idx, deliverable))}

        {!hideActions && onDownloadPdf && (
            <div className="deliverable-actions">
              <Button
                  variant="important"
                  size="md"
                  onClick={handleDownload}
                  loading={isDownloading}
                  className="deliverable-action-button"
              >
                Download PDF
              </Button>
            </div>
        )}
      </div>
  )
}

function renderSection(
    section: DeliverableSection,
    idx: number,
    doc: Deliverable,
): React.ReactNode {
  const key = `${section.type}-${idx}`
  switch (section.type) {
    case 'COVER':
      return (
          <CoverSection
              key={key}
              data={section}
              clientName={doc.clientName}
          />
      )
    case 'ARTIFACT_IMAGE_GRID':
      return <ArtifactImageGridSection key={key} data={section}/>
    case 'ARTIFACT_SPOTLIGHT':
      return <ArtifactSpotlightSection key={key} data={section}/>
    case 'TEXT_BLOCK':
      return <TextBlockSection key={key} data={section}/>
    case 'COLOR_PALETTE':
      return <ColorPaletteSection key={key} data={section}/>
    case 'QUOTE_BLOCK':
      return <QuoteBlockSection key={key} data={section}/>
    default:
      // Unknown section type from a newer backend — skip to stay forward-compat.
      return null
  }
}
