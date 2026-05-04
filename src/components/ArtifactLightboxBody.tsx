import React from 'react'
import {ARTIFACT_TYPES, type Artifact, ArtifactCard} from './ArtifactCard'
import {DeliverableRenderer} from './deliverable/DeliverableRenderer'

export interface ArtifactLightboxBodyProps {
  artifact: Artifact
}

/**
 * Picks the bare body for an artifact when displayed inside a {@link Lightbox}.
 *
 * Each kind decides its own internal layout — an image aspect-fits the canvas,
 * a deliverable scrolls full-bleed, and so on. Crucially, none of these wrap
 * themselves in another Card frame: the lightbox already provides the canvas,
 * and a card-inside-modal produces the nested-frame look that signals "cheap
 * generic container." Kinds that don't yet have a dedicated bare body fall
 * back to {@link ArtifactCard} — adequate, but the stack-of-frames feel is the
 * thing to fix next when those kinds matter.
 *
 * Callers don't choose the body explicitly; the registry dispatches by
 * `artifact.type`. To add a kind, extend the switch — never branch on type at
 * the call site.
 */
export function ArtifactLightboxBody({artifact}: ArtifactLightboxBodyProps) {
  switch (artifact.type) {
    case ARTIFACT_TYPES.DELIVERABLE: {
      if (!artifact.deliverable) {
        return <ArtifactCard artifact={artifact}/>
      }
      return (
          <div className="w-full h-full overflow-auto">
            <DeliverableRenderer
                deliverable={artifact.deliverable}
                hideActions
            />
          </div>
      )
    }

    case ARTIFACT_TYPES.IMAGE: {
      if (!artifact.url) {
        return <ArtifactCard artifact={artifact}/>
      }
      return (
          <img
              src={artifact.url}
              alt={artifact.alt ?? artifact.title ?? ''}
              className="max-w-full max-h-full object-contain"
          />
      )
    }

    case ARTIFACT_TYPES.VIDEO: {
      if (!artifact.url) {
        return <ArtifactCard artifact={artifact}/>
      }
      return (
          <video
              src={artifact.url}
              controls
              className="max-w-full max-h-full object-contain bg-void"
          />
      )
    }

    case ARTIFACT_TYPES.AUDIO: {
      if (!artifact.url) {
        return <ArtifactCard artifact={artifact}/>
      }
      return (
          <audio
              src={artifact.url}
              controls
              className="w-full max-w-2xl"
          />
      )
    }

    default:
      // PDF, TEXT, SCRIPT — fall back to the panel-grid card for now. They
      // don't currently feel cheap inside a lightbox the way image and
      // deliverable did, so the bare-body work is deferred until they matter.
      return <ArtifactCard artifact={artifact}/>
  }
}

/**
 * Builds the optional caption shown bottom-centre over the lightbox backdrop.
 * Title/subtitle are repeated from the panel-grid card so the user keeps
 * orientation when the body is bare media. Returns `null` when nothing useful
 * is available — the lightbox then renders no caption row.
 */
export function getArtifactLightboxCaption(artifact: Artifact): React.ReactNode {
  // Deliverables surface their own cover inside the renderer; an outer caption
  // would duplicate it.
  if (artifact.type === ARTIFACT_TYPES.DELIVERABLE) {
    return null
  }
  if (!artifact.title && !artifact.subtitle) {
    return null
  }
  return (
      <div className="inline-flex flex-col items-center gap-1 px-4 py-2 bg-charcoal/70 backdrop-blur border border-ash/40">
        {artifact.title && (
            <p className="text-xs uppercase tracking-wider text-silver">
              {artifact.title}
            </p>
        )}
        {artifact.subtitle && (
            <p className="text-xs text-silver/70">{artifact.subtitle}</p>
        )}
      </div>
  )
}
