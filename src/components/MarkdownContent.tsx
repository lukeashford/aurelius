// MarkdownContent.tsx
import React, {useMemo} from 'react'
import DOMPurify, {type Config} from 'dompurify'

export interface MarkdownContentProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string
  sanitizeConfig?: Config
}

function cx(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
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

function useDOMPurifySetup() {
  useMemo(() => {
    DOMPurify.addHook('afterSanitizeAttributes', (node) => {
      if (node.tagName === 'A') {
        node.setAttribute('target', '_blank')
        node.setAttribute('rel', 'noopener noreferrer')
      }
    })
  }, [])
}

export const MarkdownContent = React.forwardRef<HTMLDivElement, MarkdownContentProps>(
    ({className, content, sanitizeConfig, ...rest}, ref) => {
      useDOMPurifySetup()

      const sanitizedHtml = useMemo(() => {
        if (!content) {
          return ''
        }
        const config = sanitizeConfig ?? DEFAULT_SANITIZE_CONFIG
        return DOMPurify.sanitize(content, config)
      }, [content, sanitizeConfig])

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