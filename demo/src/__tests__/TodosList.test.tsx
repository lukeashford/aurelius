import React from 'react'
import {render, screen} from '@testing-library/react'
import {Task, TodosList} from '@lukeashford/aurelius'

describe('TodosList', () => {
  const mockTasks: Task[] = [
    {id: '1', label: 'Task 1', status: 'done'},
    {id: '2', label: 'Task 2', status: 'in_progress'},
    {id: '3', label: 'Task 3', status: 'pending'},
  ]

  it('renders nothing when tasks list is empty', () => {
    const {container} = render(<TodosList tasks={[]}/>)
    expect(container.firstChild).toBeNull()
  })

  it('renders tasks with default title', () => {
    render(<TodosList tasks={mockTasks}/>)
    expect(screen.getByText('Tasks')).toBeInTheDocument()
    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()
    expect(screen.getByText('Task 3')).toBeInTheDocument()
  })

  it('renders with custom title', () => {
    render(<TodosList tasks={mockTasks} title="Workflow"/>)
    expect(screen.getByText('Workflow')).toBeInTheDocument()
  })

  it('shows completion progress', () => {
    render(<TodosList tasks={mockTasks}/>)
    // 1 done out of 3 total
    expect(screen.getByText('1/3')).toBeInTheDocument()
  })

  it('sorts cancelled and failed tasks to the bottom', () => {
    const tasks: Task[] = [
      {id: '1', label: 'Cancelled Task', status: 'cancelled'},
      {id: '2', label: 'Done Task', status: 'done'},
      {id: '3', label: 'Failed Task', status: 'failed'},
      {id: '4', label: 'Pending Task', status: 'pending'},
    ]
    render(<TodosList tasks={tasks}/>)

    // Find all task labels
    const taskLabels = screen.getAllByText(/Task/)

    // We want to find the labels that are in the main task items
    // (excluding the ones that might be in the status text like "(failed)")
    const items = taskLabels.filter(el =>
        el.tagName === 'SPAN' &&
        (el.textContent?.includes('Task') && !el.textContent?.trim().startsWith('('))
    )

    // The component sorts: Done Task, Pending Task, then Cancelled and Failed
    expect(items[0].textContent).toContain('Done Task')
    expect(items[1].textContent).toContain('Pending Task')
    expect(items[2].textContent).toContain('Cancelled Task')
    expect(items[3].textContent).toContain('Failed Task')
  })

  it('renders subtasks when parent is in_progress or done', () => {
    const tasks: Task[] = [
      {
        id: '1',
        label: 'Parent Task',
        status: 'in_progress',
        subtasks: [
          {id: '1-1', label: 'Subtask 1', status: 'done'},
          {id: '1-2', label: 'Subtask 2', status: 'pending'},
        ]
      }
    ]
    render(<TodosList tasks={tasks}/>)

    expect(screen.getByText('Parent Task')).toBeInTheDocument()
    expect(screen.getByText('Subtask 1')).toBeInTheDocument()
    expect(screen.getByText('Subtask 2')).toBeInTheDocument()
    // Progress should include subtasks: 0 (parent task not done) / 1 (parent task)
    expect(screen.getByText('0/1')).toBeInTheDocument()
  })

  it('shows subtasks even when parent is pending', () => {
    const tasks: Task[] = [
      {
        id: '1',
        label: 'Parent Task',
        status: 'pending',
        subtasks: [
          {id: '1-1', label: 'Subtask 1', status: 'done'},
        ]
      }
    ]
    render(<TodosList tasks={tasks}/>)

    expect(screen.getByText('Parent Task')).toBeInTheDocument()
    expect(screen.getByText('Subtask 1')).toBeInTheDocument()
  })

  it('applies correct styling for different statuses', () => {
    const tasks: Task[] = [
      {id: '1', label: 'Done', status: 'done'},
      {id: '2', label: 'In Progress', status: 'in_progress'},
      {id: '3', label: 'Cancelled', status: 'cancelled'},
      {id: '4', label: 'Failed', status: 'failed'},
    ]
    render(<TodosList tasks={tasks}/>)

    expect(screen.getByText('Done').className).toContain('line-through')
    expect(screen.getByText('In Progress').className).toContain('text-white')
    expect(screen.getByText('Cancelled').className).toContain('line-through')
    expect(screen.getByText('Failed').className).toContain('line-through')
  })
})
