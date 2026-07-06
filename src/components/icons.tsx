// Small line icons drawn in currentColor — no icon font, keeps the set coherent.
import type { SVGProps } from 'react'

const base = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function MenuIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" />
    </svg>
  )
}
export function CloseIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}
export function HomeIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9.5h12V10" />
    </svg>
  )
}
export function BooksIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M5 4.5h5.5v15H5zM10.5 4.5H16v15h-5.5z" />
      <path d="M16 6l3 .6-2.6 13.2-3-.6" />
    </svg>
  )
}
export function StarIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8L4.5 9.7l5.9-.9z" />
    </svg>
  )
}
export function StarFilled(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} fill="currentColor" {...p}>
      <path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8L4.5 9.7l5.9-.9z" />
    </svg>
  )
}
export function NoteIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M6 3.5h8L18.5 8v12.5H6z" />
      <path d="M13.5 3.5V8h5" />
      <path d="M8.5 12.5h6M8.5 16h4" />
    </svg>
  )
}
export function ClockIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  )
}
export function GearIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5 5l2.1 2.1M16.9 16.9L19 19M19 5l-2.1 2.1M7.1 16.9L5 19" />
    </svg>
  )
}
export function InfoIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5" />
      <circle cx="12" cy="7.8" r="0.6" fill="currentColor" />
    </svg>
  )
}
export function DownloadIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3.5v11M7.5 10l4.5 4.5 4.5-4.5" />
      <path d="M5 19.5h14" />
    </svg>
  )
}
export function CheckIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M4.5 12.5l4.5 4.5 10.5-11" />
    </svg>
  )
}
export function TrashIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M4.5 6.5h15M9 6.5V4.5h6v2M6.5 6.5l1 13h9l1-13" />
    </svg>
  )
}
export function WifiOffIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M3 4l18 18" />
      <path d="M8.5 13.5a5 5 0 0 1 5.4-1" />
      <path d="M5 10a10 10 0 0 1 4-2.3M19 10a10 10 0 0 0-4.6-2.6" />
      <path d="M12 17.5h.01" />
    </svg>
  )
}

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
