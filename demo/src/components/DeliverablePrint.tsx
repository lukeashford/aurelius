import {useEffect, useState} from 'react'
import {DeliverableRenderer, type Deliverable} from '@lukeashford/aurelius'

const STORAGE_KEY = 'aurelius:deliverable-print:spec'
const AUTO_PRINT_KEY = 'aurelius:deliverable-print:auto'

/**
 * Print-friendly preview of a deliverable spec. The button on
 * DeliverableSection writes the current spec to localStorage and opens this
 * route in a new tab — once mounted, the page renders just the deliverable
 * (no demo chrome) and triggers the browser print dialog so the user can
 * validate the `@media print` styles or save as PDF.
 *
 * `localStorage` (not sessionStorage) because `window.open` always creates a
 * new browsing context with its own sessionStorage. Keys persist across
 * reloads — the demo overwrites them on every Download click.
 *
 * Production atrium uses headless Chromium server-side via the Playwright
 * sidecar; the print path is identical (same React tree, same print CSS).
 */
function readSpec(): {spec: Deliverable | null; error: string | null; autoPrint: boolean} {
  if (typeof localStorage === 'undefined') {
    return {spec: null, error: null, autoPrint: false}
  }
  const raw = localStorage.getItem(STORAGE_KEY)
  const autoPrint = localStorage.getItem(AUTO_PRINT_KEY) === '1'
  if (!raw) {
    return {
      spec: null,
      error: 'No spec found — open this page from the Deliverable Renderer demo.',
      autoPrint: false,
    }
  }
  try {
    return {spec: JSON.parse(raw) as Deliverable, error: null, autoPrint}
  } catch (err) {
    return {
      spec: null,
      error: err instanceof Error ? err.message : String(err),
      autoPrint: false,
    }
  }
}

export default function DeliverablePrint() {
  const [{spec, error, autoPrint}] = useState(readSpec)

  useEffect(() => {
    // Title drives the browser print dialog's default filename.
    if (spec) document.title = spec.title
  }, [spec])

  useEffect(() => {
    if (!spec || !autoPrint) return
    // Clear the auto-print flag so a manual reload doesn't re-fire it.
    localStorage.removeItem(AUTO_PRINT_KEY)
    // Defer so layout settles and images start loading. The print dialog
    // would otherwise capture the page mid-paint.
    const t = setTimeout(() => window.print(), 250)
    return () => clearTimeout(t)
  }, [spec, autoPrint])

  if (error) {
    return (
        <main className="min-h-screen flex items-center justify-center bg-obsidian text-silver">
          <p>{error}</p>
        </main>
    )
  }
  if (!spec) {
    return null
  }
  return <DeliverableRenderer deliverable={spec} hideActions/>
}

export {STORAGE_KEY, AUTO_PRINT_KEY}
