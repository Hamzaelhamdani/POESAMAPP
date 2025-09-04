import React from 'react'
import { useBracketStore } from '../store/bracketStore'

export default function RankingCard() {
  const { ranking } = useBracketStore()
  const r = ranking()

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm">
      <h3 className="font-semibold mb-2">Classement final</h3>
      <ol className="list-decimal list-inside space-y-1">
        <li><strong>1er:</strong> {r.first ?? '—'}</li>
        <li><strong>2e:</strong> {r.second ?? '—'}</li>
        <li><strong>3e:</strong> {r.third ?? '—'}</li>
        <li><strong>4e:</strong> {r.fourth ?? '—'}</li>
      </ol>
    </div>
  )
}
