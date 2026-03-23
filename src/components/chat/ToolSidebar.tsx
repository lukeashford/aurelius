import React from 'react'
import {cx} from '../../utils'

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
  group: 'top' | 'bottom'
}

/**
 * Tracks which tool is open in each group (null = none).
 */
export interface ToolPanelState {
  top: string | null
  bottom: string | null
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
}

/**
 * ToolSidebar renders a vertical strip of tool icon buttons on the right
 * side of the chat interface. It follows the IntelliJ pattern:
 *
 * - Top-aligned group and bottom-aligned group separated by a divider
 * - Tools in the same group are mutually exclusive
 * - Clicking an active tool closes it; clicking an inactive tool opens it
 * - Constant slim width regardless of tool panel state
 */
export const ToolSidebar = React.forwardRef<HTMLDivElement, ToolSidebarProps>(
    ({tools, activeTools, onToggleTool, className, ...rest}, ref) => {
      const topTools = tools.filter(t => t.group === 'top')
      const bottomTools = tools.filter(t => t.group === 'bottom')

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
                  'h-full w-9 bg-charcoal/80 border-l border-ash/40 flex flex-col items-center shrink-0 py-2',
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
