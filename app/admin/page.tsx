'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Hardcoded Credentials for project: bodraggcrgdgvfjvpmgy
const supabase = createClient(
  'https://bodraggcrgdgvfjvpmgy.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvZHJhZ2djcmdkZ3ZmanZwbWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMjkzNTIsImV4cCI6MjA5MjgwNTM1Mn0.Um3hsdoDRwH2TT3x0HKTor1kGdhfg-DNugCy94F80lc'
)

export default function SecretAdmin() {
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

  // Tier Lists
  const baseTiers = ["HT1", "LT1", "HT2", "LT2", "HT3", "LT3", "HT4", "LT4", "HT5", "LT5"];
  const allTierOptions = [
    ...baseTiers,
    ...baseTiers.map(t => `Peak ${t}`),
    ...baseTiers.map(t => `Retired ${t}`)
  ];
  const modes = ['Vanilla', 'UHC', 'Pot', 'NethOP', 'SMP', 'Sword', 'Axe', 'Mace'];
  const regions = ['AS', 'NA', 'EU', 'AU'];

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    const { data, error } = await supabase.from('players').select('*').order('username', { ascending: true })
    if (error) console.error("Fetch Error:", error.message)
    if (data) setPlayers(data)
    
    const { data: sData } = await supabase.from('settings').select('value').eq('key', 'server_ip').single()
    if (sData) { setServerIp(sData.value); setNewIp(sData.value); }
  }

  const handleAdd = async (e: any) => {
    e.preventDefault()
    const { error } = await supabase.from('players').insert([{ 
      username: addName.trim(), 
      gamemode: addMode, 
      tier: addTier, 
      points: parseInt(addPoints.toString()), 
      region: addRegion 
    }])
    
    if (error) {
      alert(`❌ FAILED TO ADD: ${error.message}`)
    } else {
      alert('✅ Added to Database!')
      setAddName('')
      fetchData()
    }
  }

  const handleChange = async (e: any) => {
    e.preventDefault()
    const { error } = await supabase.from('players').update({ 
      tier: newTier, 
      points: parseInt(newPoints.toString()), 
      region: newRegion 
    }).eq('username', changeName.trim()).eq('gamemode', changeMode)
    
    if (error) {
      alert(`❌ UPDATE FAILED: ${error.message}`)
    } else {
      alert('✅ Player Updated!')
      fetchData()
    }
  }

  const handleRemove = async (e: any) => {
    e.preventDefault()
    if (confirm(`Delete ${removeName}?`)) {
      const { error } = await supabase.from('players').delete().eq('username', removeName.trim()).eq('gamemode', removeMode)
      if (error) {
        alert(`❌ DELETE FAILED: ${error.message}`)
      } else {
        alert('🗑️ Deleted!')
        setRemoveName('')
        fetchData()
      }
    }
  }

  const handleIpChange = async (e: any) => {
    e.preventDefault()
    const { error } = await supabase.from('settings').update({ value: newIp }).eq('key', 'server_ip')
    if (error) alert(`❌ IP FAILED: ${error.message}`)
    else { alert('🌐 IP Updated!'); setServerIp(newIp); }
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] p-4 md:p-10 font-sans">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-10 border-b border-[#30363d] pb-5">
            <h1 className="text-2xl md:text-3xl font-black italic text-white uppercase tracking-tighter">
              <span className="text-[#9100ff]">PRXPLE</span> SECRET ADMIN
            </h1>
            <div className="flex flex-col items-end">
              <span className="text-[9px] bg-red-500 text-white px-2 py-0.5 rounded font-bold uppercase">Private Link</span>
              <span className="text-[10px] text-gray-500 mt-1">Logged in as Admin</span>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. ADD */}
            <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-xl shadow-xl">
              <h2 className="text-[#9100ff] font-black uppercase text-xs mb-4 tracking-widest">Create New Entry</h2>
              <form onSubmit={handleAdd} className="flex flex-col gap-3">
                  <input value={addName} onChange={e => setAddName(e.target.value)} placeholder="Username" className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg text-sm outline-none focus:border-[#9100ff] text-white" required />
                  <div className="grid grid-cols-2 gap-2">
                    <select value={addMode} onChange={e => setAddMode(e.target.value)} className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg text-xs text-white">
                        {modes.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select value={addTier} onChange={e => setAddTier(e.target.value)} className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg text-xs text-[#9100ff] font-bold">
                        {allTierOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                      <input type="number" value={addPoints} onChange={e => setAddPoints(Number(e.target.value))} placeholder="Points" className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg text-sm outline-none text-white" />
                      <select value={addRegion} onChange={e => setAddRegion(e.target.value)} className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg text-xs text-blue-400">
                          {regions.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                  </div>
                  <button className="bg-[#9100ff] text-white font-black py-3 rounded-lg text-xs uppercase hover:brightness-125 transition-all mt-2">Add Player</button>
              </form>
            </div>

            {/* 2. UPDATE */}
            <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-xl shadow-xl">
              <h2 className="text-blue-400 font-black uppercase text-xs mb-4 tracking-widest">Modify Player</h2>
              <form onSubmit={handleChange} className="flex flex-col gap-3">
                  <input value={changeName} onChange={e => setChangeName(e.target.value)} placeholder="Target Username" className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg text-sm outline-none focus:border-blue-400 text-white" required />
                  <select value={changeMode} onChange={e => setChangeMode(e.target.value)} className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg text-xs text-white">
                      {modes.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <select value={newTier} onChange={e => setNewTier(e.target.value)} className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg text-xs text-blue-400 font-bold">
                        {allTierOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input type="number" value={newPoints} onChange={e => setNewPoints(Number(e.target.value))} placeholder="New Points" className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg text-sm text-white outline-none" />
                  </div>
                  <button className="bg-blue-600 text-white font-black py-3 rounded-lg text-xs uppercase hover:brightness-125 transition-all mt-2">Update Stats</button>
              </form>
            </div>

            {/* 3. DELETE */}
            <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-xl">
              <h2 className="text-red-500 font-black uppercase text-xs mb-4 tracking-widest">Remove Entry</h2>
              <form onSubmit={handleRemove} className="flex flex-col gap-3">
                  <input value={removeName} onChange={e => setRemoveName(e.target.value)} placeholder="Username" className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg text-sm outline-none focus:border-red-500 text-white" required />
                  <select value={removeMode} onChange={e => setRemoveMode(e.target.value)} className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg text-xs text-white">
                      {modes.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <button className="bg-red-600/20 text-red-500 border border-red-500/50 font-black py-3 rounded-lg text-xs uppercase hover:bg-red-600 hover:text-white transition-all mt-2">Delete Permanently</button>
              </form>
            </div>

            {/* 4. SETTINGS */}
            <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-xl">
              <h2 className="text-green-400 font-black uppercase text-xs mb-4 tracking-widest">Global Settings</h2>
              <form onSubmit={handleIpChange} className="flex flex-col gap-3">
                  <label className="text-[10px] text-gray-500 uppercase font-bold">Server IP: {serverIp}</label>
                  <input value={newIp} onChange={e => setNewIp(e.target.value)} placeholder="New IP (e.g. play.example.com)" className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg text-sm text-white outline-none focus:border-green-400" />
                  <button className="bg-green-600 text-white font-black py-3 rounded-lg text-xs uppercase hover:brightness-125 transition-all mt-2">Update Server IP</button>
              </form>
            </div>
        </div>

        {/* DATA PREVIEW TABLE */}
        <div className="mt-10 bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-[#30363d] bg-[#1c2128]">
            <h3 className="text-white font-bold text-sm uppercase italic">Live Database Preview</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-500 border-b border-[#30363d] bg-[#0d1117]">
                  <th className="p-4">Username</th>
                  <th className="p-4">Mode</th>
                  <th className="p-4">Tier</th>
                  <th className="p-4">Points</th>
                </tr>
              </thead>
              <tbody>
                {players.length === 0 ? (
                  <tr><td colSpan={4} className="p-10 text-center text-gray-600 uppercase font-black tracking-tighter">No players found in database</td></tr>
                ) : (
                  players.map((p, i) => (
                    <tr key={i} className="border-b border-[#30363d] hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-white">{p.username}</td>
                      <td className="p-4 text-gray-400">{p.gamemode}</td>
                      <td className="p-4"><span className="text-[#9100ff] font-black">{p.tier}</span></td>
                      <td className="p-4 text-blue-400 font-mono">{p.points}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
