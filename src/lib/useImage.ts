import { useEffect, useState } from 'react'

// Probe an image off-DOM; returns true only once it actually loaded.
// Components render their designed fallback first and swap the image in —
// no broken-image flash while title images are still missing.
export function useImageAvailable(src: string | undefined): boolean {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    if (!src) return
    let alive = true
    const img = new Image()
    img.onload = () => alive && setOk(true)
    img.onerror = () => alive && setOk(false)
    img.src = src
    return () => {
      alive = false
    }
  }, [src])
  return ok
}
