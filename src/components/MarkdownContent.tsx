import React, {useMemo} from 'react'
import DOMPurify, {type Config} from 'dompurify'
import {marked} from 'marked'
import {cx} from '../utils'

// Register the link-hardening hook once at module load. Hooks are global on
// DOMPurify, so calling addHook in render would attach a duplicate every pass.
if (typeof window !== 'undefined' && typeof DOMPurify.addHook === 'function') {
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      node.setAttribute('target', '_blank')
      node.setAttribute('rel', 'noopener noreferrer')
    }
  })
}

export interface MarkdownContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Content to display (can be Markdown or HTML)
   */
  content: string
  /**
   * Whether the content should be treated as Markdown
   * @default true
   */
  isMarkdown?: boolean
  sanitizeConfig?: Config
  /**
   * When true, injects a streaming cursor at the end of the content
   */
  isStreaming?: boolean
  /**
   * Additional classes for the streaming cursor
   */
  cursorClassName?: string
}

const DEFAULT_SANITIZE_CONFIG: Config = {
  ALLOWED_TAGS: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'del', 'ins',
    'sup', 'sub', 'mark', 'small',
    'ul', 'ol', 'li',
    'a',
    'code', 'pre', 'kbd', 'samp', 'var',
    'blockquote', 'q', 'cite', 'abbr',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
    'div', 'span', 'details', 'summary',
  ],
  ALLOWED_ATTR: [
    'href', 'title', 'target', 'rel',
    'class', 'id',
    'colspan', 'rowspan', 'scope',
    'open',
  ],
  ADD_ATTR: ['target', 'rel'],
  ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
}

const CURSOR_BASE_CLASSES = 'inline-block bg-current animate-cursor-blink w-0.5 h-cursor translate-y-cursor-offset'

/**
 * Injects a streaming cursor at the end of the HTML content.
 * Finds the deepest last element and appends the cursor inside it.
 */
function injectStreamingCursor(html: string, cursorClassName?: string): string {
  if (!html.trim()) {
    // Empty content - just return the cursor
    return `<span class="${cx(CURSOR_BASE_CLASSES, cursorClassName)}" aria-hidden="true"></span>`
  }

  const cursorHtml = `<span class="${cx(CURSOR_BASE_CLASSES,
      cursorClassName)}" aria-hidden="true"></span>`

  // Parse the HTML to find the right injection point
  // Fallback for SSR/Node environment where DOMParser is not available
  if (typeof DOMParser === 'undefined') {
    return html + cursorHtml
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html')
  const container = doc.body.firstChild as HTMLElement

  if (!container) {
    return html + cursorHtml
  }

  // Find the deepest last element to append the cursor to
  let target: Element = container
  while (target.lastElementChild) {
    const lastChild = target.lastElementChild
    // Stop at inline elements or elements that shouldn't have block children
    const tagName = lastChild.tagName.toLowerCase()
    if (['code', 'a', 'strong', 'em', 'b', 'i', 'span', 'mark', 'del', 's'].includes(tagName)) {
      break
    }
    target = lastChild
  }

  // Append cursor to the target element
  target.insertAdjacentHTML('beforeend', cursorHtml)

  // Return the inner HTML (excluding our wrapper div)
  return container.innerHTML
}

export const MarkdownContent = React.forwardRef<HTMLDivElement, MarkdownContentProps>(
    ({className, content, isMarkdown = true, sanitizeConfig, isStreaming, cursorClassName, ...rest},
        ref) => {
      const sanitizedHtml = useMemo(() => {
        if (!content && !isStreaming) {
          return ''
        }
        const config = sanitizeConfig ?? DEFAULT_SANITIZE_CONFIG

        // Convert markdown to HTML if requested. The fallback (raw `content`)
        // is still passed through DOMPurify below, so a parser failure can't
        // bypass sanitization.
        let htmlContent: string
        if (isMarkdown) {
          try {
            htmlContent = marked.parse(content) as string
          } catch (e) {
            console.error('Error parsing markdown:', e)
            htmlContent = content
          }
        } else {
          htmlContent = content
        }

        const sanitized = (htmlContent && typeof DOMPurify.sanitize === 'function')
            ? DOMPurify.sanitize(htmlContent, config)
            : (htmlContent || '')

        if (isStreaming) {
          return injectStreamingCursor(sanitized, cursorClassName)
        }

        return sanitized
      }, [content, isMarkdown, sanitizeConfig, isStreaming, cursorClassName])

      return (
          <div
              ref={ref}
              className={cx('prose', className)}
              dangerouslySetInnerHTML={{__html: sanitizedHtml}}
              {...rest}
          />
      )
    }
)

MarkdownContent.displayName = 'MarkdownContent'

export default MarkdownContent