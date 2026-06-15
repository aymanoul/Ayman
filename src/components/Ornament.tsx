import type { SVGProps } from 'react'

// Intentional arabesque — a symmetric split-leaf (rumi) crown for the hero and
// a small sprig for the footer. Drawn crisply in emerald with brass jewels;
// this is ornament with a job, not background noise.

export function Crown({ width = 148, ...p }: SVGProps<SVGSVGElement> & { width?: number }) {
  return (
    <svg width={width} viewBox="0 0 148 52" fill="none" aria-hidden {...p}>
      <g stroke="var(--green)" strokeWidth="1.4" strokeLinecap="round" fill="none">
        {/* central palmette */}
        <path d="M74 6c-4 10-4 18 0 26 4-8 4-16 0-26Z" />
        {/* right scroll */}
        <path d="M74 32c14-2 26-6 34-14 5-5 12-4 13 3 1 6-5 9-9 6" />
        <path d="M74 32c4 6 8 8 13 8" />
        {/* left scroll (mirror) */}
        <path d="M74 32c-14-2-26-6-34-14-5-5-12-4-13 3-1 6 5 9 9 6" />
        <path d="M74 32c-4 6-8 8-13 8" />
        {/* base hairlines */}
        <path d="M40 44h26M82 44h26" opacity="0.45" />
      </g>
      <circle cx="74" cy="19" r="2.1" fill="var(--brass)" />
      <circle cx="116" cy="22" r="1.7" fill="var(--brass)" />
      <circle cx="32" cy="22" r="1.7" fill="var(--brass)" />
    </svg>
  )
}

export function Sprig({ width = 96, ...p }: SVGProps<SVGSVGElement> & { width?: number }) {
  return (
    <svg width={width} viewBox="0 0 96 20" fill="none" aria-hidden {...p}>
      <g stroke="var(--green)" strokeWidth="1.2" strokeLinecap="round" fill="none">
        <path d="M6 10h28" opacity="0.5" />
        <path d="M62 10h28" opacity="0.5" />
        <path d="M48 4c-3 3-3 9 0 12 3-3 3-9 0-12Z" />
        <path d="M40 10c-2-2-5-2-7 0M56 10c2-2 5-2 7 0" />
      </g>
      <circle cx="48" cy="10" r="1.6" fill="var(--brass)" />
      <circle cx="34" cy="10" r="1.3" fill="var(--brass)" />
      <circle cx="62" cy="10" r="1.3" fill="var(--brass)" />
    </svg>
  )
}
