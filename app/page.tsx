'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://bodraggcrgdgvfjvpmgy.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvZHJhZ2djcmdkZ3ZmanZwbWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMjkzNTIsImV4cCI6MjA5MjgwNTM1Mn0.Um3hsdoDRwH2TT3x0HKTor1kGdhfg-DNugCy94F80lc'
)

export default function SecureAdminPanel() {
  const [players, setPlayers] = useState<any[]>([])
  const [serverIp, setServerIp] = useState('')
  
  // Form States
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

  const modes = ['Vanilla', 'UHC', 'Pot', 'NethOP', 'SMP', 'Sword', 'Axe', 'Mace'];
  const regions = ['AS', 'NA', 'EU', 'AU'];
  const baseTiers = ["HT1", "LT1", "HT2", "LT2", "HT3", "LT3", "HT4", "LT4", "HT5", "LT5"];
  const allTierOptions = [...baseTiers, ...baseTiers.map(t => `Peak ${t}`), ...baseTiers.map(t => `Retired ${t}`)];

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
    if (error) alert(error.message); else { alert('✅ Player Added!'); setAddName(''); fetchData(); }
  }

  const handleChange = async (e: any) => {
    e.preventDefault()
    const { error } = await supabase.from('players').update({ tier: newTier, points: parseInt(newPoints.toString()), region: newRegion }).eq('username', changeName.trim()).eq('gamemode', changeMode)
    if (error) alert(error.message); else { alert('✅ Updated Stats & Region!'); fetchData(); }
  }

  const handleRemove = async (e: any) => {
    e.preventDefault()
    if (confirm(`Are you sure you want to delete ${removeName} from ${removeMode}?`)) {
      const { error } = await supabase.from('players').delete().eq('username', removeName.trim()).eq('gamemode', removeMode)
      if (error) alert(error.message); else { alert('🗑️ Player Removed!'); setRemoveName(''); fetchData(); }
    }
  }

  const handleIpChange = async (e: any) => {
    e.preventDefault()
    const { error } = await supabase.from('settings').update({ value: newIp }).eq('key', 'server_ip')
    if (error) alert(error.message); else { alert('🌐 Server IP Updated!'); setServerIp(newIp); }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#c9d1d9] p-4 md:p-10 font-sans">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-2xl font-black italic text-white uppercase mb-8 border-b border-[#9100ff]/30 pb-4">
          <span className="text-[#9100ff]">PRXPLE</span> SECURE PANEL
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ADD PLAYER */}
            <div className="bg-[#111114] border border-[#9100ff]/20 p-6 rounded-xl shadow-lg">
              <h2 className="text-[#9100ff] font-bold text-[10px] uppercase mb-4 tracking-widest">Add Entry</h2>
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
                      <input type="number" value={addPoints} onChange={e => setAddPoints(Number(e.target.value))} placeholder="Points" className="bg-[#000] border border-[#30363d] p-3 rounded-lg text-sm text-white outline-none" />
                      <select value={addRegion} onChange={e => setAddRegion(e.target.value)} className="bg-[#000] border border-[#30363d] p-3 rounded-lg text-xs text-white">
                          {regions.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                  </div>
                  <button className="bg-[#9100ff] text-white font-black py-3 rounded-lg text-xs uppercase hover:brightness-125 transition-all">Add Player</button>
              </form>
            </div>

            {/* MODIFY PLAYER */}
            <div className="bg-[#111114] border border-[#9100ff]/20 p-6 rounded-xl shadow-lg">
              <h2 className="text-[#9100ff] font-bold text-[10px] uppercase mb-4 tracking-widest">Modify Stats & Region</h2>
              <form onSubmit={handleChange} className="flex flex-col gap-3">
                  <input value={changeName} onChange={e => setChangeName(e.target.value)} placeholder="Username" className="bg-[#000] border border-[#30363d] p-3 rounded-lg text-sm text-white outline-none focus:border-[#9100ff]" required />
                  <select value={changeMode} onChange={e => setChangeMode(e.target.value)} className="bg-[#000] border border-[#30363d] p-3 rounded-lg text-xs text-white">
                      {modes.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <div className="grid grid-cols-3 gap-2">
                    <select value={newTier} onChange={e => setNewTier(e.target.value)} className="bg-[#000] border border-[#9100ff]/40 p-3 rounded-lg text-xs text-[#9100ff] font-bold">
                        {allTierOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input type="number" value={newPoints} onChange={e => setNewPoints(Number(e.target.value))} placeholder="Pts" className="bg-[#000] border border-[#30363d] p-3 rounded-lg text-sm text-white outline-none" />
                    <select value={newRegion} onChange={e => setNewRegion(e.target.value)} className="bg-[#000] border border-[#30363d] p-3 rounded-lg text-xs text-white">
                        {regions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <button className="bg-[#9100ff] text-white font-black py-3 rounded-lg text-xs uppercase hover:brightness-125 transition-all">Update Stats</button>
              </form>
            </div>

            {/* REMOVE PLAYER */}
            <div className="bg-[#111114] border border-red-900/30 p-6 rounded-xl shadow-lg">
              <h2 className="text-red-500 font-bold text-[10px] uppercase mb-4 tracking-widest">Remove Entry</h2>
              <form onSubmit={handleRemove} className="flex flex-col gap-3">
                  <input value={removeName} onChange={e => setRemoveName(e.target.value)} placeholder="Username to Delete" className="bg-[#000] border border-[#30363d] p-3 rounded-lg text-sm text-white outline-none focus:border-red-500" required />
                  <select value={removeMode} onChange={e => setRemoveMode(e.target.value)} className="bg-[#000] border border-[#30363d] p-3 rounded-lg text-xs text-white">
                      {modes.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <button className="bg-red-600/10 text-red-500 border border-red-600/30 font-black py-3 rounded-lg text-xs uppercase hover:bg-red-600 hover:text-white transition-all">Remove Permanently</button>
              </form>
            </div>

            {/* CHANGE SERVER IP */}
            <div className="bg-[#111114] border border-green-900/30 p-6 rounded-xl shadow-lg">
              <h2 className="text-green-500 font-bold text-[10px] uppercase mb-4 tracking-widest">Server Settings</h2>
              <form onSubmit={handleIpChange} className="flex flex-col gap-3">
                  <div className="text-[10px] text-gray-500 mb-1 uppercase font-bold">Current IP: {serverIp}</div>
                  <input value={newIp} onChange={e => setNewIp(e.target.value)} placeholder="New Server IP" className="bg-[#000] border border-[#30363d] p-3 rounded-lg text-sm text-white outline-none focus:border-green-500" required />
                  <button className="bg-green-600/10 text-green-500 border border-green-600/30 font-black py-3 rounded-lg text-xs uppercase hover:bg-green-600 hover:text-white transition-all">Update IP</button>
              </form>
            </div>
        </div>
      </div>
    </div>
  )
}
