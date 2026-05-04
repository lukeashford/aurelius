import React, {useState} from 'react'
import {FileChip, type FileChipStatus} from '@lukeashford/aurelius'
import Section from './Section'

const STATUSES: FileChipStatus[] = [
  'pending',
  'uploading',
  'uploaded',
  'analyzing',
  'analyzed',
  'upload_failed',
  'analysis_failed',
]

export default function FileChipSection() {
  const [removed, setRemoved] = useState<string[]>([])
  const restore = () => setRemoved([])

  return (
      <Section title="File Chip"
               subtitle="Compact representation of an uploaded file with lifecycle status.">
        <div className="space-y-8">
          <div>
            <h3 className="text-sm uppercase tracking-wider text-silver mb-3">All statuses</h3>
            <div className="flex flex-wrap items-start gap-3">
              {STATUSES.map(status => (
                  <FileChip
                      key={status}
                      name={`${status}.png`}
                      size={1234567}
                      type="image/png"
                      status={status}
                      error={status === 'analysis_failed' ? "Couldn't process this image" : undefined}
                  />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-wider text-silver mb-3">
              Image preview thumbnail
            </h3>
            <div className="flex flex-wrap items-start gap-3">
              <FileChip name="hero_pose.jpg"
                        size={812000}
                        type="image/jpeg"
                        status="analyzed"
                        previewUrl="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=64&h=64&fit=crop"/>
            </div>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-wider text-silver mb-3">
              Removable (input-side preview)
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              {['draft.pdf', 'rough_cut.mp4', 'voiceover.mp3']
                  .filter(n => !removed.includes(n))
                  .map(n => (
                      <FileChip key={n}
                                name={n}
                                size={2345678}
                                status="analyzed"
                                onRemove={() => setRemoved(prev => [...prev, n])}/>
                  ))}
              {removed.length > 0 && (
                  <button onClick={restore}
                          className="text-xs text-silver underline">
                    Restore
                  </button>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-wider text-silver mb-3">
              Clickable (after artifact integration)
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <FileChip name="treatment.md"
                        size={4096}
                        type="text/markdown"
                        status="analyzed"
                        artifactId="art_123"
                        onOpen={(id) => alert(`Open artifact: ${id}`)}/>
            </div>
          </div>
        </div>
      </Section>
  )
}
