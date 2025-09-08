import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { BracketState, Pools, WinnersRound1, WinnersSemis, Finals } from '../types'

const STORAGE_KEY = 'poesam_bracket_2025'

const defaultStartups = [
  'IYADA',
  'Smartglobe',
  'DeepLeaf',
  'Sand To Green',
  'Omnidoc Santé',
  'MAMABOX',
  'Wanaut',
  'Colibghiti',
  'Cyber Sqool',
  'PostGoo',
  'BEEKA',
]

const emptyPools = (): Pools => ({ p1: [null, null, null], p2: [null, null, null], p3: [null, null, null], p4: [null, null] })
const emptyWinnersR1 = (): WinnersRound1 => ({ p1: null, p2: null, p3: null, p4: null })
const emptyWinnersSemis = (): WinnersSemis => ({ sf1: null, sf2: null })
const emptyFinals = (): Finals => ({ finalWinner: null, thirdWinner: null })

const sanitizeStartups = (list: string[]) => Array.from(new Set(list.map(s => s.trim()).filter(Boolean)))

function createInitialState(): BracketState {
  return {
    startups: sanitizeStartups(defaultStartups),
    pools: emptyPools(),
    winnersR1: emptyWinnersR1(),
    winnersSemis: emptyWinnersSemis(),
    finals: emptyFinals(),
  }
}

type Store = {
  state: BracketState
  setStartups: (list: string[]) => void
  updatePoolSlot: (poolKey: keyof Pools, index: number, value: string | null) => void
  setPoolWinner: (poolKey: keyof WinnersRound1, winner: string | null) => void
  setSemisWinner: (sf: keyof WinnersSemis, winner: string | null) => void
  setFinalWinner: (winner: string | null) => void
  setThirdWinner: (winner: string | null) => void
  resetPoolsAndWinners: () => void
  exportJSON: () => string
  importJSON: (payload: any) => { ok: boolean; error?: string }
  randomize: () => void
  semisParticipants: () => { sf1: (string | null)[]; sf2: (string | null)[] }
  ranking: () => { first: string | null; second: string | null; third: string | null; fourth: string | null }
}

const BracketContext = createContext<Store | null>(null)

export function BracketProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BracketState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as BracketState
        parsed.startups = sanitizeStartups(parsed.startups || [])
        parsed.pools = parsed.pools || emptyPools()
        parsed.winnersR1 = parsed.winnersR1 || emptyWinnersR1()
        parsed.winnersSemis = parsed.winnersSemis || emptyWinnersSemis()
        parsed.finals = parsed.finals || emptyFinals()
        return parsed
      }
    } catch (e) {
      console.warn('Failed to parse stored state', e)
    }
    return createInitialState()
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const setStartups = (list: string[]) => {
    const startups = sanitizeStartups(list)
    setState(s => {
      const pools = { ...s.pools }
      for (const key of ['p1', 'p2', 'p3', 'p4'] as const) {
        pools[key] = pools[key].map(x => (x && startups.includes(x) ? x : null))
      }
      const winnersR1 = { ...s.winnersR1 }
      for (const k of ['p1', 'p2', 'p3', 'p4'] as const) if (winnersR1[k] && !startups.includes(winnersR1[k]!)) winnersR1[k] = null
      const winnersSemis = { ...s.winnersSemis }
      if (winnersSemis.sf1 && !startups.includes(winnersSemis.sf1)) winnersSemis.sf1 = null
      if (winnersSemis.sf2 && !startups.includes(winnersSemis.sf2)) winnersSemis.sf2 = null
      const finals = { ...s.finals }
      if (finals.finalWinner && !startups.includes(finals.finalWinner)) finals.finalWinner = null
      if (finals.thirdWinner && !startups.includes(finals.thirdWinner)) finals.thirdWinner = null

      return { ...s, startups, pools, winnersR1, winnersSemis, finals }
    })
  }

  const updatePoolSlot = (poolKey: keyof Pools, index: number, value: string | null) => {
    setState(s => {
      const pools = { ...s.pools, [poolKey]: [...s.pools[poolKey]] } as Pools
      pools[poolKey][index] = value
      const winnersR1 = { ...s.winnersR1 }
      if (winnersR1[poolKey as keyof WinnersRound1] && !pools[poolKey].includes(winnersR1[poolKey as keyof WinnersRound1]!)) {
        winnersR1[poolKey as keyof WinnersRound1] = null
      }
      const winnersSemis = { ...s.winnersSemis }
      const p1w = winnersR1.p1; const p2w = winnersR1.p2; const p3w = winnersR1.p3; const p4w = winnersR1.p4
      if (!p1w || !p2w) winnersSemis.sf1 = null
      if (!p3w || !p4w) winnersSemis.sf2 = null
      const finals = { ...s.finals }
      if (!winnersSemis.sf1 || !winnersSemis.sf2) {
        finals.finalWinner = null
        finals.thirdWinner = null
      }
      return { ...s, pools, winnersR1, winnersSemis, finals }
    })
  }

  const setPoolWinner = (poolKey: keyof WinnersRound1, winner: string | null) => {
    setState(s => {
      const winnersR1 = { ...s.winnersR1, [poolKey]: winner }
      const winnersSemis = { ...s.winnersSemis }
      winnersSemis.sf1 = (winnersR1.p1 && winnersR1.p2 && winnersSemis.sf1 === winnersSemis.sf1) ? winnersSemis.sf1 : null
      winnersSemis.sf2 = (winnersR1.p3 && winnersR1.p4 && winnersSemis.sf2 === winnersSemis.sf2) ? winnersSemis.sf2 : null
      const finals = { ...s.finals }
      if (!winnersSemis.sf1 || !winnersSemis.sf2) {
        finals.finalWinner = null
        finals.thirdWinner = null
      }
      return { ...s, winnersR1, winnersSemis, finals }
    })
  }

  const setSemisWinner = (sf: keyof WinnersSemis, winner: string | null) => {
    setState(s => {
      const winnersSemis = { ...s.winnersSemis, [sf]: winner }
      const finals = { ...s.finals }
      if (!winnersSemis.sf1 || !winnersSemis.sf2) {
        finals.finalWinner = null
        finals.thirdWinner = null
      }
      return { ...s, winnersSemis, finals }
    })
  }

  const setFinalWinner = (winner: string | null) => setState(s => ({ ...s, finals: { ...s.finals, finalWinner: winner } }))
  const setThirdWinner = (winner: string | null) => setState(s => ({ ...s, finals: { ...s.finals, thirdWinner: winner } }))

  const resetPoolsAndWinners = () => setState(s => ({ ...s, pools: emptyPools(), winnersR1: emptyWinnersR1(), winnersSemis: emptyWinnersSemis(), finals: emptyFinals() }))

  const exportJSON = (): string => JSON.stringify({ startups: state.startups, pools: state.pools, winnersR1: state.winnersR1, winnersSemis: state.winnersSemis, finals: state.finals }, null, 2)

  const importJSON = (payload: any): { ok: boolean; error?: string } => {
    try {
      if (!payload || !Array.isArray(payload.startups) || !payload.pools) return { ok: false, error: 'Schéma invalide' }
      const startups = sanitizeStartups(payload.startups)
      const pools = payload.pools
      const winnersR1 = payload.winnersR1 || emptyWinnersR1()
      const winnersSemis = payload.winnersSemis || emptyWinnersSemis()
      const finals = payload.finals || emptyFinals()
      const newState: BracketState = { startups, pools, winnersR1, winnersSemis, finals }
      setState(newState)
      return { ok: true }
    } catch (e: any) {
      return { ok: false, error: String(e) }
    }
  }

  const randomize = () => {
    setState(s => {
      const startups = s.startups
  const shuffle = <T,>(arr: T[]) => arr.slice().sort(() => Math.random() - 0.5) as T[]
  const lvl1 = shuffle(startups.slice(0, 4))
  const lvl2 = startups.slice(4, 8)
  const lvl3 = startups.slice(8, 11)
      const pools = emptyPools()
  pools.p1[0] = lvl1[0] || null
  pools.p2[0] = lvl1[1] || null
  pools.p3[0] = lvl1[2] || null
  pools.p4[0] = lvl1[3] || null
  const lvl2s = shuffle(lvl2)
      pools.p1[1] = lvl2s[0] || null
      pools.p2[1] = lvl2s[1] || null
      pools.p3[1] = lvl2s[2] || null
      pools.p4[1] = lvl2s[3] || null
  const lvl3s = shuffle(lvl3)
      pools.p1[2] = lvl3s[0] || null
      pools.p2[2] = lvl3s[1] || null
      pools.p3[2] = lvl3s[2] || null
      return { ...s, pools, winnersR1: emptyWinnersR1(), winnersSemis: emptyWinnersSemis(), finals: emptyFinals() }
    })
  }

  const semisParticipants = () => {
    const { winnersR1 } = state
    return { sf1: [winnersR1.p1, winnersR1.p2], sf2: [winnersR1.p3, winnersR1.p4] }
  }

  const ranking = () => {
    const { finals, winnersSemis } = state
    const first = finals.finalWinner
    const second = (winnersSemis.sf1 === first ? winnersSemis.sf2 : winnersSemis.sf1) || null
    const third = finals.thirdWinner
    const fourth = (winnersSemis.sf1 && winnersSemis.sf2) ? ([winnersSemis.sf1, winnersSemis.sf2].find(x => x !== third) ?? null) : null
    return { first, second, third, fourth }
  }

  const store: Store = useMemo(() => ({ state, setStartups, updatePoolSlot, setPoolWinner, setSemisWinner, setFinalWinner, setThirdWinner, resetPoolsAndWinners, exportJSON, importJSON, randomize, semisParticipants, ranking }), [state])

  return <BracketContext.Provider value={store}>{children}</BracketContext.Provider>
}

export function useBracketStore() {
  const ctx = useContext(BracketContext)
  if (!ctx) throw new Error('useBracketStore must be used within BracketProvider')
  return ctx
}
