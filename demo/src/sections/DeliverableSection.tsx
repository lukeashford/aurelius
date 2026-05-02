import React, {useMemo, useState} from 'react'
import {
  Alert,
  Button,
  DeliverableRenderer,
  Stack,
  Textarea,
  type Deliverable,
} from '@lukeashford/aurelius'
import Section from './Section'
import {AUTO_PRINT_KEY, STORAGE_KEY} from '../components/DeliverablePrint'
// Single source of truth for the default spec — the same JSON the
// `generate-sample-pdf` script feeds into Playwright when prerendering
// `public/sample-deliverable.pdf`. Edit there, regenerate, commit both.
import sampleSpec from '../../scripts/sample-deliverable-spec.json'

const DEFAULT_SPEC: Deliverable = sampleSpec as Deliverable

/**
 * Live preview of the deliverable renderer — the same component atrium uses
 * for share pages and PDF rendering. Edit the JSON spec on the left, see the
 * rendered deck on the right.
 */
export default function DeliverableSection() {
  const [draft, setDraft] = useState<string>(() =>
      JSON.stringify(DEFAULT_SPEC, null, 2))
  const [active, setActive] = useState<Deliverable>(DEFAULT_SPEC)
  const [error, setError] = useState<string | null>(null)

  const handleApply = () => {
    try {
      const parsed = JSON.parse(draft) as Deliverable
      if (!parsed || typeof parsed !== 'object'
          || !Array.isArray((parsed as Deliverable).sections)) {
        throw new Error('Spec must be an object with a sections array')
      }
      setActive(parsed)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  const handleReset = () => {
    const seed = JSON.stringify(DEFAULT_SPEC, null, 2)
    setDraft(seed)
    setActive(DEFAULT_SPEC)
    setError(null)
  }

  const previewKey = useMemo(() => active.title + active.sections.length, [active])

  // The button on the renderer just calls whatever `onDownloadPdf` we hand
  // it. In production atrium, that handler hits a Next.js endpoint that
  // calls the Playwright sidecar — which then loads the actual share page
  // in headless Chromium and prints it. Same React tree, same print CSS.
  //
  // Here in the demo there's no server, so we route the click through a
  // chrome-free preview tab and let the browser's print dialog stand in for
  // the sidecar. The print-mode CSS exercised is identical, so the dialog
  // preview is a faithful representation of what atrium's PDFs look like.
  const handleOpenPrintPreview = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(active))
    localStorage.setItem(AUTO_PRINT_KEY, '1')
    window.open('/deliverable-print', '_blank', 'noopener,noreferrer')
  }

  return (
      <Section
          title="Deliverable Renderer"
          subtitle="The same component atrium uses for share pages and PDF rendering. Edit the JSON
            spec, click Apply, see the result. The Download PDF button opens a chrome-free print
            preview so you can validate the @media print styles end-to-end."
      >
        <p className="text-sm text-silver/70 mb-4">
          Reference output: <a href="/sample-deliverable.pdf" target="_blank"
                               rel="noopener noreferrer">sample-deliverable.pdf</a>
          {' '}— prerendered from the default spec via the same Playwright path
          atrium uses in production.
        </p>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-3 min-w-0 lg:col-span-1">
            <Textarea
                value={draft}
                onChange={e => setDraft(e.target.value)}
                rows={28}
                className="font-mono text-xs whitespace-pre"
                spellCheck={false}
            />
            {error && (
                <Alert variant="error">
                  {error}
                </Alert>
            )}
            <Stack direction="horizontal" gap={2} justify="end">
              <Button variant="ghost" onClick={handleReset}>Reset</Button>
              <Button variant="important" onClick={handleApply}>Apply</Button>
            </Stack>
          </div>
          <div className="border border-ash bg-obsidian min-w-0 overflow-hidden lg:col-span-2">
            <DeliverableRenderer
                key={previewKey}
                deliverable={active}
                onDownloadPdf={handleOpenPrintPreview}
            />
          </div>
        </div>
      </Section>
  )
}
