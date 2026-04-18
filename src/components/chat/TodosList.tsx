import React, {useCallback, useMemo, useState} from 'react'
import {Loader2, Square} from 'lucide-react'
import {cx} from '../../utils'
import {CheckSquareIcon, CrossSquareIcon, EmptySquareIcon, SquareLoaderIcon,} from '../icons'

export const TASK_STATUSES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
  CANCELLED: 'cancelled',
  FAILED: 'failed',
} as const

export type TaskStatus = typeof TASK_STATUSES[keyof typeof TASK_STATUSES]

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
  /**
   * Called when the "Stop All Tasks" button is clicked.
   * Only shown when at least one task is in_progress.
   * The consumer decides what stopping means (cancel API calls, mark cancelled, etc.).
   *
   * May return a Promise. While the Promise is pending, the button becomes
   * disabled and displays a spinner with "Stopping tasks" to give the user
   * feedback that the stop request is in flight.
   */
  onStopAllTasks?: () => void | Promise<void>
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
  const isTerminal = task.status === 'done' || task.status === 'cancelled' || task.status
      === 'failed'
  const isSubtle = task.status === 'cancelled' || task.status === 'failed'

  // Always show subtasks if they exist
  const showSubtasks = task.subtasks && task.subtasks.length > 0
  const sortedSubtasks = showSubtasks ? sortTasks(task.subtasks!) : []

  return (
      <div className="flex flex-col">
        <div
            className="flex items-center gap-2 py-1"
            style={{paddingLeft: `${depth * 1.5}rem`}}
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

        {/* Render subtasks if they exist */}
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
 * - Status indicators: done (checkmark), in_progress (snake animation), pending (empty),
 * cancelled, failed
 * - Done tasks are crossed out with golden checkmark
 * - Cancelled/failed tasks are crossed out with subtle styling and sorted to bottom of their local
 * group
 * - Max 1/4 screen height with scroll
 * - Subtasks appear when parent task is in_progress or done
 *
 * The component automatically sorts cancelled/failed tasks to the bottom of their local group
 * (not globally), so just changing a task's status will reorder it appropriately.
 */
/**
 * Returns true when any task (or subtask, recursively) has in_progress status.
 */
function hasInProgressTask(tasks: Task[]): boolean {
  return tasks.some(t => {
    if (t.status === 'in_progress') {
      return true
    }
    if (t.subtasks && t.subtasks.length > 0) {
      return hasInProgressTask(t.subtasks)
    }
    return false
  })
}

export const TodosList = React.forwardRef<HTMLDivElement, TodosListProps>(
    ({tasks, title = 'Tasks', onStopAllTasks, className, ...rest}, ref) => {
      const sortedTasks = useMemo(() => sortTasks(tasks), [tasks])
      const [isStopping, setIsStopping] = useState(false)

      const handleStopClick = useCallback(async () => {
        if (!onStopAllTasks || isStopping) {
          return
        }
        try {
          setIsStopping(true)
          await onStopAllTasks()
        } finally {
          setIsStopping(false)
        }
      }, [onStopAllTasks, isStopping])

      // Count completed top-level tasks
      const countCompleted = (taskList: Task[]): number => {
        return taskList.filter(task => task.status === 'done').length
      }

      const countTotal = (taskList: Task[]): number => {
        return taskList.length
      }

      // Keep the button mounted while a stop is in flight, even if tasks have
      // already flipped out of in_progress synchronously.
      const showStopButton = !!onStopAllTasks && (hasInProgressTask(tasks) || isStopping)

      if (tasks.length === 0) {
        return null
      }

      return (
          <div
              ref={ref}
              className={cx(
                  'flex flex-col h-full',
                  'overflow-hidden',
                  className
              )}
              {...rest}
          >
            {/* Header */}
            <div
                className="flex items-center justify-between px-4 py-2 border-b border-ash/40 flex-shrink-0">
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

            {/* Stop All Tasks button */}
            {showStopButton && (
                <div className="px-4 py-2 border-t border-ash/40 flex-shrink-0">
                  <button
                      type="button"
                      onClick={handleStopClick}
                      disabled={isStopping}
                      aria-busy={isStopping}
                      aria-label={isStopping ? 'Stopping tasks' : 'Stop all tasks'}
                      className={cx(
                          'w-full flex items-center justify-center gap-2 px-3 py-1.5',
                          'bg-error/10 text-error',
                          'border border-error/30',
                          'text-xs font-medium',
                          'transition-colors duration-200',
                          isStopping
                              ? 'cursor-not-allowed opacity-70'
                              : 'hover:bg-error/20'
                      )}
                  >
                    {isStopping ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin"/>
                          Stopping tasks
                        </>
                    ) : (
                        <>
                          <Square className="w-3 h-3 fill-current"/>
                          Stop All Tasks
                        </>
                    )}
                  </button>
                </div>
            )}
          </div>
      )
    }
)

TodosList.displayName = 'TodosList'

/**
 * Returns true when every task (and subtask, recursively) is in a
 * terminal state: done, cancelled, or failed. Returns true for empty arrays.
 */
export function areAllTasksSettled(tasks: Task[]): boolean {
  return tasks.every(t => {
    const settled = t.status === 'done' || t.status === 'cancelled' || t.status === 'failed'
    if (!settled) {
      return false
    }
    if (t.subtasks && t.subtasks.length > 0) {
      return areAllTasksSettled(t.subtasks)
    }
    return true
  })
}

export default TodosList
