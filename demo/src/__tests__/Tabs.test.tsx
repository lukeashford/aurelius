import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Tabs, TabList, Tab, TabPanel } from '@lukeashford/aurelius'

describe('Tabs', () => {
  const renderTabs = (props = {}) => {
    return render(
      <Tabs defaultValue="tab1" {...props}>
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
          <Tab value="tab2">Tab 2</Tab>
          <Tab value="tab3" disabled>Tab 3</Tab>
        </TabList>
        <TabPanel value="tab1">Panel 1 content</TabPanel>
        <TabPanel value="tab2">Panel 2 content</TabPanel>
        <TabPanel value="tab3">Panel 3 content</TabPanel>
      </Tabs>
    )
  }

  it('renders tabs', () => {
    renderTabs()
    expect(screen.getByText('Tab 1')).toBeInTheDocument()
    expect(screen.getByText('Tab 2')).toBeInTheDocument()
    expect(screen.getByText('Tab 3')).toBeInTheDocument()
  })

  it('shows default tab panel', () => {
    renderTabs()
    expect(screen.getByText('Panel 1 content')).toBeInTheDocument()
  })

  it('hides non-active panels', () => {
    renderTabs()
    expect(screen.queryByText('Panel 2 content')).toBeNull()
  })

  it('switches tabs on click', () => {
    renderTabs()
    fireEvent.click(screen.getByText('Tab 2'))
    expect(screen.queryByText('Panel 1 content')).toBeNull()
    expect(screen.getByText('Panel 2 content')).toBeInTheDocument()
  })

  it('does not switch to disabled tab', () => {
    renderTabs()
    fireEvent.click(screen.getByText('Tab 3'))
    expect(screen.getByText('Panel 1 content')).toBeInTheDocument()
    expect(screen.queryByText('Panel 3 content')).toBeNull()
  })

  it('applies tablist role', () => {
    renderTabs()
    expect(screen.getByRole('tablist')).toBeInTheDocument()
  })

  it('applies tab role', () => {
    renderTabs()
    expect(screen.getAllByRole('tab')).toHaveLength(3)
  })

  it('applies tabpanel role', () => {
    renderTabs()
    expect(screen.getByRole('tabpanel')).toBeInTheDocument()
  })

  it('sets aria-selected on active tab', () => {
    renderTabs()
    expect(screen.getByText('Tab 1').getAttribute('aria-selected')).toBe('true')
    expect(screen.getByText('Tab 2').getAttribute('aria-selected')).toBe('false')
  })

  it('disables the disabled tab', () => {
    renderTabs()
    expect(screen.getByText('Tab 3')).toBeDisabled()
  })

  it('calls onValueChange when tab changes', () => {
    const onValueChange = jest.fn()
    render(
      <Tabs defaultValue="tab1" onValueChange={onValueChange}>
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
          <Tab value="tab2">Tab 2</Tab>
        </TabList>
        <TabPanel value="tab1">Panel 1</TabPanel>
        <TabPanel value="tab2">Panel 2</TabPanel>
      </Tabs>
    )
    fireEvent.click(screen.getByText('Tab 2'))
    expect(onValueChange).toHaveBeenCalledWith('tab2')
  })

  it('works in controlled mode', () => {
    const { rerender } = render(
      <Tabs value="tab1">
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
          <Tab value="tab2">Tab 2</Tab>
        </TabList>
        <TabPanel value="tab1">Panel 1</TabPanel>
        <TabPanel value="tab2">Panel 2</TabPanel>
      </Tabs>
    )
    expect(screen.getByText('Panel 1')).toBeInTheDocument()

    rerender(
      <Tabs value="tab2">
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
          <Tab value="tab2">Tab 2</Tab>
        </TabList>
        <TabPanel value="tab1">Panel 1</TabPanel>
        <TabPanel value="tab2">Panel 2</TabPanel>
      </Tabs>
    )
    expect(screen.getByText('Panel 2')).toBeInTheDocument()
  })
})
