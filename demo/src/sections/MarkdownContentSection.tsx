import React from 'react'
import {MarkdownContent} from '@lukeashford/aurelius'

export default function MarkdownContentSection() {
  return (
      <div>
        <header className="section-header">
          <h2 className="text-2xl">Markdown Content</h2>
          <p className="text-silver">Styled container for markdown-like content with consistent
            typography.</p>
        </header>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Example Content</h3>
            <MarkdownContent>
              <h1>Main Heading</h1>
              <p>
                This is a paragraph with <strong>bold text</strong> and <em>italic text</em>. It
                demonstrates
                how the MarkdownContent component styles various text elements consistently with the
                design
                system.
              </p>

              <h2>Secondary Heading</h2>
              <p>
                Here's a paragraph with a <a href="#markdown">link example</a>. Links are styled
                with the
                gold accent color and include hover effects.
              </p>

              <h3>Tertiary Heading</h3>
              <ul>
                <li>First list item with some content</li>
                <li>Second list item with more details</li>
                <li>Third list item to show spacing</li>
              </ul>

              <h4>Quaternary Heading</h4>
              <ol>
                <li>Numbered list item one</li>
                <li>Numbered list item two</li>
                <li>Numbered list item three</li>
              </ol>

              <h5>Fifth Level Heading</h5>
              <p>
                Inline code looks like this: <code>const example = true</code>. It uses a monospace
                font
                and is styled to stand out from regular text.
              </p>

              <h6>Sixth Level Heading</h6>
              <blockquote>
                This is a blockquote. It's styled with a left border and italic text to distinguish
                quoted content from the main text.
              </blockquote>

              <pre><code>// Code block example
function greet(name) {'{'}
                return `Hello, ${'{'}name{'}'}`
                {'}'}</code></pre>
            </MarkdownContent>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Nested Content</h3>
            <MarkdownContent>
              <h2>Complex Example</h2>
              <p>
                The MarkdownContent component handles nested structures well:
              </p>
              <ul>
                <li>
                  <strong>Lists with formatting</strong>
                  <ul>
                    <li>Nested list item one</li>
                    <li>Nested list item two with <code>inline code</code></li>
                  </ul>
                </li>
                <li>
                  <strong>Mixed content</strong>
                  <p>Paragraphs within list items work seamlessly.</p>
                </li>
              </ul>
            </MarkdownContent>
          </div>
        </div>
      </div>
  )
}
