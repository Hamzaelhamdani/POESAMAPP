import React, { useState } from 'react'
import { useBracketStore } from '../store/bracketStore'

export default function StartupEditor() {
  const { state, setStartups } = useBracketStore()
  const [text, setText] = useState(state.startups.join('\n'))

  const apply = () => {
  const lines = text.split('\n').map((s: string) => s.trim()).filter(Boolean)
    if (lines.length > 11) {
      if (!confirm('Plus de 11 startups détectées — seules les 11 premières uniques seront gardées. Continuer ?')) return
    }
    setStartups(lines)
  }

  return (
    <section aria-labelledby="startups-heading" className="bg-white p-4 rounded-2xl shadow-sm">
      <h2 id="startups-heading" className="font-semibold mb-2">Startups &amp; Règles</h2>
      <label className="sr-only" htmlFor="startups">Liste des startups (une par ligne)</label>
      <textarea id="startups" value={text} onChange={e => setText(e.target.value)} className="w-full h-40 p-2 border rounded-md text-sm" />
      <div className="mt-2 flex gap-2">
  <button className="px-3 py-1 bg-brand text-white rounded" onClick={apply} aria-label="Appliquer la liste">Appliquer</button>
  <button className="px-3 py-1 bg-brand-light text-black rounded" onClick={() => { setText(state.startups.join('\n')) }}>Réinitialiser textarea</button>
      </div>
    </section>
  )
}
