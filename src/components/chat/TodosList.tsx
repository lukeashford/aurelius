import React, {useMemo} from 'react'
import {cx} from '../../utils/cx'
import {
  CheckSquareIcon,
  CrossSquareIcon,
  EmptySquareIcon,
  SquareLoaderIcon,
} from '../icons'

export type TaskStatus = 'pending' | 'in_progress' | 'done' | 'cancelled' | 'failed'

export interface Task {
  /**
   * Unique identifier for the task
   */
  id: string
  /**
   * Task description text
   */
  label: string
  /**
   * Current status of the task
   */
  status: TaskStatus
  /**
   * Optional subtasks (shown when parent is in_progress or done)
   */
  subtasks?: Task[]
}

export interface TodosListProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Array of tasks to display
   */
  tasks: Task[]
  /**
   * Title for the todos list
   * @default "Tasks"
   */
  title?: string
}

/**
 * Get the status icon for a task
 */
function TaskIcon({status}: { status: TaskStatus }) {
  switch (status) {
    case 'done':
      return <CheckSquareIcon/>
    case 'in_progress':
      return <SquareLoaderIcon/>
    case 'cancelled':
      return <CrossSquareIcon variant="cancelled"/>
    case 'failed':
      return <CrossSquareIcon variant="failed"/>
    case 'pending':
    default:
      return <EmptySquareIcon/>
  }
}

/**
 * Sort tasks so cancelled and failed items appear at the bottom of their group.
 * This sorts in place within the local group, not globally.
 */
function sortTasks(tasks: Task[]): Task[] {
  const normal: Task[] = []
  const bottomItems: Task[] = []

  for (const task of tasks) {
    if (task.status === 'cancelled' || task.status === 'failed') {
      bottomItems.push(task)
    } else {
      normal.push(task)
    }
  }

  return [...normal, ...bottomItems]
}

/**
 * Single task item component
 */
function TaskItem({task, depth = 0}: { task: Task; depth?: number }) {
  const isTerminal = task.status === 'done' || task.status === 'cancelled' || task.status === 'failed'
  const isSubtle = task.status === 'cancelled' || task.status === 'failed'

  // Show subtasks when parent is in_progress or done (to keep showing after completion)
  const showSubtasks = (task.status === 'in_progress' || task.status === 'done') &&
    task.subtasks && task.subtasks.length > 0
  const sortedSubtasks = showSubtasks ? sortTasks(task.subtasks!) : []

  return (
    <div className="flex flex-col">
      <div
        className={cx(
          'flex items-center gap-2 py-1',
          depth > 0 && 'pl-6'
        )}
      >
        <TaskIcon status={task.status}/>
        <span
          className={cx(
            'text-xs leading-tight transition-colors',
            isTerminal && 'line-through',
            isSubtle ? 'text-silver/50' : 'text-silver',
            task.status === 'in_progress' && 'text-white',
            task.status === 'done' && 'text-silver/70'
          )}
        >
          {task.label}
          {task.status === 'cancelled' && (
            <span className="text-silver/40 ml-1">(cancelled)</span>
          )}
          {task.status === 'failed' && (
            <span className="text-error/60 ml-1">(failed)</span>
          )}
        </span>
      </div>

      {/* Render subtasks when parent is in_progress or done */}
      {showSubtasks && (
        <div className="flex flex-col">
          {sortedSubtasks.map((subtask) => (
            <TaskItem key={subtask.id} task={subtask} depth={depth + 1}/>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * TodosList displays a structured list of tasks with status indicators.
 *
 * Features:
 * - Nested tasks with indentation
 * - Status indicators: done (checkmark), in_progress (snake animation), pending (empty), cancelled, failed
 * - Done tasks are crossed out with golden checkmark
 * - Cancelled/failed tasks are crossed out with subtle styling and sorted to bottom of their local group
 * - Max 1/4 screen height with scroll
 * - Subtasks appear when parent task is in_progress or done
 *
 * The component automatically sorts cancelled/failed tasks to the bottom of their local group
 * (not globally), so just changing a task's status will reorder it appropriately.
 */
export const TodosList = React.forwardRef<HTMLDivElement, TodosListProps>(
  ({tasks, title = 'Tasks', className, ...rest}, ref) => {
    const sortedTasks = useMemo(() => sortTasks(tasks), [tasks])

    // Count completed tasks (recursively)
    const countCompleted = (taskList: Task[]): number => {
      let count = 0
      for (const task of taskList) {
        if (task.status === 'done') count++
        if (task.subtasks) count += countCompleted(task.subtasks)
      }
      return count
    }

    const countTotal = (taskList: Task[]): number => {
      let count = taskList.length
      for (const task of taskList) {
        if (task.subtasks) count += countTotal(task.subtasks)
      }
      return count
    }

    if (tasks.length === 0) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cx(
          'flex flex-col bg-charcoal/30 border-l border-ash/40',
          'overflow-hidden',
          className
        )}
        style={{maxHeight: '25vh'}}
        {...rest}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-ash/40 flex-shrink-0">
          <h4 className="text-xs font-medium text-white">{title}</h4>
          <span className="text-xs text-silver/60">
            {countCompleted(tasks)}/{countTotal(tasks)}
          </span>
        </div>

        {/* Tasks list */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {sortedTasks.map((task) => (
            <TaskItem key={task.id} task={task}/>
          ))}
        </div>
      </div>
    )
  }
)

TodosList.displayName = 'TodosList'

export default TodosList
