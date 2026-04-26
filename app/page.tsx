'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://bodraggcrgdgvfjvpmgy.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvZHJhZ2djcmdkZ3ZmanZwbWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMjkzNTIsImV4cCI6MjA5MjgwNTM1Mn0.Um3hsdoDRwH2TT3x0HKTor1kGdhfg-DNugCy94F80lc'
)

export default function Home() {
  const [players, setPlayers] = useState<any[]>([])
  const [activeGamemode, setActiveGamemode] = useState('Overall')
  const [serverIp, setServerIp] = useState('PLAY.PRXPLESMP.COM') 
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const { data: pData } = await supabase.from('players').select('*')
      if (pData) setPlayers(pData)
      const { data: sData } = await supabase.from('settings').select('value').eq('key', 'server_ip').single()
      if (sData) setServerIp(sData.value)
    }
    fetchData()
  }, [])

  // Filter and Rank Logic
  const getLB = () => {
    const g: any = {}
    players.forEach(p => {
      // If Overall mode is active, we sum up everything
      if (activeGamemode === 'Overall') {
        if (!g[p.username]) g[p.username] = { username: p.username, points: 0, region: p.region, tiers: {} }
        g[p.username].points += (Number(p.points) || 0)
        g[p.username].tiers[p.gamemode] = p.tier.replace('PEAK ', '')
      } 
      // If a specific mode is active, only show players in that mode
      else if (p.gamemode === activeGamemode) {
        if (!g[p.username]) g[p.username] = { username: p.username, points: Number(p.points), region: p.region, tier: p.tier }
      }
    })

    return Object.values(g)
      .filter((p: any) => p.username.toLowerCase().includes(search.toLowerCase()))
      .sort((a: any, b: any) => b.points - a.points)
  }

  const modes = [
    { n: 'Overall', i: 'overall.svg' }, { n: 'Vanilla', i: 'vanilla.svg' },
    { n: 'UHC', i: 'uhc.svg' }, { n: 'Pot', i: 'pot.svg' },
    { n: 'NethOP', i: 'nethop.svg' }, { n: 'SMP', i: 'smp.svg' },
    { n: 'Sword', i: 'sword.svg' }, { n: 'Axe', i: 'axe.svg' }, { n: 'Mace', i: 'mace.svg' }
  ]

  return (
    <div className="min-h-screen text-[#c9d1d9] pb-10 overflow-x-hidden relative font-sans">
      
      {/* 1. PURPLE GRADIENT BACKGROUND */}
      <div className="fixed inset-0 z-[-1] bg-[#050505]">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#9100ff] opacity-15 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#9100ff] opacity-10 blur-[120px] rounded-full" />
      </div>

      {/* HEADER SECTION */}
      <header className="bg-black/60 backdrop-blur-xl border-b border-white/5 p-4 sticky top-0 z-50">
        <div className="max-w-[1250px] mx-auto flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-black italic text-white uppercase tracking-tighter italic">
              <span className="text-[#9100ff]">PRXPLE</span> TIERS
            </h1>
            <button 
              onClick={() => {navigator.clipboard.writeText(serverIp); alert('IP Copied!')}} 
              className="bg-white/5 border border-[#9100ff]/30 px-4 py-1.5 rounded-full text-white text-[10px] font-bold hover:bg-[#9100ff] hover:text-white transition-all uppercase tracking-widest"
            >
              {serverIp}
            </button>
          </div>

          {/* GAMEMODE SELECTOR */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-sb">
            {modes.map(m => (
              <button 
                key={m.n} 
                onClick={() => setActiveGamemode(m.n)} 
                className={`py-2 px-5 rounded-lg flex items-center gap-2 shrink-0 transition-all text-[10px] font-black uppercase tracking-widest border ${
                  activeGamemode === m.n 
                  ? 'bg-[#9100ff] text-white border-[#9100ff] shadow-[0_0_20px_rgba(145,0,255,0.3)]' 
                  : 'bg-white/5 text-gray-500 border-transparent hover:border-white/10'
                }`}
              >
                <img src={`https://mctiers.com/tier_icons/${m.i}`} className="w-3.5 h-3.5" alt="" />
                {m.n}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-[1250px] mx-auto mt-8 px-4">
        {/* SEARCH BAR */}
        <div className="relative mb-8">
          <input 
            type="text" 
            placeholder="SEARCH FOR A PLAYER..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs font-bold text-white focus:border-[#9100ff]/50 outline-none transition-all placeholder:text-gray-700 uppercase tracking-widest"
          />
        </div>

        {/* LEADERBOARD LIST */}
        <div className="flex flex-col gap-3">
          {getLB().map((p: any, i) => (
            <div 
              key={p.username + activeGamemode} 
              className="flex items-center bg-white/[0.02] border border-white/5 rounded-2xl h-20 overflow-hidden hover:bg-white/[0.04] hover:border-[#9100ff]/30 transition-all group"
            >
              {/* RANK NUMBER */}
              <div className="w-16 md:w-24 flex items-center justify-center shrink-0 border-r border-white/5 bg-white/[0.01]">
                <span className="text-xl md:text-3xl font-black italic text-white/10 group-hover:text-[#9100ff]/40 transition-colors">
                  {i + 1}
                </span>
              </div>

              {/* PLAYER INFO AREA */}
              <div className="flex-1 px-4 md:px-10 flex items-center justify-between min-w-0 pr-6 md:pr-12">
                
                {/* NAME AND HEAD */}
                <div className="flex items-center gap-4 overflow-hidden pr-4"> {/* ADDED PR-4 TO PREVENT TEXT CLIPPING */}
                  <img 
                    src={`https://render.crafty.gg/3d/bust/${p.username}?crop=face`} 
                    className="h-10 md:h-14 drop-shadow-[0_0_10px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform" 
                    alt="" 
                  />
                  <div className="flex flex-col">
                    <span className="text-sm md:text-xl font-black text-white italic uppercase truncate tracking-tight">
                      {p.username}
                    </span>
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">{p.region} REGION</span>
                  </div>
                </div>

                {/* STATS AREA */}
                <div className="flex items-center gap-6 shrink-0">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] md:text-sm font-black text-[#9100ff] italic uppercase leading-none">
                      {p.points} PTS
                    </span>
                    {/* Only show tier text if not in Overall mode */}
                    {activeGamemode !== 'Overall' && (
                      <span className="text-[11px] md:text-lg font-black text-[#9100ff] italic leading-tight">
                        {p.tier}
                      </span>
                    )}
                  </div>

                  {/* MINI TIER ICONS (ONLY FOR OVERALL MODE) */}
                  {activeGamemode === 'Overall' && (
                    <div className="hidden sm:flex gap-3 ml-4 border-l border-white/10 pl-6">
                      {modes.slice(1).map(m => p.tiers[m.n] && (
                        <div key={m.n} className="flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity">
                          <img src={`https://mctiers.com/tier_icons/${m.i}`} className="w-4 h-4 mb-0.5" alt={m.n} title={m.n} />
                          <span className="text-[8px] font-black text-[#9100ff] uppercase">{p.tiers[m.n]}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
          
          {getLB().length === 0 && (
            <div className="py-20 text-center">
              <span className="text-gray-600 font-black italic uppercase tracking-[0.3em] text-sm">No Players Found</span>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER DECORATION */}
      <footer className="mt-20 text-center opacity-20">
         <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Prxple SMP Management System</span>
      </footer>
    </div>
  )
}
