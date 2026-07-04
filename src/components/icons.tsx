// Small line icons drawn in currentColor — no icon font, keeps the set coherent.
import type { SVGProps } from 'react'

export function SearchIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  )
}

export function SparkIcon(p: SVGProps<SVGSVGElement>) {
  // eight-point spark — echoes the khatam at the heart of the Shamsa
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" {...p}>
      <path d="M12 2.5 13.8 9 20.5 12 13.8 15 12 21.5 10.2 15 3.5 12 10.2 9Z" />
    </svg>
  )
}

export function SendIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  )
}

export function PaperPlane(p: SVGProps<SVGSVGElement>) {
  // outline paper-plane — the send affordance in the chat input
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 3 10.5 13.5" />
      <path d="M21 3 14.5 21l-4-8-8-4L21 3Z" />
    </svg>
  )
}

export function ImageIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  )
}

export function ChevronDown(p: SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function Chevron(p: SVGProps<SVGSVGElement>) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  )
}

export function ArrowLeft(p: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  )
}

export function Plus(p: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function Diamond(p: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" {...p}>
      <path d="M12 3 16 12 12 21 8 12Z" />
      <path d="M3 12h4M17 12h4" strokeLinecap="round" />
    </svg>
  )
}

export function ArabesqueDivider(p: SVGProps<SVGSVGElement>) {
  return (
    <svg width="180" height="22" viewBox="0 0 180 22" fill="none" stroke="currentColor" strokeWidth="1" {...p}>
      <path d="M2 11h60" strokeLinecap="round" />
      <path d="M118 11h60" strokeLinecap="round" />
      <path d="M90 4c-6 0-9 3.5-9 7s3 7 9 7 9-3.5 9-7-3-7-9-7Z" />
      <path d="M90 11 84 7M90 11l6-4M90 11l-6 4M90 11l6 4" strokeLinecap="round" opacity="0.7" />
      <circle cx="72" cy="11" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="108" cy="11" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  )
}
