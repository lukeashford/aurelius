/**
 * Wire format for a presentable deliverable. The document is composed once by
 * the backend (or hand-authored) and rendered here — the renderer never reads
 * raw HTML from data, it dispatches on `type` to a typed component per section.
 *
 * The shape mirrors hypocaust's `ResolvedDeliverableDto`. When the OpenAPI
 * client is regenerated downstream of a hypocaust schema change, the types
 * here should be kept aligned.
 */

/**
 * Top-level deliverable. Holds metadata used on the cover and an ordered list
 * of sections to render.
 */
export interface Deliverable {
  /** Schema version. 1 today. */
  version: number
  /** Document title — also used as the default cover title. */
  title: string
  /** Optional one-line subtitle / tagline. */
  subtitle?: string | null
  /** Optional client name shown as "Prepared for {clientName}" on the cover. */
  clientName?: string | null
  /** Optional accent hex color (e.g. "#fecb6b"). Falls back to design-system gold. */
  accentColor?: string | null
  /** Ordered sections. Render in array order. */
  sections: DeliverableSection[]
}

/**
 * Discriminated union of section types. Each variant has a matching renderer
 * in aurelius — the agent fills the spec, never raw layout instructions.
 */
export type DeliverableSection =
    | CoverSection
    | ArtifactImageGridSection
    | ArtifactSpotlightSection
    | TextBlockSection
    | ColorPaletteSection
    | QuoteBlockSection

export interface CoverSection {
  type: 'COVER'
  eyebrow?: string | null
  title: string
  subtitle?: string | null
}

export interface ArtifactImageGridSection {
  type: 'ARTIFACT_IMAGE_GRID'
  heading?: string | null
  /** 1, 2 or 3. */
  columns: number
  items: DeliverableImageItem[]
}

export interface ArtifactSpotlightSection {
  type: 'ARTIFACT_SPOTLIGHT'
  heading?: string | null
  artifact: DeliverableArtifactRef
  body?: string | null
}

export interface TextBlockSection {
  type: 'TEXT_BLOCK'
  heading?: string | null
  body: string
}

export interface ColorPaletteSection {
  type: 'COLOR_PALETTE'
  heading?: string | null
  swatches: DeliverableSwatch[]
}

export interface QuoteBlockSection {
  type: 'QUOTE_BLOCK'
  quote: string
  attribution?: string | null
}

export interface DeliverableImageItem {
  artifact: DeliverableArtifactRef
  caption?: string | null
}

export interface DeliverableSwatch {
  color: string
  label: string
}

/**
 * Minimal subset of the hypocaust ArtifactDto shape consumed by the renderer.
 * Only the fields needed to render a deliverable's referenced artifacts.
 */
export interface DeliverableArtifactRef {
  url?: string | null
  title?: string | null
  description?: string | null
}
