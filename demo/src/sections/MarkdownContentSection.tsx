import React from 'react'
import {MarkdownContent} from '@lukeashford/aurelius'
import Section from './Section'

const exampleContent = `
<h2>Styled text example</h2>
<p>
  You can drop in content with <strong>bold</strong>, <em>italic</em>, <a href="#demo">links</a>, and
  <code>inline code</code> and it will render with consistent design-system typography.
</p>
<pre><code>// Code block example 
function greet(name) { 
   return "Hello, ${name} 
}
</code></pre>
<ul>
  <li>Clean spacing</li>
  <li>Readable defaults</li>
</ul>
`

export default function MarkdownContentSection() {
  return (
      <Section title="Markdown Content" subtitle="Styled container for rich text content.">
        <div className="space-y-8">
          <div>
            <MarkdownContent content={exampleContent}/>
          </div>
        </div>
      </Section>
  )
}
