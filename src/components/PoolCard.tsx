import React from 'react'
import type { Pools } from '../types'
import { useBracketStore } from '../store/bracketStore'

type Props = { poolKey: keyof Pools; title: string }

export default function PoolCard({ poolKey, title }: Props) {
  const { state, updatePoolSlot, setPoolWinner } = useBracketStore()
  const pool = state.pools[poolKey]

  const selectedAcross = new Set<string>()
  for (const pk of ['p1','p2','p3','p4'] as const) {
    state.pools[pk].forEach((v: string | null) => { if (v) selectedAcross.add(v) })
  }

  const options = [null, ...state.startups]

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm">
      <h3 className="font-semibold mb-2">{title}</h3>
      <div className="space-y-2">
  {pool.map((slot: string | null, idx: number) => {
          const available = options.filter(o => o === null || o === slot || !selectedAcross.has(o as string))
          return (
            <div key={idx} className="flex gap-2 items-center">
              <label className="w-6">{idx+1}.</label>
              <select aria-label={`${title} - slot ${idx+1}`} value={slot ?? ''} onChange={e => updatePoolSlot(poolKey, idx, e.target.value || null)} className="flex-1 p-2 border rounded">
                {available.map((o, i) => (
                  <option key={i} value={o ?? ''}>{o ?? '—'}</option>
                ))}
              </select>
            </div>
          )
        })}
      </div>
      <div className="mt-3">
        <p className="text-sm">Gagnant du pool</p>
        <div className="flex gap-2 mt-2">
          {pool.map((slot: string | null, idx: number) => (
            <button key={idx} className={`px-2 py-1 border rounded ${state.winnersR1[poolKey] === slot ? 'bg-brand text-white' : ''}`} onClick={() => setPoolWinner(poolKey, slot)} disabled={!slot} aria-label={`Gagner ${slot ?? ''}`}>
              {slot ?? `Slot ${idx+1}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
