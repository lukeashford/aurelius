import React from 'react'
import { cx } from '../utils/cx'

// Table container
export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /** Make the table horizontally scrollable */
  responsive?: boolean
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ responsive = true, className, children, ...props }, ref) => {
    const table = (
      <table
        ref={ref}
        className={cx('w-full text-sm', className)}
        {...props}
      >
        {children}
      </table>
    )

    if (responsive) {
      return <div className="w-full overflow-x-auto">{table}</div>
    }

    return table
  }
)

Table.displayName = 'Table'

// Table header
export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <thead
      ref={ref}
      className={cx('bg-graphite', className)}
      {...props}
    >
      {children}
    </thead>
  )
)

TableHeader.displayName = 'TableHeader'

// Table body
export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, children, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cx('divide-y divide-ash', className)}
      {...props}
    >
      {children}
    </tbody>
  )
)

TableBody.displayName = 'TableBody'

// Table footer
export interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, children, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cx('bg-graphite font-medium', className)}
      {...props}
    >
      {children}
    </tfoot>
  )
)

TableFooter.displayName = 'TableFooter'

// Table row
export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** Highlight row on hover */
  hoverable?: boolean
  /** Show selected state */
  selected?: boolean
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ hoverable = true, selected = false, className, children, ...props }, ref) => (
    <tr
      ref={ref}
      className={cx(
        'transition-colors duration-fast',
        hoverable && 'hover:bg-graphite/50',
        selected && 'bg-gold/10',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  )
)

TableRow.displayName = 'TableRow'

// Table header cell
export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Enable sorting indicator */
  sortable?: boolean
  /** Current sort direction */
  sortDirection?: 'asc' | 'desc' | null
}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ sortable, sortDirection, className, children, ...props }, ref) => (
    <th
      ref={ref}
      className={cx(
        'px-4 py-3 text-left font-semibold text-silver',
        sortable && 'cursor-pointer hover:text-white select-none',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortable && sortDirection && (
          <span className="text-gold">
            {sortDirection === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  )
)

TableHead.displayName = 'TableHead'

// Table data cell
export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, children, ...props }, ref) => (
    <td
      ref={ref}
      className={cx('px-4 py-3 text-white', className)}
      {...props}
    >
      {children}
    </td>
  )
)

TableCell.displayName = 'TableCell'

// Table caption
export interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {}

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, children, ...props }, ref) => (
    <caption
      ref={ref}
      className={cx('mt-4 text-sm text-silver', className)}
      {...props}
    >
      {children}
    </caption>
  )
)

TableCaption.displayName = 'TableCaption'
