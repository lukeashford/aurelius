import React, {useCallback, useEffect, useRef, useState} from 'react'
import {Image} from 'lucide-react'
import {cx} from '../../utils'
import {ArtifactCard} from '../ArtifactCard'
import {ArtifactGroup} from '../ArtifactGroup'
import {ArtifactVariantStack} from '../ArtifactVariantStack'
import {ArtifactLightboxBody, getArtifactLightboxCaption} from '../ArtifactLightboxBody'
import {CardSlotLoading} from '../Card'
import {Skeleton} from '../Skeleton'
import {Lightbox} from '../Lightbox'
import {ChevronRightIcon} from '../icons'
import type {Artifact} from './hooks'
import {useArtifactTreeNavigation} from './hooks'
import type {ArtifactNode} from '../ArtifactNode'

const ZOOM_LEVELS = [0.25, 0.5, 0.75, 1.0] as const

const FULL_CARD_SLOT_LOADING: CardSlotLoading = {
  header: {title: true, subtitle: true},
  media: true,
  body: true,
}

const COLD_START_PLACEHOLDER_COUNT = 3

export interface ArtifactsPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Top-level tree nodes to display in the navigable artifact tree.
   */
  nodes?: ArtifactNode[]
  /**
   * Loading signal for the panel. Pass `true` for the cold-start case — the
   * panel renders placeholder skeleton cards in place of real artifacts so
   * the user sees "stuff is on its way" instead of an empty grid. Pass a
   * `CardSlotLoading` config to skeletonise specific slots on existing
   * cards (e.g. while a single artifact's media is hydrating). Falsy ⇒
   * render real content.
   */
  loading?: boolean | CardSlotLoading
  /**
   * When set to a non-null id, surfaces the same expanded artifact card the
   * panel grid would. Drives chip click-through from outside the panel.
   * Pair with `onArtifactClosed` so the parent can clear its controller
   * state when the user dismisses the modal.
   */
  openArtifactId?: string | null
  /**
   * Called when the user closes the expanded card (X button or backdrop).
   * The parent owns whether subsequent renders re-open by re-supplying
   * `openArtifactId`.
   */
  onArtifactClosed?: () => void
  /**
   * Resolves the floating action cluster shown over the lightbox when an
   * artifact is opened. Switch on `artifact.type` and return the host-owned
   * buttons for that kind (e.g. Share + Download for deliverables, Download
   * for images). Aurelius ships the close affordance itself; return only the
   * kind-specific actions, or `null` when there are none. The `ctx.onClose`
   * helper lets actions dismiss the lightbox after a successful operation.
   */
  getArtifactActions?: (
      artifact: Artifact,
      ctx: {onClose: () => void},
  ) => React.ReactNode
}

/**
 * Resolve the lightbox host actions for an artifact via the panel-level
 * callback. Wrapped here so the JSX reads as a single component. When the
 * host provides nothing, the lightbox renders only its close affordance.
 */
function ArtifactLightbox({
  artifact,
  onClose,
  getArtifactActions,
}: {
  artifact: Artifact
  onClose: () => void
  getArtifactActions?: (
      artifact: Artifact,
      ctx: {onClose: () => void},
  ) => React.ReactNode
}) {
  return (
      <Lightbox
          onClose={onClose}
          actions={getArtifactActions?.(artifact, {onClose})}
          caption={getArtifactLightboxCaption(artifact)}
      >
        <ArtifactLightboxBody artifact={artifact}/>
      </Lightbox>
  )
}

/**
 * Walk the artifact tree (including variant stacks and nested groups) to find
 * a leaf artifact by id. Returns null when no match exists in the current view.
 */
function findArtifactInNodes(nodes: ArtifactNode[], artifactId: string): Artifact | null {
  for (const node of nodes) {
    if (node.type === 'ARTIFACT' && node.artifact?.id === artifactId) {
      return node.artifact
    }
    if (node.children && node.children.length > 0) {
      const found = findArtifactInNodes(node.children, artifactId)
      if (found) {
        return found
      }
    }
  }
  return null
}

/**
 * Cold-start placeholder grid: shown when the panel mounts with `loading`
 * truthy but no nodes have arrived yet. Three card-shaped skeletons stand
 * in for the unknown artifact list so the user sees "stuff is on its way"
 * instead of an empty grid.
 */
function ColdStartPlaceholders() {
  return (
      <>
        {Array.from({length: COLD_START_PLACEHOLDER_COUNT}, (_, i) => (
            <Skeleton key={i} className="w-full aspect-video"/>
        ))}
      </>
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
 * Groups can be entered (breadcrumb navigation) and artifact nodes
 * can be expanded to a full-screen modal.
 *
 * Supports zoom controls (0.25x–1x). Zoom uses CSS `transform: scale()`
 * on the content wrapper so the entire layout scales uniformly — cards,
 * images, gaps, and text all shrink as if the viewer is physically
 * moving back from the content.
 */
export const ArtifactsPanel = React.forwardRef<HTMLDivElement, ArtifactsPanelProps>(
    ({
      nodes,
      loading,
      openArtifactId,
      onArtifactClosed,
      getArtifactActions,
      className,
      ...rest
    }, ref) => {
      const [expandedArtifact, setExpandedArtifact] = useState<Artifact | null>(null)
      const [zoomIndex, setZoomIndex] = useState<number>(ZOOM_LEVELS.length - 1) // default 1.0

      // Normalise the bivariant `loading` prop. `true` covers the cold-start
      // case where no card exists yet — we synthesise a full-slot config so
      // any cards that race in mid-load skeletonise sensibly, and below we
      // also paint placeholder cards while nodes is empty.
      const slotLoading: CardSlotLoading | undefined = loading === true
          ? FULL_CARD_SLOT_LOADING
          : loading || undefined
      const showColdStartPlaceholders = !!loading

      const treeNav = useArtifactTreeNavigation(nodes || [])

      const hasNodes = !!nodes && nodes.length > 0

      const handleExpandArtifact = useCallback((artifact: Artifact) => {
        setExpandedArtifact(artifact)
      }, [])

      const handleGroupClick = useCallback((node: ArtifactNode) => {
        treeNav.navigateInto(node)
      }, [treeNav])

      // Controlled open: surfaces the expanded card when the parent supplies a
      // non-null `openArtifactId`. Pairs with `onArtifactClosed` round-trip so
      // re-clicking the same chip after a manual close re-opens the modal.
      useEffect(() => {
        if (!openArtifactId || !nodes) {
          return
        }
        const found = findArtifactInNodes(nodes, openArtifactId)
        if (found) {
          setExpandedArtifact(found)
        }
      }, [openArtifactId, nodes])

      const handleModalClose = useCallback(() => {
        setExpandedArtifact(null)
        onArtifactClosed?.()
      }, [onArtifactClosed])

      const zoomIn = useCallback(() => {
        setZoomIndex(prev => Math.min(prev + 1, ZOOM_LEVELS.length - 1))
      }, [])

      const zoomOut = useCallback(() => {
        setZoomIndex(prev => Math.max(prev - 1, 0))
      }, [])

      const currentZoom = ZOOM_LEVELS[zoomIndex]

      // Measure content height so the scroll container can shrink to match the scaled visual height
      const contentRef = useRef<HTMLDivElement>(null)
      const [contentHeight, setContentHeight] = useState<number | undefined>(undefined)

      useEffect(() => {
        const el = contentRef.current
        if (!el) {
          return
        }
        const observer = new ResizeObserver(([entry]) => {
          setContentHeight(entry.contentRect.height)
        })
        observer.observe(el)
        return () => observer.disconnect()
      }, [])

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
                {hasNodes && (
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
                      <span className="text-xs text-silver w-8 text-center tabular-nums"
                            data-testid="zoom-level">
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
              {hasNodes && !treeNav.isAtRoot && (
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
              >
                {/* Sizer div: collapses to the scaled height so scrollbar tracks correctly */}
                <div
                    style={currentZoom !== 1 && contentHeight !== undefined
                        ? {height: contentHeight * currentZoom}
                        : undefined
                    }
                >
                  <div
                      ref={contentRef}
                      data-testid="artifacts-grid"
                      className="p-4 space-y-4"
                      style={currentZoom !== 1
                          ? {
                            transform: `scale(${currentZoom})`,
                            transformOrigin: 'top center',
                          }
                          : undefined
                      }
                  >
                    {treeNav.currentNodes.length === 0 ? (
                        showColdStartPlaceholders && !hasNodes ? (
                            <ColdStartPlaceholders/>
                        ) : (
                            <p className="text-xs text-silver/60 text-center py-8">
                              {hasNodes ? 'Empty group' : 'No artifacts to display'}
                            </p>
                        )
                    ) : (
                        treeNav.currentNodes.map((node) => (
                            <NodeRenderer
                                key={node.id}
                                node={node}
                                loading={slotLoading}
                                onExpandArtifact={handleExpandArtifact}
                                onGroupClick={handleGroupClick}
                            />
                        ))
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Lightbox for the expanded artifact */}
            {expandedArtifact && (
                <ArtifactLightbox
                    artifact={expandedArtifact}
                    onClose={handleModalClose}
                    getArtifactActions={getArtifactActions}
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
        <Image className="w-5 h-5" aria-hidden/>
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
