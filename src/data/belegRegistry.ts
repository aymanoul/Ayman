// ---------------------------------------------------------------------------
// Global Beleg registry. Every seal's Belege are keyed by a composite ref
// `sealId:key` (keys like "q7157" repeat across seals, so the seal id makes
// them unique). The search index turns each Beleg into its own target, and the
// modal provider opens one directly from a `?beleg=<ref>` URL param.
// ---------------------------------------------------------------------------

import type { Beleg } from './types'
import { fundamentBelege } from './seals/fundament'
import { abrahamBelege } from './seals/abraham'
import { moseBelege } from './seals/mose'
import { arabienBelege } from './seals/arabien'
import { hoheliedBelege } from './seals/hohelied'
import { danielBelege } from './seals/daniel'
import { parakletBelege } from './seals/paraklet'
import { erwartungBelege } from './seals/erwartung'
import { verteidigungBelege } from './seals/verteidigung'

const BY_SEAL: Record<string, Record<string, Beleg>> = {
  fundament: fundamentBelege,
  'abrahams-nachkommen': abrahamBelege,
  'prophet-wie-mose': moseBelege,
  'arabische-prophezeiungen': arabienBelege,
  hohelied: hoheliedBelege,
  daniel: danielBelege,
  paraklet: parakletBelege,
  'juedische-erwartung': erwartungBelege,
  verteidigung: verteidigungBelege,
}

export interface BelegRef {
  ref: string // "prophet-wie-mose:deut1818"
  sealId: string
  key: string
  beleg: Beleg
}

export const belegRegistry: Record<string, Beleg> = {}
export const belegList: BelegRef[] = []

for (const [sealId, rec] of Object.entries(BY_SEAL)) {
  for (const [key, beleg] of Object.entries(rec)) {
    const ref = `${sealId}:${key}`
    belegRegistry[ref] = beleg
    belegList.push({ ref, sealId, key, beleg })
  }
}
