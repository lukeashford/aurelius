import React, {useState} from 'react'
import {
  ArtifactType,
  AudioCard,
  Button,
  Card,
  ImageCard,
  MarkdownContent,
  PdfCard,
  ScriptCard,
  ScriptElement,
  VideoCard
} from '@lukeashford/aurelius'
import Section from './Section'

const SCRIPT_ELEMENTS: ScriptElement[] = [
  {type: 'title', content: 'AURELIUS DESIGN SYSTEM'},
  {type: 'subtitle', content: 'Demo Scene - "The Specialist Cards"'},
  {type: 'scene-heading', content: 'INT. DEVELOPMENT STUDIO - DAY'},
  {
    type: 'action',
    content: 'A developer sits in front of a high-end monitor. The screen glows with a deep charcoal background and gold accents.'
  },
  {type: 'character', content: 'DEVELOPER'},
  {type: 'parenthetical', content: 'excited'},
  {
    type: 'dialogue',
    content: 'I finally have all the specialist cards implemented! IMAGE, PDF, AUDIO, VIDEO, TEXT, and even SCRIPT'
  },
  {type: 'transition', content: 'FADE TO BLACK'},
]

const DEMO_DATA: Record<ArtifactType, any> = {
  IMAGE: {
    type: 'IMAGE',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    alt: 'Abstract art',
    title: 'Image Card',
    subtitle: 'Demonstrating IMAGE type'
  },
  PDF: {
    type: 'PDF',
    url: 'https://pub-8e7c0a417b134d198f8616f5e59e144b.r2.dev/script_the_cut.pdf',
    title: 'PDF Card',
    subtitle: 'Demonstrating PDF type'
  },
  AUDIO: {
    type: 'AUDIO',
    url: 'https://pub-8e7c0a417b134d198f8616f5e59e144b.r2.dev/20240915_ashford_english2.m4a',
    title: 'Audio Card',
    subtitle: 'Demonstrating AUDIO type'
  },
  VIDEO: {
    type: 'VIDEO',
    url: 'https://youtu.be/Oe6I6fAhNDw',
    title: 'Video Card',
    subtitle: 'Demonstrating VIDEO type'
  },
  TEXT: {
    type: 'TEXT',
    inlineContent: '# Text Card\n\nThis card renders **Markdown**, **HTML**, or plain text content.\n\n- Supports formatting\n- Preserves newlines\n- Uses design system typography',
    mimeType: 'text/markdown',
    title: 'Text Card',
    subtitle: 'Demonstrating TEXT type'
  },
  SCRIPT: {
    type: 'SCRIPT',
    scriptElements: SCRIPT_ELEMENTS,
    title: 'Script Card',
    subtitle: 'Demonstrating SCRIPT type (formerly HTML)'
  },
}

export default function SpecialistCardsSection() {
  const [activeType, setActiveType] = useState<ArtifactType>('IMAGE')

  const renderActiveCard = () => {
    const data = DEMO_DATA[activeType]

    switch (activeType) {
      case 'IMAGE':
        return (
            <ImageCard
                src={data.url}
                alt={data.alt}
                title={data.title}
                subtitle={data.subtitle}
                aspectRatio="landscape"
                className="w-full max-w-2xl mx-auto"
            />
        )
      case 'PDF':
        return (
            <PdfCard
                url={data.url}
                title={data.title}
                subtitle={data.subtitle}
                className="w-full max-w-4xl mx-auto"
            />
        )
      case 'AUDIO':
        return (
            <AudioCard
                src={data.url}
                title={data.title}
                subtitle={data.subtitle}
                className="w-full max-w-xl mx-auto"
            />
        )
      case 'VIDEO':
        return (
            <VideoCard
                src={data.url}
                title={data.title}
                subtitle={data.subtitle}
                aspectRatio="video"
                className="w-full max-w-3xl mx-auto"
            />
        )
      case 'TEXT':
        return (
            <Card className="w-full max-w-2xl mx-auto p-6">
              <h4 className="text-lg font-semibold mb-4">{data.title}</h4>
              <MarkdownContent
                  content={data.inlineContent}
                  isMarkdown={data.mimeType === 'text/markdown'}
                  className="prose prose-invert"
              />
            </Card>
        )
      case 'SCRIPT':
        return (
            <ScriptCard
                title={data.title}
                subtitle={data.subtitle}
                elements={data.scriptElements}
                maxHeight="400px"
                className="w-full max-w-2xl mx-auto"
            />
        )
      default:
        return null
    }
  }

  return (
      <Section
          title="Specialist Cards"
          subtitle="Specialized card components for different content types."
      >
        <div className="space-y-8">
          <div className="flex flex-wrap gap-2 justify-center pb-4 border-b border-ash/20">
            {(Object.keys(DEMO_DATA) as ArtifactType[]).map((type) => (
                <Button
                    key={type}
                    variant={activeType === type ? 'important' : 'outlined'}
                    size="sm"
                    onClick={() => setActiveType(type)}
                >
                  {type}
                </Button>
            ))}
          </div>

          <div
              className="py-8 min-h-[400px] flex items-center justify-center bg-obsidian/50 border border-ash/10">
            {renderActiveCard()}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-gold">Artifact Type Mapping</h4>
              <ul className="space-y-2 text-sm text-silver">
                <li><code className="text-gold">IMAGE</code> — Pictures (png, jpeg, webp)</li>
                <li><code className="text-gold">PDF</code> — PDF documents</li>
                <li><code className="text-gold">AUDIO</code> — Sound files (mp3, wav)</li>
                <li><code className="text-gold">VIDEO</code> — Video files (mp4, mov)</li>
                <li><code className="text-gold">TEXT</code> — Formatted text (markdown, html, plain)
                </li>
                <li><code className="text-gold">SCRIPT</code> — Structured screenplay format</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-gold">Usage in Chat</h4>
              <p className="text-sm text-silver">
                In the chat interface, these types are used by the <code
                  className="text-gold">ArtifactsPanel</code> to automatically determine which
                specialist card to use for rendering an artifact.
              </p>
              <pre className="p-3 bg-charcoal border border-ash/20 text-xs overflow-x-auto">
{`showArtifact(id, {
  type: '${activeType}',
  url: '...',
  title: '...'
})`}
              </pre>
            </div>
          </div>
        </div>
      </Section>
  )
}
