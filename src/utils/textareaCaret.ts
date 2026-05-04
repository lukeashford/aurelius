/**
 * Returns the pixel offset of the caret inside a textarea, relative to the textarea's own
 * top-left. Use with `textarea.getBoundingClientRect()` to compute viewport / page coords
 * — typically for anchoring an `@`-mention or slash-command popover at the cursor.
 *
 * Implementation is the standard mirror-div technique: clone the textarea's text-affecting
 * styles into a hidden `<div>`, fill it with the value up to the caret, drop a marker
 * span at the caret position, and read the span's offset.
 */
const PROPERTIES_TO_MIRROR = [
  'boxSizing',
  'width',
  'height',
  'overflowX',
  'overflowY',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderStyle',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'fontStretch',
  'fontSize',
  'fontSizeAdjust',
  'lineHeight',
  'fontFamily',
  'textAlign',
  'textTransform',
  'textIndent',
  'textDecoration',
  'letterSpacing',
  'wordSpacing',
  'tabSize',
] as const

export interface TextareaCaretCoords {
  /** Top of the caret, in pixels relative to the textarea's top-left. */
  top: number
  /** Left of the caret, in pixels relative to the textarea's top-left. */
  left: number
  /** Caret line height in pixels — useful when positioning a popover just above/below. */
  height: number
}

export function getTextareaCaretCoords(textarea: HTMLTextAreaElement): TextareaCaretCoords {
  const mirror = document.createElement('div')
  mirror.setAttribute('aria-hidden', 'true')
  document.body.appendChild(mirror)

  const computed = window.getComputedStyle(textarea)
  const style = mirror.style

  style.position = 'absolute'
  style.visibility = 'hidden'
  style.whiteSpace = 'pre-wrap'
  style.wordWrap = 'break-word'
  style.top = '0'
  style.left = '-9999px'

  for (const prop of PROPERTIES_TO_MIRROR) {
    style[prop] = computed[prop]
  }

  // Textareas have a scrollbar that affects layout in some browsers; mirror it.
  style.overflow = 'hidden'

  mirror.textContent = textarea.value.substring(0, textarea.selectionStart)

  const marker = document.createElement('span')
  // Non-empty content is required so the span has measurable position.
  marker.textContent = textarea.value.substring(textarea.selectionStart) || '.'
  mirror.appendChild(marker)

  const top = marker.offsetTop - textarea.scrollTop
  const left = marker.offsetLeft - textarea.scrollLeft
  const height = parseInt(computed.lineHeight, 10) || parseInt(computed.fontSize, 10)

  document.body.removeChild(mirror)

  return {top, left, height}
}
