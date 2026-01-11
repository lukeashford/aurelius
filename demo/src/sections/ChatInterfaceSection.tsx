import React from 'react'
import {Badge, Button, Card} from '@lukeashford/aurelius'

export default function ChatInterfaceSection() {
  return (
      <Card
          className="relative group overflow-hidden p-8"
      >
        {/* Background decoration */}
        <div
            className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none group-hover:bg-gold/10 transition-colors duration-500"/>

        <div
            className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <Badge
                variant="gold"
                className="gap-2 px-3 py-1 tracking-widest uppercase"
            >
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse"/>
              New · Featured Experience
            </Badge>

            <h2 className="text-3xl font-heading text-white tracking-tight">
              The Aurelius Chat Interface
            </h2>

            <div className="text-silver leading-relaxed">
              <p>
                See how the system comes to life in a fully-featured AI interface.
                <p></p>
                By harmonizing our typography, components, and signature color palette, we have
                orchestrated a flagship interactive experience.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <a href="#chat-demo">
              <Button
                  variant="important"
                  size="xl"
                  className="gap-3 shadow-lg hover:shadow-gold/20"
              >
                <span>Launch Demo</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                     className="w-5 h-5">
                  <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                      clipRule="evenodd"
                  />
                </svg>
              </Button>
            </a>
          </div>
        </div>
      </Card>
  )
}
