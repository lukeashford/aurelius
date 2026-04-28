import React from 'react'
import {cx} from '../../utils'

/**
 * Position group for a tool — combines vertical position (top/bottom)
 * with sidebar side (left/right).
 */
export type ToolGroup = 'top-left' | 'bottom-left' | 'top-right' | 'bottom-right'

/**
 * Describes a tool that can be toggled from the sidebar.
 */
export interface ToolDefinition {
  /**
   * Unique identifier for this tool
   */
  id: string
  /**
   * Icon element shown in the sidebar button
   */
  icon: React.ReactNode
  /**
   * Accessible label for the button
   */
  label: string
  /**
   * Which group the tool belongs to — tools in the same group
   * are mutually exclusive (opening one closes the other).
   */
  group: ToolGroup
}

/**
 * Consumer-provided tool definition passed via ChatInterface's `tools` prop.
 * Adds the panel content to render when the tool is opened.
 */
export interface ExternalToolDefinition extends ToolDefinition {
  /**
   * Content to render when the tool is open
   */
  content: React.ReactNode
}

/**
 * Tracks which tool is open in each group (null = none).
 */
export interface ToolPanelState {
  'top-left': string | null
  'bottom-left': string | null
  'top-right': string | null
  'bottom-right': string | null
}

export interface ToolSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Available tool definitions
   */
  tools: ToolDefinition[]
  /**
   * Current state — which tool is open per group
   */
  activeTools: ToolPanelState
  /**
   * Called when a tool button is clicked (toggle)
   */
  onToggleTool: (toolId: string) => void
  /**
   * Which side this sidebar is on — controls border direction
   */
  side: 'left' | 'right'
}

/**
 * ToolSidebar renders a vertical strip of tool icon buttons on either
 * side of the chat interface. It follows the IntelliJ pattern:
 *
 * - Top-aligned group and bottom-aligned group separated by a divider
 * - Tools in the same group are mutually exclusive
 * - Clicking an active tool closes it; clicking an inactive tool opens it
 * - Constant slim width regardless of tool panel state
 * - Can be placed on left or right side via the `side` prop
 */
export const ToolSidebar = React.forwardRef<HTMLDivElement, ToolSidebarProps>(
    ({tools, activeTools, onToggleTool, side, className, ...rest}, ref) => {
      const topTools = tools.filter(t => t.group === `top-${side}`)
      const bottomTools = tools.filter(t => t.group === `bottom-${side}`)

      const isActive = (toolId: string) => {
        const tool = tools.find(t => t.id === toolId)
        if (!tool) return false
        return activeTools[tool.group] === toolId
      }

      const renderButton = (tool: ToolDefinition) => {
        const active = isActive(tool.id)
        return (
            <button
                key={tool.id}
                onClick={() => onToggleTool(tool.id)}
                className={cx(
                    'w-8 h-8 flex items-center justify-center transition-colors duration-150',
                    active
                        ? 'bg-gold/15 text-gold border border-gold/30'
                        : 'text-silver hover:text-white hover:bg-ash/20'
                )}
                aria-label={tool.label}
                aria-pressed={active}
            >
              <span className="w-4 h-4 block">
                {tool.icon}
              </span>
            </button>
        )
      }

      return (
          <div
              ref={ref}
              className={cx(
                  'h-full w-9 bg-charcoal/80 flex flex-col items-center shrink-0 py-2',
                  side === 'left' ? 'border-r border-ash/40' : 'border-l border-ash/40',
                  className
              )}
              {...rest}
          >
            {/* Top-aligned tools */}
            <div className="flex flex-col items-center gap-1">
              {topTools.map(renderButton)}
            </div>

            {/* Spacer + separator */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-5 border-t border-ash/30"/>
            </div>

            {/* Bottom-aligned tools */}
            <div className="flex flex-col items-center gap-1">
              {bottomTools.map(renderButton)}
            </div>
          </div>
      )
    }
)

ToolSidebar.displayName = 'ToolSidebar'
