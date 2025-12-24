import React, { createContext, useContext, useState, useCallback, useId } from 'react'
import { cx } from '../utils/cx'

// Context for managing tab state
interface TabsContextValue {
  activeTab: string
  setActiveTab: (id: string) => void
  baseId: string
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider')
  }
  return context
}

// Main Tabs container
export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The id of the initially active tab */
  defaultValue?: string
  /** Controlled active tab value */
  value?: string
  /** Callback when active tab changes */
  onValueChange?: (value: string) => void
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ defaultValue, value, onValueChange, children, className, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState(defaultValue ?? '')
    const isControlled = value !== undefined
    const activeTab = isControlled ? value : internalValue
    const baseId = useId()

    const setActiveTab = useCallback(
      (id: string) => {
        if (!isControlled) {
          setInternalValue(id)
        }
        onValueChange?.(id)
      },
      [isControlled, onValueChange]
    )

    return (
      <TabsContext.Provider value={{ activeTab, setActiveTab, baseId }}>
        <div ref={ref} className={cx('w-full', className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    )
  }
)

Tabs.displayName = 'Tabs'

// TabList - container for Tab buttons
export interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TabList = React.forwardRef<HTMLDivElement, TabListProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="tablist"
        className={cx(
          'flex border-b border-ash',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

TabList.displayName = 'TabList'

// Tab - individual tab button
export interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Unique identifier for this tab */
  value: string
}

export const Tab = React.forwardRef<HTMLButtonElement, TabProps>(
  ({ value, children, className, disabled, ...props }, ref) => {
    const { activeTab, setActiveTab, baseId } = useTabsContext()
    const isActive = activeTab === value
    const panelId = `${baseId}-panel-${value}`
    const tabId = `${baseId}-tab-${value}`

    return (
      <button
        ref={ref}
        id={tabId}
        type="button"
        role="tab"
        aria-selected={isActive}
        aria-controls={panelId}
        tabIndex={isActive ? 0 : -1}
        disabled={disabled}
        onClick={() => setActiveTab(value)}
        className={cx(
          'px-4 py-2 text-sm font-medium transition-all duration-fast',
          'border-b-2 -mb-px',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-inset',
          isActive
            ? 'border-gold text-gold'
            : 'border-transparent text-silver hover:text-white hover:border-ash',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Tab.displayName = 'Tab'

// TabPanel - content panel for a tab
export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Value matching the corresponding Tab */
  value: string
  /** Force the panel to stay mounted when inactive */
  forceMount?: boolean
}

export const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(
  ({ value, forceMount = false, children, className, ...props }, ref) => {
    const { activeTab, baseId } = useTabsContext()
    const isActive = activeTab === value
    const panelId = `${baseId}-panel-${value}`
    const tabId = `${baseId}-tab-${value}`

    if (!isActive && !forceMount) {
      return null
    }

    return (
      <div
        ref={ref}
        id={panelId}
        role="tabpanel"
        aria-labelledby={tabId}
        tabIndex={0}
        hidden={!isActive}
        className={cx(
          'pt-4 focus-visible:outline-none',
          !isActive && 'hidden',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

TabPanel.displayName = 'TabPanel'
