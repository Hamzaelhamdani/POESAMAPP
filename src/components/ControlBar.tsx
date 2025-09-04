import React, { useRef } from 'react'
import { useBracketStore } from '../store/bracketStore'

export default function ControlBar() {
  const { randomize, resetPoolsAndWinners, exportJSON, importJSON } = useBracketStore()
  const fileRef = useRef<HTMLInputElement | null>(null)

  const doExport = () => {
    const data = exportJSON()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'poesam_bracket_2025.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const obj = JSON.parse(String(reader.result))
        const res = importJSON(obj)
        if (!res.ok) alert('Import invalide: ' + (res.error || ''))
      } catch (err) {
        alert('Fichier JSON invalide')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
  <button onClick={randomize} className="px-3 py-1 bg-brand text-white rounded" aria-label="Randomiser la répartition">Randomiser</button>
  <button onClick={resetPoolsAndWinners} className="px-3 py-1 bg-brand-light text-black rounded" aria-label="Réinitialiser">Réinitialiser</button>
  <button onClick={doExport} className="px-3 py-1 bg-brand-dark text-white rounded" aria-label="Exporter JSON">Exporter JSON</button>
  <button onClick={() => fileRef.current?.click()} className="px-3 py-1 bg-orangeTelecom-400 rounded" aria-label="Importer JSON">Importer JSON</button>
  <input ref={fileRef} type="file" accept="application/json" onChange={onFile} style={{ display: 'none' }} />
  <button onClick={() => window.print()} className="px-3 py-1 bg-slate-700 text-white rounded" aria-label="Imprimer">Imprimer</button>
    </div>
  )
}
