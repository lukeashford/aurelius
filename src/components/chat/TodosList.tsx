import React, {useMemo} from 'react'
import {cx} from '../../utils/cx'

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
   * Optional subtasks (only shown when parent is in_progress)
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
 * Snake loading animation component - a golden "snake" circling through a square
 */
function SnakeLoader({className}: { className?: string }) {
  return (
    <div className={cx('relative w-4 h-4 flex-shrink-0', className)}>
      <svg
        viewBox="0 0 16 16"
        className="w-full h-full animate-snake-spin"
      >
        {/* Square border path that the snake travels around */}
        <rect
          x="1"
          y="1"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-ash/40"
        />
        {/* The "snake" - an animated stroke */}
        <rect
          x="1"
          y="1"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="14 42"
          strokeLinecap="square"
          className="text-gold animate-snake-travel"
        />
      </svg>
    </div>
  )
}

/**
 * Checkmark icon inside a square
 */
function CheckmarkSquare({className}: { className?: string }) {
  return (
    <div className={cx(
      'relative w-4 h-4 flex-shrink-0 border-2 border-gold bg-gold/10',
      className
    )}>
      <svg
        viewBox="0 0 16 16"
        fill="none"
        className="absolute inset-0 w-full h-full p-0.5"
      >
        <path
          d="M3 8l3 3 7-7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gold"
        />
      </svg>
    </div>
  )
}

/**
 * Empty square for pending tasks
 */
function EmptySquare({className}: { className?: string }) {
  return (
    <div className={cx(
      'w-4 h-4 flex-shrink-0 border-2 border-ash/60',
      className
    )} />
  )
}

/**
 * Cancelled/Failed square (X mark)
 */
function CrossSquare({className, variant}: { className?: string; variant: 'cancelled' | 'failed' }) {
  return (
    <div className={cx(
      'relative w-4 h-4 flex-shrink-0 border-2',
      variant === 'failed' ? 'border-error/60 bg-error/5' : 'border-ash/40 bg-ash/5',
      className
    )}>
      <svg
        viewBox="0 0 16 16"
        fill="none"
        className="absolute inset-0 w-full h-full p-0.5"
      >
        <path
          d="M4 4l8 8M12 4l-8 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className={variant === 'failed' ? 'text-error/60' : 'text-ash/40'}
        />
      </svg>
    </div>
  )
}

/**
 * Get the status icon for a task
 */
function TaskIcon({status}: { status: TaskStatus }) {
  switch (status) {
    case 'done':
      return <CheckmarkSquare />
    case 'in_progress':
      return <SnakeLoader />
    case 'cancelled':
      return <CrossSquare variant="cancelled" />
    case 'failed':
      return <CrossSquare variant="failed" />
    case 'pending':
    default:
      return <EmptySquare />
  }
}

/**
 * Sort tasks so cancelled and failed items appear at the bottom of their group
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

  // Subtasks only show when parent is in_progress and has subtasks
  const showSubtasks = task.status === 'in_progress' && task.subtasks && task.subtasks.length > 0
  const sortedSubtasks = showSubtasks ? sortTasks(task.subtasks!) : []

  return (
    <div className="flex flex-col">
      <div
        className={cx(
          'flex items-center gap-2 py-1',
          depth > 0 && 'pl-6'
        )}
      >
        <TaskIcon status={task.status} />
        <span
          className={cx(
            'text-sm leading-tight transition-colors',
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

      {/* Render subtasks when parent is in_progress */}
      {showSubtasks && (
        <div className="flex flex-col">
          {sortedSubtasks.map((subtask) => (
            <TaskItem key={subtask.id} task={subtask} depth={depth + 1} />
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
 * - Cancelled/failed tasks are crossed out with subtle styling and sorted to bottom
 * - Max 1/4 screen height with scroll
 * - Subtasks only appear when parent task is in_progress
 */
export const TodosList = React.forwardRef<HTMLDivElement, TodosListProps>(
  ({tasks, title = 'Tasks', className, ...rest}, ref) => {
    const sortedTasks = useMemo(() => sortTasks(tasks), [tasks])

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
          <h4 className="text-sm font-medium text-white">{title}</h4>
          <span className="text-xs text-silver/60">
            {tasks.filter(t => t.status === 'done').length}/{tasks.length}
          </span>
        </div>

        {/* Tasks list */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {sortedTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      </div>
    )
  }
)

TodosList.displayName = 'TodosList'

export default TodosList
