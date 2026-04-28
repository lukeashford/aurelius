import React from 'react'
import {Badge, Button, Card} from '@lukeashford/aurelius'
import {ArrowRight} from 'lucide-react'
import {Link} from "react-router-dom";

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
                By harmonizing our typography, components, and signature color palette, we have
                orchestrated a flagship interactive experience.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <Link to="/chat-demo">
              <Button
                  variant="important"
                  size="xl"
                  className="gap-3 shadow-lg hover:shadow-gold/20"
              >
                <span>Launch Demo</span>
                <ArrowRight className="w-5 h-5" aria-hidden/>
              </Button>
            </Link>
          </div>
        </div>
      </Card>
  )
}
