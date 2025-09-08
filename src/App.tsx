import React from 'react'
import StartupEditor from './components/StartupEditor'
import ControlBar from './components/ControlBar'
import PoolCard from './components/PoolCard'
import SemisCard from './components/SemisCard'
import FinalsCard from './components/FinalsCard'
import RankingCard from './components/RankingCard'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">POESAM IN THE RING 2025</h1>
          <ControlBar />
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <StartupEditor />
          </div>
          <div>
            <div className="bg-white p-4 rounded-2xl shadow-sm">
              <h2 className="font-semibold">Règles rapides</h2>
              <ul className="mt-2 text-sm space-y-1">
                <li>11 startups → Pools 3/3/3/2</li>
                <li>1 gagnant par pool → 4 demi-finalistes</li>
                <li>SF1: P1 vs P2, SF2: P3 vs P4</li>
                <li>Finale et match 3e place déterminent classement 1→4</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Round 1 — Pools</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <PoolCard poolKey={'p1'} title={'Pool 1'} />
            <PoolCard poolKey={'p2'} title={'Pool 2'} />
            <PoolCard poolKey={'p3'} title={'Pool 3'} />
            <PoolCard poolKey={'p4'} title={'Pool 4'} />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Round 2 — Demi-finales</h2>
          <SemisCard />
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Round 3 — Finale & 3e place</h2>
          <FinalsCard />
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Classement</h2>
          <RankingCard />
        </section>
      </div>
    </div>
  )
}
