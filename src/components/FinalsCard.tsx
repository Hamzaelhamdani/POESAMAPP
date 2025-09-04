import React from 'react'
import { useBracketStore } from '../store/bracketStore'

export default function FinalsCard() {
  const { state, setFinalWinner, setThirdWinner } = useBracketStore()
  const sf = state.winnersSemis
  const sf1 = sf.sf1
  const sf2 = sf.sf2
  const finalParticipants = sf1 && sf2 ? [sf1, sf2] : [null, null]
  const thirdParticipants = sf1 && sf2 ? [sf1 === state.finals.finalWinner ? sf2 : sf1, sf2 === state.finals.finalWinner ? sf1 : sf2] : [null,null]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-2xl shadow-sm">
        <h3 className="font-semibold">Finale</h3>
        <div className="mt-2 flex gap-2">
          {finalParticipants.map((c, i) => (
            <button key={i} onClick={() => setFinalWinner(c)} disabled={!c} className={`flex-1 p-2 border rounded ${state.finals.finalWinner === c ? 'bg-brand text-white' : ''}`}>{c ?? '—'}</button>
          ))}
        </div>
      </div>
      <div className="bg-white p-4 rounded-2xl shadow-sm">
        <h3 className="font-semibold">Match 3e place</h3>
        <p className="text-sm mb-2">Se jouent entre les perdants des demi-finales</p>
        <div className="mt-2 flex gap-2">
          {thirdParticipants.map((c, i) => (
            <button key={i} onClick={() => setThirdWinner(c)} disabled={!c} className={`flex-1 p-2 border rounded ${state.finals.thirdWinner === c ? 'bg-brand text-white' : ''}`}>{c ?? '—'}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
