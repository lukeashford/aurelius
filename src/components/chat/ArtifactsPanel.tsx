import React, {useCallback, useEffect, useState} from 'react'
import {cx} from '../../utils'
import {ArtifactCard} from '../ArtifactCard'
import {ArtifactGroup} from '../ArtifactGroup'
import {ArtifactVariantStack} from '../ArtifactVariantStack'
import {CardSlotLoading} from '../Card'
import {AudioCard} from '../AudioCard'
import {PdfCard} from '../PdfCard'
import {ScriptCard} from '../ScriptCard'
import {VideoCard} from '../VideoCard'
import {MarkdownContent} from '../MarkdownContent'
import {ChevronRightIcon, CloseIcon,} from '../icons'
import type {Artifact} from './hooks'
import type {ArtifactNode} from '../ArtifactNode'
import {useArtifactTreeNavigation} from './hooks/useArtifactTreeNavigation'

const ZOOM_LEVELS = [0.25, 0.5, 0.75, 1.0] as const

export interface ArtifactsPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Top-level tree nodes to display. When provided, the panel renders
   * a navigable artifact tree instead of a flat list.
   */
  nodes?: ArtifactNode[]
  /**
   * Array of flat artifacts to display (legacy/simple mode).
   * Ignored when `nodes` is provided.
   */
  artifacts?: Artifact[]
  /**
   * Whether artifacts are still loading (show skeletons)
   */
  loading?: CardSlotLoading
}

/**
 * Artifact modal for full-screen viewing
 */
function ArtifactModal({
  artifact,
  onClose,
}: {
  artifact: Artifact
  onClose: () => void
}) {
  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Handle click outside
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  return (
      <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-void/90 backdrop-blur-sm animate-fade-in"
          onClick={handleBackdropClick}
      >
        <div
            className="relative w-11/12 h-5/6 max-w-6xl bg-charcoal border border-ash/40 flex flex-col overflow-hidden">
          {/* Modal header */}
          <div
              className="flex items-center justify-between p-4 border-b border-ash/40 shrink-0">
            <div>
              {artifact.title && (
                  <h3 className="text-sm font-semibold text-white">{artifact.title}</h3>
              )}
              {artifact.subtitle && (
                  <p className="text-xs text-silver">{artifact.subtitle}</p>
              )}
            </div>
            <button
                onClick={onClose}
                className="p-2 text-silver hover:text-white hover:bg-ash/20 transition-colors"
                aria-label="Close modal"
            >
              <CloseIcon className="w-5 h-5"/>
            </button>
          </div>

          {/* Modal content */}
          <div className="flex-1 overflow-auto p-4">
            {artifact.type === 'IMAGE' && (
                <img
                    src={artifact.url}
                    alt={artifact.alt || 'Artifact image'}
                    className="max-w-full max-h-full object-contain mx-auto"
                />
            )}
            {artifact.type === 'VIDEO' && (
                <VideoCard
                    src={artifact.url || ''}
                    aspectRatio="video"
                    controls
                    className="max-w-full max-h-full mx-auto"
                />
            )}
            {artifact.type === 'AUDIO' && (
                <AudioCard
                    src={artifact.url || ''}
                    controls
                    className="max-w-xl mx-auto"
                />
            )}
            {artifact.type === 'PDF' && (
                <PdfCard
                    src={artifact.url || ''}
                    className="h-full border-0"
                />
            )}
            {artifact.type === 'TEXT' && (
                <MarkdownContent
                    content={artifact.inlineContent || ''}
                    isMarkdown={artifact.mimeType !== 'text/plain'}
                    className={cx(
                        "prose prose-invert max-w-none",
                        artifact.mimeType === 'text/plain' && "whitespace-pre-wrap"
                    )}
                />
            )}
            {artifact.type === 'SCRIPT' && artifact.scriptElements && (
                <ScriptCard
                    elements={artifact.scriptElements}
                    maxHeight="100%"
                    className="max-w-3xl mx-auto border-0"
                />
            )}
          </div>
        </div>
      </div>
  )
}

/**
 * Renders a single node according to its type.
 */
function NodeRenderer({
  node,
  loading,
  onExpandArtifact,
  onGroupClick,
}: {
  node: ArtifactNode
  loading?: CardSlotLoading
  onExpandArtifact: (artifact: Artifact) => void
  onGroupClick: (node: ArtifactNode) => void
}) {
  if (node.type === 'ARTIFACT' && node.artifact) {
    return (
        <ArtifactCard
            artifact={node.artifact}
            loading={loading}
            onExpand={onExpandArtifact}
        />
    )
  }

  if (node.type === 'GROUP') {
    return <ArtifactGroup node={node} onClick={onGroupClick}/>
  }

  if (node.type === 'VARIANT_SET') {
    return (
        <ArtifactVariantStack
            node={node}
            onExpandArtifact={onExpandArtifact}
            onGroupClick={onGroupClick}
        />
    )
  }

  return null
}

/**
 * ArtifactsPanel displays artifacts in a navigable tree panel.
 *
 * This is a content-only component — it fills whatever container it is
 * placed in. Opening/closing and resizing are handled by the parent
 * ToolPanelContainer and ToolSidebar.
 *
 * When provided with `nodes`, it renders a tree-aware, navigable panel
 * where groups can be entered (breadcrumb navigation) and artifacts
 * can be expanded to a full-screen modal.
 *
 * When provided with flat `artifacts`, it renders them in a simple grid.
 *
 * Supports zoom controls (0.25x–1x) in tree mode. Zoom uses the CSS
 * `zoom` property on the scroll viewport so the entire layout scales
 * uniformly — cards, images, gaps, and text all shrink as if the viewer
 * is physically moving back from the content.
 */
export const ArtifactsPanel = React.forwardRef<HTMLDivElement, ArtifactsPanelProps>(
    ({
      nodes,
      artifacts,
      loading,
      className,
      ...rest
    }, ref) => {
      const [expandedArtifact, setExpandedArtifact] = useState<Artifact | null>(null)
      const [zoomIndex, setZoomIndex] = useState<number>(ZOOM_LEVELS.length - 1) // default 1.0

      const treeNav = useArtifactTreeNavigation(nodes || [])

      const isTreeMode = !!nodes && nodes.length > 0

      const handleExpandArtifact = useCallback((artifact: Artifact) => {
        setExpandedArtifact(artifact)
      }, [])

      const handleGroupClick = useCallback((node: ArtifactNode) => {
        treeNav.navigateInto(node)
      }, [treeNav])

      const zoomIn = useCallback(() => {
        setZoomIndex(prev => Math.min(prev + 1, ZOOM_LEVELS.length - 1))
      }, [])

      const zoomOut = useCallback(() => {
        setZoomIndex(prev => Math.max(prev - 1, 0))
      }, [])

      const currentZoom = ZOOM_LEVELS[zoomIndex]

      return (
          <>
            <div
                ref={ref}
                data-testid="artifacts-panel"
                className={cx(
                    'h-full flex flex-col relative',
                    className
                )}
                {...rest}
            >
              {/* Header with title and zoom controls */}
              <div
                  className="flex items-center justify-between p-4 border-b border-ash/40 shrink-0">
                <h3 className="text-sm font-semibold text-white">Artifacts</h3>
                {isTreeMode && (
                    <div
                        className="flex items-center gap-0.5"
                        data-testid="zoom-controls"
                    >
                      <button
                          onClick={zoomOut}
                          disabled={zoomIndex === 0}
                          className={cx(
                              'w-6 h-6 flex items-center justify-center text-xs font-bold',
                              'bg-charcoal border border-ash/40',
                              zoomIndex === 0
                                  ? 'text-silver/30 cursor-not-allowed'
                                  : 'text-silver hover:text-gold hover:border-gold/40 transition-colors',
                          )}
                          aria-label="Zoom out"
                      >
                        −
                      </button>
                      <span className="text-xs text-silver w-8 text-center tabular-nums" data-testid="zoom-level">
                        {Math.round(currentZoom * 100)}%
                      </span>
                      <button
                          onClick={zoomIn}
                          disabled={zoomIndex === ZOOM_LEVELS.length - 1}
                          className={cx(
                              'w-6 h-6 flex items-center justify-center text-xs font-bold',
                              'bg-charcoal border border-ash/40',
                              zoomIndex === ZOOM_LEVELS.length - 1
                                  ? 'text-silver/30 cursor-not-allowed'
                                  : 'text-silver hover:text-gold hover:border-gold/40 transition-colors',
                          )}
                          aria-label="Zoom in"
                      >
                        +
                      </button>
                    </div>
                )}
              </div>

              {/* Breadcrumb trail (tree mode only, when not at root) */}
              {isTreeMode && !treeNav.isAtRoot && (
                  <nav
                      className="flex items-center gap-1 px-4 py-2 border-b border-ash/40 shrink-0 overflow-x-auto text-xs"
                      aria-label="Breadcrumb"
                      data-testid="breadcrumb-nav"
                  >
                    {treeNav.breadcrumbs.map((crumb, i) => {
                      const isLast = i === treeNav.breadcrumbs.length - 1
                      return (
                          <span key={i} className="flex items-center gap-1 shrink-0">
                      {i > 0 && (
                          <ChevronRightIcon className="w-3 h-3 text-silver/50" aria-hidden/>
                      )}
                            {isLast ? (
                                <span className="text-gold font-medium">{crumb.label}</span>
                            ) : (
                                <button
                                    onClick={() => treeNav.navigateTo(i)}
                                    className="text-silver hover:text-white transition-colors"
                                >
                                  {crumb.label}
                                </button>
                            )}
                    </span>
                      )
                    })}
                  </nav>
              )}

              {/* Content area — single column, natural widths, scrollable */}
              <div
                  className="flex-1 overflow-auto relative"
                  data-testid="artifacts-scroll-area"
                  style={currentZoom !== 1 ? { zoom: currentZoom } : undefined}
              >
                <div
                    data-testid="artifacts-grid"
                    className="p-4 space-y-4"
                >
                  {isTreeMode ? (
                      treeNav.currentNodes.length === 0 ? (
                          <p className="text-xs text-silver/60 text-center py-8">
                            Empty group
                          </p>
                      ) : (
                          treeNav.currentNodes.map((node) => (
                              <NodeRenderer
                                  key={node.id}
                                  node={node}
                                  loading={loading}
                                  onExpandArtifact={handleExpandArtifact}
                                  onGroupClick={handleGroupClick}
                              />
                          ))
                      )
                  ) : (
                      (!artifacts || artifacts.length === 0) && !loading ? (
                          <p className="text-xs text-silver/60 text-center py-8">
                            No artifacts to display
                          </p>
                      ) : (
                          artifacts?.map((artifact) => (
                              <ArtifactCard
                                  key={artifact.id}
                                  artifact={artifact}
                                  loading={loading}
                                  onExpand={handleExpandArtifact}
                              />
                          ))
                      )
                  )}
                </div>
              </div>

            </div>

            {/* Modal for expanded artifact */}
            {expandedArtifact && (
                <ArtifactModal
                    artifact={expandedArtifact}
                    onClose={() => setExpandedArtifact(null)}
                />
            )}
          </>
      )
    }
)

ArtifactsPanel.displayName = 'ArtifactsPanel'

/**
 * Toggle button to expand collapsed artifacts panel
 */
export interface ArtifactsPanelToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  artifactCount?: number
  onExpand?: () => void
}

export const ArtifactsPanelToggle = React.forwardRef<
    HTMLButtonElement,
    ArtifactsPanelToggleProps
>(({artifactCount = 0, onExpand, className, ...rest}, ref) => {
  return (
      <button
          ref={ref}
          onClick={onExpand}
          className={cx(
              'p-2',
              'bg-charcoal/80 border border-ash/40',
              'text-silver hover:text-white hover:bg-ash/20',
              'transition-colors duration-150',
              'flex items-center gap-2',
              'relative',
              className
          )}
          aria-label="Expand artifacts panel"
          {...rest}
      >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
        >
          <path
              fillRule="evenodd"
              d="M2 4.5A1.5 1.5 0 013.5 3h13A1.5 1.5 0 0118 4.5v11a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 012 15.5v-11zM4 5v1h1V5H4zm2 0v1h1V5H6zm7 0v1h1V5h-1zm2 0v1h1V5h-1zM4 14v1h1v-1H4zm2 0v1h1v-1H6zm7 0v1h1v-1h-1zm2 0v1h1v-1h-1zM8 8.118a.5.5 0 01.757-.429l4 2.382a.5.5 0 010 .858l-4 2.382A.5.5 0 018 12.882V8.118z"
              clipRule="evenodd"
          />
        </svg>
        {artifactCount > 0 && (
            <span
                className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-obsidian text-xs font-medium flex items-center justify-center">
          {artifactCount}
        </span>
        )}
      </button>
  )
})

ArtifactsPanelToggle.displayName = 'ArtifactsPanelToggle'
