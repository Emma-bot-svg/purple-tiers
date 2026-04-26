'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://bodraggcrgdgvfjvpmgy.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvZHJhZ2djcmdkZ3ZmanZwbWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMjkzNTIsImV4cCI6MjA5MjgwNTM1Mn0.Um3hsdoDRwH2TT3x0HKTor1kGdhfg-DNugCy94F80lc'
)

export default function UltimateAdmin() {
  const [players, setPlayers] = useState<any[]>([])
  const [serverIp, setServerIp] = useState('')
  const [addName, setAddName] = useState('')
  const [addMode, setAddMode] = useState('Vanilla')
  const [addTier, setAddTier] = useState('LT5')
  const [addPoints, setAddPoints] = useState(0)
  const [addRegion, setAddRegion] = useState('AS')
  const [changeName, setChangeName] = useState('')
  const [changeMode, setChangeMode] = useState('Vanilla')
  const [newTier, setNewTier] = useState('LT5')
  const [newPoints, setNewPoints] = useState(0)
  const [newRegion, setNewRegion] = useState('AS') 
  const [removeName, setRemoveName] = useState('')
  const [removeMode, setRemoveMode] = useState('Vanilla')
  const [newIp, setNewIp] = useState('')

  const baseTiers = ["HT1", "LT1", "HT2", "LT2", "HT3", "LT3", "HT4", "LT4", "HT5", "LT5"];
  const allTierOptions = [...baseTiers, ...baseTiers.map(t => `Peak ${t}`), ...baseTiers.map(t => `Retired ${t}`)];
  const modes = ['Vanilla', 'UHC', 'Pot', 'NethOP', 'SMP', 'Sword', 'Axe', 'Mace'];
  const regions = ['AS', 'NA', 'EU', 'AU'];

  useEffect(() => { fetchData() }, [])
  const fetchData = async () => {
    const { data } = await supabase.from('players').select('*').order('username', { ascending: true })
    if (data) setPlayers(data)
    const { data: sData } = await supabase.from('settings').select('value').eq('key', 'server_ip').single()
    if (sData) { setServerIp(sData.value); setNewIp(sData.value); }
  }

  const handleAdd = async (e: any) => {
    e.preventDefault()
    const { error } = await supabase.from('players').insert([{ username: addName.trim(), gamemode: addMode, tier: addTier, points: parseInt(addPoints.toString()), region: addRegion }])
    if (error) alert(error.message); else { alert('✅ Added!'); setAddName(''); fetchData(); }
  }

  const handleChange = async (e: any) => {
    e.preventDefault()
    const { error } = await supabase.from('players').update({ tier: newTier, points: parseInt(newPoints.toString()), region: newRegion }).eq('username', changeName.trim()).eq('gamemode', changeMode)
    if (error) alert(error.message); else { alert('✅ Updated Stats & Region!'); fetchData(); }
  }

  const handleRemove = async (e: any) => {
    e.preventDefault()
    if (confirm(`Delete ${removeName}?`)) {
      const { error } = await supabase.from('players').delete().eq('username', removeName.trim()).eq('gamemode', removeMode)
      if (!error) { alert('🗑️ Deleted!'); setRemoveName(''); fetchData(); }
    }
  }

  const handleIpChange = async (e: any) => {
    e.preventDefault()
    const { error } = await supabase.from('settings').update({ value: newIp }).eq('key', 'server_ip')
    if (!error) { alert('🌐 IP Changed!'); setServerIp(newIp); }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#c9d1d9] p-4 md:p-10 font-sans">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-2xl font-black italic text-white uppercase mb-8 border-b border-[#9100ff]/30 pb-4">
          <span className="text-[#9100ff]">PRXPLE</span> SECURE PANEL
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111114] border border-[#9100ff]/20 p-6 rounded-xl shadow-lg">
              <h2 className="text-[#9100ff] font-bold text-[10px] uppercase mb-4 tracking-[0.2em]">Add Entry</h2>
              <form onSubmit={handleAdd} className="flex flex-col gap-3">
                  <input value={addName} onChange={e => setAddName(e.target.value)} placeholder="Username" className="bg-[#000] border border-[#30363d] p-3 rounded-lg text-sm text-white outline-none focus:border-[#9100ff]" required />
                  <div className="grid grid-cols-2 gap-2">
                    <select value={addMode} onChange={e => setAddMode(e.target.value)} className="bg-[#000] border border-[#30363d] p-3 rounded-lg text-xs text-white">
                        {modes.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select value={addTier} onChange={e => setAddTier(e.target.value)} className="bg-[#000] border border-[#9100ff]/40 p-3 rounded-lg text-xs text-[#9100ff] font-bold">
                        {allTierOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                      <input type="number" value={addPoints} onChange={e => setAddPoints(Number(e.target.value))} placeholder="Points" className="bg-[#000] border border-[#30363d] p-3 rounded-lg text-sm text-white" />
                      <select value={addRegion} onChange={e => setAddRegion(e.target.value)} className="bg-[#000] border border-[#30363d] p-3 rounded-lg text-xs text-white">
                          {regions.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                  </div>
                  <button className="bg-[#9100ff] text-white font-black py-3 rounded-lg text-xs uppercase hover:brightness-125 transition-all">Add Player</button>
              </form>
            </div>

            <div className="bg-[#111114] border border-[#9100ff]/20 p-6 rounded-xl shadow-lg">
              <h2 className="text-[#9100ff] font-bold text-[10px] uppercase mb-4 tracking-[0.2em]">Modify Stats & Region</h2>
              <form onSubmit={handleChange} className="flex flex-col gap-3">
                  <input value={changeName} onChange={e => setChangeName(e.target.value)} placeholder="Username" className="bg-[#000] border border-[#30363d] p-3 rounded-lg text-sm text-white outline-none focus:border-[#9100ff]" required />
                  <select value={changeMode} onChange={e => setChangeMode(e.target.value)} className="bg-[#000] border border-[#30363d] p-3 rounded-lg text-xs text-white">
                      {modes.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <div className="grid grid-cols-3 gap-2">
                    <select value={newTier} onChange={e => setNewTier(e.target.value)} className="bg-[#000] border border-[#9100ff]/40 p-3 rounded-lg text-xs text-[#9100ff] font-bold">
                        {allTierOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input type="number" value={newPoints} onChange={e => setNewPoints(Number(e.target.value))} placeholder="Pts" className="bg-[#000] border border-[#30363d] p-3 rounded-lg text-sm text-white" />
                    <select value={newRegion} onChange={e => setNewRegion(e.target.value)} className="bg-[#000] border border-[#30363d] p-3 rounded-lg text-xs text-white">
                        {regions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <button className="bg-[#9100ff] text-white font-black py-3 rounded-lg text-xs uppercase hover:brightness-125 transition-all">Update Stats</button>
              </form>
            </div>
        </div>
      </div>
    </div>
  )
}
