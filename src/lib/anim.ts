import type { Variants } from 'framer-motion'

// Shared, restrained motion vocabulary. The orchestrated page-load lives here
// so every surface enters with the same cadence.
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
}

export const stagger: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
}
