import React from 'react'
import ReactMarkdown, {type Components} from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {cx} from '../utils'
import {remarkMentions} from '../utils/remarkMentions'

export interface MarkdownContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Content to display. Markdown by default; pass `isMarkdown={false}` for literal display
   * of plain text (preserves whitespace, no parsing).
   */
  content: string
  /**
   * Whether the content should be parsed as Markdown. `false` renders the string verbatim
   * inside a `whitespace-pre-wrap` block — useful for plain-text artifacts.
   * @default true
   */
  isMarkdown?: boolean
  /**
   * When true, injects a streaming cursor at the end of the rendered content.
   */
  isStreaming?: boolean
  /**
   * Additional classes for the streaming cursor.
   */
  cursorClassName?: string
  /**
   * When set, the renderer recognises `@artifact_name` mentions in prose (anywhere except
   * inside code spans / blocks) and replaces each with the React node returned by this
   * callback. Typical wiring is `(name) => <MentionChip name={name} onClick={...} />`,
   * giving each chip a real per-call-site click handler.
   *
   * Without this prop, mentions render as literal `@name` text.
   */
  mentionRenderer?: (name: string) => React.ReactNode
}

const CURSOR_BASE_CLASSES = 'inline-block bg-current animate-cursor-blink w-0.5 h-cursor '
    + 'translate-y-cursor-offset'

/**
 * Renders Markdown content into a real React tree via `react-markdown`. Drop-in for prose
 * surfaces (chat messages, artifact bodies, deliverable text). Optional `mentionRenderer`
 * adds inline `@artifact_name` chip rendering — see prop docs.
 *
 * Raw HTML in the source is escaped (not rendered) by react-markdown's defaults; this is
 * intentional and safer than the previous pipeline. Pass markdown.
 */
export const MarkdownContent = React.forwardRef<HTMLDivElement, MarkdownContentProps>(
    ({className, content, isMarkdown = true, isStreaming, cursorClassName,
       mentionRenderer, ...rest}, ref) => {
      if (!isMarkdown) {
        return (
            <div ref={ref} className={cx('prose whitespace-pre-wrap', className)} {...rest}>
              {content}
              {isStreaming && (
                  <span aria-hidden="true"
                        className={cx(CURSOR_BASE_CLASSES, cursorClassName)}/>
              )}
            </div>
        )
      }

      // `mention` isn't a known IntrinsicElement, but react-markdown looks tagNames up
      // by string in `components`, so a dedicated record keeps the typing honest without
      // forcing a cast on the whole `components` object.
      const components: Components & {mention?: React.ComponentType<{name: string}>} = {
        // Harden external links so user-authored URLs don't open in the same tab
        // and can't reach `window.opener`.
        a: ({href, children}) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
        ),
        ...(mentionRenderer && {
          mention: ({name}) => <>{mentionRenderer(name)}</>,
        }),
      }

      const remarkPlugins = mentionRenderer ? [remarkGfm, remarkMentions] : [remarkGfm]

      return (
          <div ref={ref} className={cx('prose', className)} {...rest}>
            <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
              {content}
            </ReactMarkdown>
            {isStreaming && (
                <span aria-hidden="true"
                      className={cx(CURSOR_BASE_CLASSES, cursorClassName)}/>
            )}
          </div>
      )
    }
)

MarkdownContent.displayName = 'MarkdownContent'

export default MarkdownContent
