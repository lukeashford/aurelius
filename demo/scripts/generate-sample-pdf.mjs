// Prerender the default deliverable spec as a static PDF reference, using
// the exact same Playwright path atrium uses in production. Run:
//
//   npm run generate-sample-pdf       (from aurelius/demo)
//
// Spins up the dev server, opens /deliverable-print with the default spec
// in sessionStorage, calls page.pdf() with print emulation, and writes the
// result to public/sample-deliverable.pdf.
//
// The output is a build artefact — regenerate when the renderer or default
// spec changes; commit when you do.

import {spawn} from 'node:child_process'
import {once} from 'node:events'
import {readFile, writeFile} from 'node:fs/promises'
import {fileURLToPath} from 'node:url'
import {dirname, resolve} from 'node:path'
import {chromium} from 'playwright'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUTPUT = resolve(ROOT, 'public', 'sample-deliverable.pdf')
const DEMO_URL = 'http://localhost:5173'
const SPEC_PATH = resolve(__dirname, 'sample-deliverable-spec.json')

async function main() {
  const spec = JSON.parse(await readFile(SPEC_PATH, 'utf-8'))

  console.log('Starting dev server…')
  const dev = spawn('npm', ['run', 'dev'], {cwd: ROOT, stdio: 'pipe'})
  await waitForServer(dev, DEMO_URL)

  try {
    const browser = await chromium.launch()
    const context = await browser.newContext()
    const page = await context.newPage()
    // Visit any page on the origin so localStorage is reachable, seed the
    // spec, then navigate to the print route. The React app reads
    // localStorage on mount and renders the deliverable.
    await page.goto(`${DEMO_URL}/`, {waitUntil: 'domcontentloaded'})
    await page.evaluate((seedSpec) => {
      localStorage.setItem('aurelius:deliverable-print:spec', seedSpec)
    }, JSON.stringify(spec))
    await page.goto(`${DEMO_URL}/deliverable-print`, {waitUntil: 'networkidle'})
    await page.emulateMedia({media: 'print'})
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
    })

    await writeFile(OUTPUT, pdf)
    console.log(`Wrote ${OUTPUT} (${pdf.length} bytes)`)
    await browser.close()
  } finally {
    dev.kill('SIGTERM')
    await once(dev, 'exit').catch(() => undefined)
  }
}

async function waitForServer(child, url) {
  const ready = new Promise((resolve, reject) => {
    let timer
    const onData = (chunk) => {
      if (chunk.toString().includes('Local:')) {
        clearTimeout(timer)
        resolve()
      }
    }
    child.stdout.on('data', onData)
    child.stderr.on('data', (chunk) => process.stderr.write(chunk))
    child.on('exit', (code) =>
        reject(new Error(`dev server exited (${code}) before ready`)))
    timer = setTimeout(() => reject(new Error('dev server timeout')), 30_000)
  })
  await ready
  // Settle a tick — vite reports Local before HMR is fully wired.
  await new Promise(r => setTimeout(r, 500))
  // Double-check the URL responds.
  for (let i = 0; i < 10; i++) {
    try {
      const res = await fetch(url)
      if (res.ok) return
    } catch {}
    await new Promise(r => setTimeout(r, 300))
  }
  throw new Error(`dev server not responding at ${url}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
