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

export function Paperclip(p: SVGProps<SVGSVGElement>) {
  // slim paperclip — matches the 1.4 line weight of the set
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M20 11.5 12 19.4a4.4 4.4 0 0 1-6.2-6.2l8-8a2.9 2.9 0 0 1 4.1 4.1l-8 8a1.5 1.5 0 0 1-2.1-2.1l7.3-7.3" />
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
