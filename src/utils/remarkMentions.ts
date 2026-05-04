import {visit} from 'unist-util-visit'
import type {Root, Text, PhrasingContent} from 'mdast'

const MENTION_PATTERN = /(?<!\w)@(\w+)/g

/**
 * Custom mdast node emitted for `@artifact_name` mentions. Map this to a renderer via the
 * `components` prop on `<ReactMarkdown>` (or `mentionRenderer` on `<MarkdownContent>`):
 * `{ mention: ({ name }) => <MyChip name={name} /> }`.
 */
export interface MentionNode {
  type: 'mention'
  name: string
  data?: {
    hName: string
    hProperties: { name: string }
  }
}

declare module 'mdast' {
  interface PhrasingContentMap {
    mention: MentionNode
  }
  interface RootContentMap {
    mention: MentionNode
  }
}

/**
 * Remark plugin that walks text nodes in the markdown AST and splits any `@artifact_name`
 * runs into a custom `mention` node. Patterns inside fenced or inline code are left
 * untouched because the markdown AST already isolates code from prose. The plugin emits
 * `data.hName = 'mention'` so rehype maps it to a custom React component.
 */
export function remarkMentions() {
  return (tree: Root) => {
    visit(tree, 'text', (node: Text, index, parent) => {
      if (!parent || index == null) {
        return
      }
      const {value} = node
      const matches = [...value.matchAll(MENTION_PATTERN)]
      if (matches.length === 0) {
        return
      }

      const replacement: PhrasingContent[] = []
      let lastEnd = 0
      for (const match of matches) {
        if (match.index > lastEnd) {
          replacement.push({type: 'text', value: value.slice(lastEnd, match.index)})
        }
        const name = match[1]
        replacement.push({
          type: 'mention',
          name,
          data: {hName: 'mention', hProperties: {name}},
        })
        lastEnd = match.index + match[0].length
      }
      if (lastEnd < value.length) {
        replacement.push({type: 'text', value: value.slice(lastEnd)})
      }

      parent.children.splice(index, 1, ...replacement)
      return index + replacement.length
    })
  }
}
