import type { Variants } from 'framer-motion'

// Shared, restrained motion vocabulary. The orchestrated page-load lives here
// so every surface enters with the same cadence.
// Strong custom ease-out (the built-in curves are too weak). See emil-design.
export const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1]

export const rise: Variants = {
  hidden: { opacity: 0, y: 22 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

// Settle, with a breath of bounce — entrances should feel alive, not mechanical.
export const riseSpring: Variants = {
  hidden: { opacity: 0, y: 26 },
  shown: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 220, damping: 26, mass: 0.9 } },
}

export const stagger: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
}
