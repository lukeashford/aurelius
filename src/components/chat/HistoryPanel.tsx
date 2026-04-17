import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {cx} from '../../utils'
import {PlusIcon} from '../icons'
import type {Conversation} from './ChatInterface'

export interface HistoryPanelProps {
  /**
   * List of past conversations to display.
   */
  conversations: Conversation[]
  /**
   * Called when a conversation is selected.
   */
  onSelectConversation?: (id: string) => void
  /**
   * Called when the "New Chat" button is clicked.
   */
  onNewChat?: () => void
  /**
   * Called when a conversation's title is edited.
   */
  onRenameConversation?: (id: string, newTitle: string) => void
}

type ConversationGroup = {
  key: 'today' | 'yesterday' | 'older'
  label: string
  conversations: Conversation[]
}

function parseTimestamp(ts: Conversation['timestamp']): Date | null {
  if (ts == null) {
    return null
  }
  const d = ts instanceof Date ? ts : new Date(ts)
  return Number.isNaN(d.getTime()) ? null : d
}

function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function groupConversations(conversations: Conversation[]): ConversationGroup[] {
  const today = startOfDay(new Date())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const todayList: Conversation[] = []
  const yesterdayList: Conversation[] = []
  const olderList: Conversation[] = []

  for (const c of conversations) {
    const d = parseTimestamp(c.timestamp)
    if (d && d >= today) {
      todayList.push(c)
    } else if (d && d >= yesterday) {
      yesterdayList.push(c)
    } else {
      olderList.push(c)
    }
  }

  return [
    {key: 'today', label: 'Today', conversations: todayList},
    {key: 'yesterday', label: 'Yesterday', conversations: yesterdayList},
    {key: 'older', label: 'Older', conversations: olderList},
  ].filter((g) => g.conversations.length > 0) as ConversationGroup[]
}

function ChevronDownIcon({className}: { className?: string }) {
  return (
      <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={className}
          aria-hidden="true"
      >
        <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
        />
      </svg>
  )
}

function PencilIcon({className}: { className?: string }) {
  return (
      <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={className}
          aria-hidden="true"
      >
        <path
            d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
      </svg>
  )
}

function ProjectFilter({
  projects,
  value,
  onChange,
  className,
}: {
  projects: string[]
  value: string | null
  onChange: (project: string | null) => void
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const label = value ?? 'All projects'

  return (
      <div className={cx('relative min-w-0', className)} ref={ref}>
        <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={open}
            className={cx(
                'w-full flex items-center justify-between gap-1 px-2 py-1.5',
                'bg-obsidian/60 hover:bg-ash/30',
                'text-silver hover:text-white',
                'border border-ash/40',
                'text-xs',
                'transition-colors duration-150 min-w-0'
            )}
        >
          <span className="truncate">{label}</span>
          <ChevronDownIcon className="w-3 h-3 shrink-0"/>
        </button>
        {open && (
            <div
                role="listbox"
                className={cx(
                    'absolute top-full left-0 right-0 mt-1 z-20',
                    'bg-charcoal border border-ash/40',
                    'max-h-60 overflow-y-auto'
                )}
            >
              <button
                  type="button"
                  role="option"
                  aria-selected={value === null}
                  onClick={() => {
                    onChange(null)
                    setOpen(false)
                  }}
                  className={cx(
                      'w-full px-2 py-1.5 text-left text-xs truncate',
                      'transition-colors duration-150',
                      value === null
                          ? 'bg-gold/10 text-gold'
                          : 'text-silver hover:bg-ash/20 hover:text-white'
                  )}
              >
                All projects
              </button>
              {projects.map((p) => (
                  <button
                      key={p}
                      type="button"
                      role="option"
                      aria-selected={value === p}
                      onClick={() => {
                        onChange(p)
                        setOpen(false)
                      }}
                      className={cx(
                          'w-full px-2 py-1.5 text-left text-xs truncate',
                          'transition-colors duration-150',
                          value === p
                              ? 'bg-gold/10 text-gold'
                              : 'text-silver hover:bg-ash/20 hover:text-white'
                      )}
                  >
                    {p}
                  </button>
              ))}
            </div>
        )}
      </div>
  )
}

function ConversationRow({
  conversation,
  onSelect,
  onRename,
}: {
  conversation: Conversation
  onSelect?: (id: string) => void
  onRename?: (id: string, newTitle: string) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(conversation.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const startEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setDraft(conversation.title)
    setIsEditing(true)
  }, [conversation.title])

  const commit = useCallback(() => {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== conversation.title) {
      onRename?.(conversation.id, trimmed)
    }
    setIsEditing(false)
  }, [draft, conversation.id, conversation.title, onRename])

  const cancel = useCallback(() => {
    setDraft(conversation.title)
    setIsEditing(false)
  }, [conversation.title])

  if (isEditing) {
    return (
        <div
            className={cx(
                'w-full px-3 py-2',
                conversation.isActive ? 'bg-ash/40' : 'bg-ash/20'
            )}
        >
          <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  commit()
                } else if (e.key === 'Escape') {
                  e.preventDefault()
                  cancel()
                }
              }}
              className={cx(
                  'w-full px-2 py-1 text-sm font-medium text-white',
                  'bg-obsidian border border-gold/40',
                  'outline-none focus:border-gold'
              )}
              aria-label="Conversation title"
          />
          {conversation.project && (
              <p className="text-xs text-silver/60 truncate mt-1">
                {conversation.project}
              </p>
          )}
        </div>
    )
  }

  return (
      <div className="relative group">
        <button
            onClick={() => onSelect?.(conversation.id)}
            className={cx(
                'w-full px-3 py-2 text-left',
                'transition-colors duration-150',
                conversation.isActive
                    ? 'bg-ash/40 text-white'
                    : 'text-silver hover:bg-ash/20 hover:text-white'
            )}
        >
          <p
              className={cx(
                  'text-sm font-medium truncate',
                  onRename ? 'pr-6' : ''
              )}
          >
            {conversation.title}
          </p>
          {conversation.project && (
              <p className="text-xs text-silver/60 truncate mt-0.5">
                {conversation.project}
              </p>
          )}
        </button>
        {onRename && (
            <button
                type="button"
                onClick={startEdit}
                aria-label="Rename conversation"
                className={cx(
                    'absolute right-2 top-2',
                    'p-1 text-silver/60 hover:text-gold hover:bg-ash/40',
                    'opacity-0 group-hover:opacity-100 focus:opacity-100',
                    'transition-opacity duration-150'
                )}
            >
              <PencilIcon className="w-3.5 h-3.5"/>
            </button>
        )}
      </div>
  )
}

/**
 * HistoryPanel renders the conversation history sidebar: a project filter,
 * a "New Chat" button, and the conversation list grouped by recency
 * (Today / Yesterday / Older). Each row shows the title and an optional
 * project subtitle, and exposes an inline rename affordance on hover.
 */
export function HistoryPanel({
  conversations,
  onSelectConversation,
  onNewChat,
  onRenameConversation,
}: HistoryPanelProps) {
  const [projectFilter, setProjectFilter] = useState<string | null>(null)

  const projects = useMemo(() => {
    const set = new Set<string>()
    for (const c of conversations) {
      if (c.project) {
        set.add(c.project)
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [conversations])

  useEffect(() => {
    if (projectFilter && !projects.includes(projectFilter)) {
      setProjectFilter(null)
    }
  }, [projects, projectFilter])

  const filteredConversations = useMemo(() => {
    if (!projectFilter) {
      return conversations
    }
    return conversations.filter((c) => c.project === projectFilter)
  }, [conversations, projectFilter])

  const groups = useMemo(
      () => groupConversations(filteredConversations),
      [filteredConversations]
  )

  const hasFilter = projects.length > 0

  return (
      <div className="h-full flex flex-col">
        <div className="px-4 py-3 border-b border-ash/40 shrink-0 flex items-center gap-2">
          <h3 className="text-xs font-medium text-white shrink-0">History</h3>
          {(hasFilter || onNewChat) && (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {hasFilter && (
                    <>
                      <div className="w-px h-3 bg-ash/40 shrink-0 mx-1"/>
                      <ProjectFilter
                          projects={projects}
                          value={projectFilter}
                          onChange={setProjectFilter}
                          className="flex-1"
                      />
                    </>
                )}
                {onNewChat && (
                    <>
                      <div className="w-px h-3 bg-ash/40 shrink-0 mx-1"/>
                      <button
                          onClick={onNewChat}
                          className={cx(
                              'flex items-center gap-1 px-2.5 py-1.5 shrink-0',
                              'bg-gold/10 hover:bg-gold/20 text-gold',
                              'border border-gold/30',
                              'text-xs font-medium',
                              'transition-colors duration-200'
                          )}
                      >
                        <PlusIcon className="w-4 h-4"/>
                        <span className="truncate">New Chat</span>
                      </button>
                    </>
                )}
              </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {conversations.length === 0 ? (
              <p className="px-4 py-2 text-xs text-silver/60">No conversations yet</p>
          ) : groups.length === 0 ? (
              <p className="px-4 py-2 text-xs text-silver/60">No conversations match this filter</p>
          ) : (
              <div>
                {groups.map((group, index) => (
                    <section key={group.key} className={cx(index > 0 && 'mt-3')}>
                      <div className="flex items-center gap-2 px-3 pb-2">
                        <span
                            className="text-xs font-medium uppercase tracking-wider text-gold/70">
                          {group.label}
                        </span>
                        <div className="flex-1 h-px bg-gold/20"/>
                      </div>
                      <div className="space-y-1 px-2">
                        {group.conversations.map((conversation) => (
                            <ConversationRow
                                key={conversation.id}
                                conversation={conversation}
                                onSelect={onSelectConversation}
                                onRename={onRenameConversation}
                            />
                        ))}
                      </div>
                    </section>
                ))}
              </div>
          )}
        </div>
      </div>
  )
}
