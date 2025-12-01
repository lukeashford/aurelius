import React from 'react'
import {Button, Card} from '@lukeashford/aurelius'

export default function DirectorNote() {
  return (
      <div className="space-y-6">
        <header className="section-header">
          <h2 className="text-2xl">Director's Note</h2>
          <p className="text-silver">A word on the philosophy and usage of this system.</p>
        </header>

        <Card variant="featured" className="p-8">
          <div className="space-y-4 text-silver leading-relaxed">
            <p>
              Aurelius blends technical precision with a cinematic aesthetic, relying on deep
              blacks, rich golds, and refined typography to convey stability, trust, and quiet
              luxury.
            </p>

            <h3 className="text-lg font-semibold text-white mt-6 mb-2">Optimized for AIX</h3>
            <p>
              This entire system is optimized for AI Experience (AIX), not just human Developer
              Experience (DX).
              You won't find copy-paste code examples here. Instead, you can instruct your AI agent
              to use specific
              variants in plain human terms.
            </p>
            <p>
              By using the prompt from the README, your agent accesses <code
                className="text-gold bg-charcoal px-1 rounded">dist/llms.md</code>—a file
              specifically designed to give the agent all the context it needs to implement these
              components
              correctly. If you really need to see the code, you can check the source of this demo
              page
              in the repository.
            </p>
            <div className="mt-8">
              <a href="https://lukeashford.com" target="_blank" rel="noopener noreferrer">
                <Button variant="primary">Meet the Creator</Button>
              </a>
            </div>
          </div>
        </Card>
      </div>
  )
}
