import React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cx } from '../utils/cx'

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  /** Current page (1-indexed) */
  page: number
  /** Total number of pages */
  totalPages: number
  /** Callback when page changes */
  onPageChange: (page: number) => void
  /** Number of sibling pages to show */
  siblingCount?: number
  /** Show first/last page buttons */
  showEdges?: boolean
}

function generatePagination(
  currentPage: number,
  totalPages: number,
  siblingCount: number
): (number | 'ellipsis')[] {
  const totalSlots = siblingCount * 2 + 5 // siblings + current + 2 edges + 2 ellipses max

  if (totalPages <= totalSlots) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

  const showLeftEllipsis = leftSiblingIndex > 2
  const showRightEllipsis = rightSiblingIndex < totalPages - 1

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + 2 * siblingCount
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1)
    return [...leftRange, 'ellipsis', totalPages]
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = 3 + 2 * siblingCount
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1
    )
    return [1, 'ellipsis', ...rightRange]
  }

  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i
  )
  return [1, 'ellipsis', ...middleRange, 'ellipsis', totalPages]
}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      page,
      totalPages,
      onPageChange,
      siblingCount = 1,
      showEdges = true,
      className,
      ...props
    },
    ref
  ) => {
    const pages = generatePagination(page, totalPages, siblingCount)

    const buttonBaseClass =
      'flex items-center justify-center h-8 min-w-8 px-2 text-sm ' +
      'border border-ash transition-colors duration-fast ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold'

    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label="Pagination"
        className={cx('flex items-center gap-1', className)}
        {...props}
      >
        {/* Previous button */}
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Go to previous page"
          className={cx(
            buttonBaseClass,
            'text-silver hover:text-white hover:border-gold',
            page <= 1 && 'opacity-50 cursor-not-allowed hover:border-ash'
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page numbers */}
        {pages.map((pageNum, index) =>
          pageNum === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className="flex items-center justify-center h-8 w-8 text-silver"
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          ) : (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              aria-label={`Go to page ${pageNum}`}
              aria-current={page === pageNum ? 'page' : undefined}
              className={cx(
                buttonBaseClass,
                page === pageNum
                  ? 'bg-gold text-obsidian border-gold font-medium'
                  : 'text-silver hover:text-white hover:border-gold'
              )}
            >
              {pageNum}
            </button>
          )
        )}

        {/* Next button */}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Go to next page"
          className={cx(
            buttonBaseClass,
            'text-silver hover:text-white hover:border-gold',
            page >= totalPages && 'opacity-50 cursor-not-allowed hover:border-ash'
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    )
  }
)

Pagination.displayName = 'Pagination'
