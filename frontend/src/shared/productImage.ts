import type { SyntheticEvent } from 'react'

// Inline SVG placeholder shown when a product has no image, or when its
// Supabase image URL fails to load (e.g. the file was removed from the bucket).
// A data URI can never 404 and is unaffected by the Vite base path.
const PLACEHOLDER_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'>" +
  "<rect width='400' height='300' fill='#e8efe9'/>" +
  "<text x='200' y='158' fill='#2c694e' font-family='system-ui,sans-serif' font-size='34' font-weight='700' text-anchor='middle'>Zorch Farms</text>" +
  '</svg>'

export const PRODUCT_IMAGE_FALLBACK = `data:image/svg+xml,${encodeURIComponent(PLACEHOLDER_SVG)}`

// Swap in the placeholder when an <img> fails to load. Clearing onerror first
// prevents an infinite loop if the fallback itself were ever to fail.
export function handleProductImageError(event: SyntheticEvent<HTMLImageElement>) {
  const img = event.currentTarget
  img.onerror = null
  img.src = PRODUCT_IMAGE_FALLBACK
}
