import React from 'react'
import {MarkdownContent, MentionChip} from '@lukeashford/aurelius'
import Section from './Section'

const exampleContent = `## Styled text example

You can drop in markdown with **bold**, *italic*, [links](https://example.com), and
\`inline code\` and it will render with consistent design-system typography.

\`\`\`js
// Code block example
function greet(name) {
  return \`Hello, \${name}\`
}
\`\`\`

- Clean spacing
- Readable defaults
- GitHub-flavoured features (tables, task lists, strikethrough)

| Column A | Column B |
| --- | --- |
| Cell 1 | Cell 2 |

- [x] Done task
- [ ] Pending task
`

const mentionContent = `Reference an artifact inline like @hero_pose, or **emphasised inside
formatting like @villain_pose** — the chip survives the surrounding markdown. Inside a
\`code span like @ignored\` the pattern stays literal.

Mentions also work in lists:

1. Look at @hero_pose
2. Then @villain_pose
3. Compare with @sidekick_pose`

export default function MarkdownContentSection() {
  return (
      <Section title="Markdown Content"
               subtitle="Markdown rendered into a real React tree via react-markdown.">
        <div className="space-y-10">
          <div>
            <h3 className="text-sm uppercase tracking-wider text-silver mb-3">Default prose</h3>
            <MarkdownContent content={exampleContent}/>
          </div>
          <div>
            <h3 className="text-sm uppercase tracking-wider text-silver mb-3">
              With mentionRenderer
            </h3>
            <MarkdownContent
                content={mentionContent}
                mentionRenderer={(name) =>
                    <MentionChip name={name}
                                 onClick={() => alert(`Open artifact: ${name}`)}/>}
            />
          </div>
          <div>
            <h3 className="text-sm uppercase tracking-wider text-silver mb-3">
              Plain text (isMarkdown=false)
            </h3>
            <MarkdownContent
                isMarkdown={false}
                content={'Plain text artifact body.\nNewlines preserved.\nNo **markdown** parsing.'}
            />
          </div>
        </div>
      </Section>
  )
}
