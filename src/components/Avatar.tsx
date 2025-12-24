import React from 'react'
import { cx } from '../utils/cx'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type AvatarStatus = 'online' | 'offline' | 'busy'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  name?: string
  size?: AvatarSize
  status?: AvatarStatus
}

const sizeMap: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-[11px]',
  md: 'h-10 w-10 text-xs',
  lg: 'h-12 w-12 text-sm',
  xl: 'h-16 w-16 text-base',
  '2xl': 'h-24 w-24 text-lg',
}

function initials(name?: string) {
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  return parts.slice(0, 2).map(p => p[0]!.toUpperCase()).join('')
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt = '', name, size = 'md', status, className, ...rest }, ref) => {
    const statusColor =
      status === 'online' ? 'bg-success' : status === 'busy' ? 'bg-warning' : 'bg-zinc'

    return (
      <div
        ref={ref}
        className={cx(
          'relative inline-flex items-center justify-center rounded-full border-2 border-ash bg-slate text-silver font-semibold select-none overflow-hidden',
          sizeMap[size],
          className
        )}
        {...rest}
      >
        {src ? (
          <img src={src} alt={alt || name || 'Avatar'} className="h-full w-full object-cover" />
        ) : (
          <span aria-hidden>{initials(name) || '·'}</span>
        )}
        {status && (
          <span
            className={cx(
              'absolute bottom-0 right-0 rounded-full ring-2 ring-charcoal',
              // 25% of avatar size
              size === 'xs' ? 'h-1.5 w-1.5' :
              size === 'sm' ? 'h-2 w-2' :
              size === 'md' ? 'h-2.5 w-2.5' :
              size === 'lg' ? 'h-3 w-3' :
              size === 'xl' ? 'h-4 w-4' : 'h-5 w-5',
              statusColor
            )}
          />
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

export default Avatar
