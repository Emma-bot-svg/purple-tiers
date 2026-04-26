'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Hardcoded Supabase Credentials
const supabase = createClient(
  'https://bodraggcrgdgvfjvpmgy.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvZHJhZ2djcmdkZ3ZmanZwbWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMjkzNTIsImV4cCI6MjA5MjgwNTM1Mn0.Um3hsdoDRwH2TT3x0HKTor1kGdhfg-DNugCy94F80lc'
)

const tierNumbers = "1,2,3,4,5".split(",");

export default function Home() {
  const [players, setPlayers] = useState<any[]>([])
  const [activeGamemode, setActiveGamemode] = useState('Overall')
  const [serverIp, setServerIp] = useState('PLAY.PRXPLESMP.COM') 
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: pData } = await supabase.from('players').select('*')
        if (pData) setPlayers(pData)
        const { data: sData } = await supabase.from('settings').select('value').eq('key', 'server_ip').single()
        if (sData) setServerIp(sData.value)
      } catch (err) {
        console.error("Fetch Error:", err)
      }
    }
    fetchData()
  }, [])

  const getRegionStyle = (region: string) => {
    const r = (region || '').toUpperCase();
    if (r === 'NA') return 'border-red-500/40 bg-red-500/10 text-red-500';
    if (r === 'EU') return 'border-green-500/40 bg-green-500/10 text-green-500';
    if (r === 'AU') return 'border-purple-500/40 bg-purple-500/10 text-purple-500';
    if (r === 'AS') return 'border-blue-500/40 bg-blue-500/10 text-blue-500';
    return 'border-gray-500/40 bg-gray-500/10 text-gray-500';
  }

  const getRankTag = (points: number, rankIndex: number) => {
    if (rankIndex === 0 && points > 0) return { name: 'Combat Grandmaster', img: 'https://mctiers.com/titles/combat_grandmaster.webp' };
    if (points >= 250) return { name: 'Combat Master', img: 'https://mctiers.com/titles/combat_master.webp' };
    if (points >= 201) return { name: 'Combat Ace', img: 'https://mctiers.com/titles/combat_ace.webp' };
    if (points >= 100) return { name: 'Combat Specialist', img: 'https://mctiers.com/titles/combat_specialist.svg' };
    if (points >= 20) return { name: 'Combat Cadet', img: 'https://mctiers.com/titles/combat_cadet.svg' };
    return { name: 'Rookie', img: 'https://mctiers.com/titles/rookie.svg' };
  }

  const getRankBg = (index: number) => {
    if (index === 0) return 'bg-gradient-to-r from-[#FFD700]/30 to-[#FFD700]/10 border-[#FFD700]/50 shadow-[0_0_20px_rgba(255,215,0,0.2)]'; 
    if (index === 1) return 'bg-gradient-to-r from-[#C0C0C0]/30 to-[#C0C0C0]/10 border-[#C0C0C0]/50 shadow-[0_0_20px_rgba(192,192,192,0.2)]'; 
    if (index === 2) return 'bg-gradient-to-r from-[#CD7F32]/30 to-[#CD7F32]/10 border-[#CD7F32]/50 shadow-[0_0_20px_rgba(205,127,50,0.2)]'; 
    return 'bg-black/60 border-white/10';
  }

  const modes = [
    { n: 'Overall', i: 'overall.svg' }, { n: 'Vanilla', i: 'vanilla.svg' },
    { n: 'UHC', i: 'uhc.svg' }, { n: 'Pot', i: 'pot.svg' },
    { n: 'NethOP', i: 'nethop.svg' }, { n: 'SMP', i: 'smp.svg' },
    { n: 'Sword', i: 'sword.svg' }, { n: 'Axe', i: 'axe.svg' }, { n: 'Mace', i: 'mace.svg' }
  ]

  const getLB = () => {
    const g: any = {}
    if (!players || players.length === 0) return [];
    players.forEach(p => {
      if (!p || !p.username) return;
      const n = p.username.trim();
      if (!g[n]) {
        g[n] = { username: n, points: 0, region: p.region || 'AS', tiers: {} }
      }
      g[n].points += (Number(p.points) || 0)
      if (p.gamemode && p.gamemode !== 'Overall') {
        g[n].tiers[p.gamemode] = (p.tier || '').replace('PEAK ', '').trim();
      }
    })
    return Object.values(g).filter((p: any) => p.username.toLowerCase().includes(search.toLowerCase())).sort((a: any, b: any) => b.points - a.points)
  }

  return (
    <div className="min-h-screen text-[#c9d1d9] pb-10 overflow-x-hidden relative">
      <div className="fixed inset-0 z-[-1] overflow-hidden bg-black">
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-gradient-to-br from-[#4b0082] via-[#9100ff] to-[#000000] opacity-40 blur-[130px] animate-[liquid_12s_infinite_alternate]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[140%] h-[140%] bg-gradient-to-tl from-[#000000] via-[#6a0dad] to-[#2e0854] opacity-40 blur-[130px] animate-[liquid_15s_infinite_alternate-reverse]" />
      </div>

      <style jsx global>{`
        @keyframes liquid { 0% { transform: translate(0,0) rotate(0deg); } 50% { transform: translate(7%, 7%) rotate(3deg); } 100% { transform: translate(-3%, -3%) rotate(-3deg); } }
        @keyframes slideFadeIn { from { opacity: 0; transform: translateY(30px); filter: blur(10px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
        @keyframes skinFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .card-entry { animation: slideFadeIn 0.5s cubic-bezier(0.19, 1, 0.22, 1) forwards; opacity: 0; }
        .skin-anim { animation: skinFloat 3.5s ease-in-out infinite; }
        .no-sb::-webkit-scrollbar { display: none; }
        .no-sb { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <header className="bg-black/60 backdrop-blur-3xl border-b border-white/10 p-2 md:p-4 sticky top-0 z-50">
        <div className="max-w-[1250px] mx-auto flex flex-col gap-2">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <h1 className="text-lg md:text-xl font-black italic text-white uppercase tracking-tighter shrink-0 animate-pulse">
              <span className="text-[#9100ff]">PRXPLE</span> SMP
            </h1>
            <div className="flex items-center justify-center gap-1.5">
                <button onClick={() => {navigator.clipboard.writeText(serverIp); alert('IP Copied!')}} className="bg-white px-2 py-1 rounded text-black text-[7px] md:text-[10px] font-black uppercase hover:invert transition-all">{serverIp}</button>
                <a href="https://discord.gg/k2RzMbcXkW" target="_blank" rel="noopener noreferrer" className="bg-[#5865F2] p-1.5 rounded text-white hover:scale-110 active:scale-95 transition-transform"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.666 4.37a.07.07 0 00-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.063 14.063 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128c.125-.094.249-.192.37-.291a.074.074 0 01.077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 01.077.01c.12.099.244.197.37.291a.077.077 0 01-.006.127 12.29 12.29 0 01-1.873.893.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 00-.031-.03z"/></svg></a>
                <a href="https://www.youtube.com/@prxple1" target="_blank" rel="noopener noreferrer" className="bg-red-600 p-1.5 rounded text-white hover:scale-110 active:scale-95 transition-transform"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
            </div>
          </div>
          <div className="flex gap-1 overflow-x-auto no-sb pt-1 border-t border-white/5">
            {modes.map((m, idx) => (
              <button key={m.n} onClick={() => { setActiveGamemode(m.n); setSearch('') }} className={`py-1.5 px-3 rounded flex items-center gap-1 shrink-0 transition-all card-entry hover:bg-white/10 active:scale-95 ${activeGamemode === m.n ? 'bg-[#9100ff] text-white font-black scale-105' : 'bg-white/5 text-gray-500'}`} style={{animationDelay: `${idx * 0.05}s`}}>
                <img src={`https://mctiers.com/tier_icons/${m.i}`} className="w-3.5 h-3.5" alt="" />
                <span className="text-[8px] md:text-[10px] uppercase italic">{m.n}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-[1250px] mx-auto mt-2 px-2 relative z-10">
        <div className="mb-3 card-entry" style={{animationDelay: '0.1s'}}>
          <input 
            type="text" 
            placeholder="SEARCH PLAYER..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/60 border border-white/20 rounded-md py-2 px-10 text-[10px] md:text-xs font-bold text-white tracking-widest focus:border-[#9100ff] transition-all outline-none animate-pulse"
          />
        </div>

        {activeGamemode === 'Overall' ? (
          <div className="flex flex-col gap-2.5">
            {getLB().map((p: any, i) => {
              const rank = getRankTag(p.points, i);
              const sortedModes = modes.slice(1).sort((a, b) => (p.tiers[b.n] ? 1 : 0) - (p.tiers[a.n] ? 1 : 0));
              return (
                <div key={p.username} className={`card-entry flex items-center border rounded-lg h-[55px] md:h-[78px] relative w-full group overflow-hidden hover:scale-[1.01] transition-all ${getRankBg(i)}`} style={{animationDelay: `${i * 0.05}s`}}>
                  <div className="w-14 md:w-32 h-full flex items-center shrink-0 relative px-2">
                    <span className="text-xl md:text-3xl font-black italic z-20 text-white tracking-tighter drop-shadow-lg">{i + 1}</span>
                    <div className="absolute right-[-15px] md:right-[-35px] top-1/2 -translate-y-[48%] z-10 h-full flex items-center skin-anim">
                        <img src={`https://render.crafty.gg/3d/bust/${p.username}?crop=face`} className="h-[52px] md:h-[105px] drop-shadow-[0_0_15px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform" alt="" />
                    </div>
                  </div>
                  
                  {/* FIXED SECTION FOR NAME CLIPPING */}
                  <div className="flex-1 flex flex-col justify-center pl-10 md:pl-32 pr-2 min-w-0">
                    <div className="flex items-center w-full justify-between gap-2 overflow-hidden">
                       <span className="text-[11px] md:text-2xl font-black text-white italic truncate min-w-0">{p.username}</span>
                       <span className="text-[7px] md:text-[11px] font-black text-[#00f2ff] lowercase shrink-0">{p.points} points</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <img src={rank.img} className="h-2.5 md:h-4 shrink-0" alt="" />
                        <span className={`px-1.5 py-0.5 rounded border text-[5px] md:text-[9px] font-black shrink-0 ${getRegionStyle(p.region)}`}>{p.region || 'AS'}</span>
                        <span className="text-[7px] md:text-[12px] font-black text-gray-400 uppercase tracking-tighter truncate">{rank.name}</span>
                    </div>
                  </div>

                  <div className="flex px-2 md:px-5 h-full items-center gap-1.5 md:gap-5 border-l border-white/5 bg-black/20 shrink-0 overflow-x-auto no-sb max-w-[80px] md:max-w-none">
                    {sortedModes.map(m => (
                      <div key={m.n} className={`flex flex-col items-center min-w-[16px] md:min-w-[35px] ${p.tiers[m.n] ? 'opacity-100' : 'opacity-10'}`}>
                        <img src={`https://mctiers.com/tier_icons/${m.i}`} className="w-3.5 md:w-5 h-3.5 md:h-5 mb-1 group-hover:rotate-12 transition-transform" alt="" />
                        <span className="text-[7px] md:text-[11px] font-black text-[#FFD700]">{p.tiers[m.n] || ''}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
            {tierNumbers.map((t, idx) => (
              <div key={t} className="flex flex-col gap-1.5 card-entry" style={{animationDelay: `${idx * 0.1}s`}}>
                <div className="py-2 px-1 font-black italic text-center uppercase text-[12px] border-b-2 border-[#9100ff]/30 text-white tracking-widest drop-shadow-[0_0_8px_rgba(145,0,255,0.4)] mb-2">
                  TIER {t}
                </div>
                {players.filter(p => p.gamemode === activeGamemode && p.tier?.includes(t.toString()) && p.username.toLowerCase().includes(search.toLowerCase())).map((p, pIdx) => (
                  <div key={p.id} className="bg-black/60 border border-white/10 p-2 rounded flex items-center justify-between hover:bg-white/10 transition-all card-entry hover:translate-x-1" style={{animationDelay: `${pIdx * 0.03}s`}}>
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <img src={`https://mc-heads.net/avatar/${p.username}/16`} className="w-4 h-4 rounded-sm" alt="" />
                      <span className="text-[10px] md:text-sm font-bold text-white truncate">{p.username}</span>
                    </div>
                    <span className="text-[10px] font-black text-[#FFD700] tracking-tight shrink-0">{(p.tier || '').replace('PEAK ', '')}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
