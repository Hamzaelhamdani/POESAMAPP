import React from 'react'
import { useBracketStore } from '../store/bracketStore'

export default function SemisCard() {
  const { state, setSemisWinner } = useBracketStore()
  const p = state.winnersR1
  const sf1 = [p.p1, p.p2]
  const sf2 = [p.p3, p.p4]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-2xl shadow-sm">
        <h3 className="font-semibold">Demi-finale 1</h3>
        <div className="mt-2 flex gap-2">
          {sf1.map((c, i) => (
            <button key={i} onClick={() => setSemisWinner('sf1', c)} disabled={!c} className={`flex-1 p-2 border rounded ${state.winnersSemis.sf1 === c ? 'bg-brand text-white' : ''}`}>{c ?? '—'}</button>
          ))}
        </div>
      </div>
      <div className="bg-white p-4 rounded-2xl shadow-sm">
        <h3 className="font-semibold">Demi-finale 2</h3>
        <div className="mt-2 flex gap-2">
          {sf2.map((c, i) => (
            <button key={i} onClick={() => setSemisWinner('sf2', c)} disabled={!c} className={`flex-1 p-2 border rounded ${state.winnersSemis.sf2 === c ? 'bg-brand text-white' : ''}`}>{c ?? '—'}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
