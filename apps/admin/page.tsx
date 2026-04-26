'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')

export default function Admin() {
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
    const { data: pData } = await supabase.from('players').select('*').order('username', { ascending: true })
    if (pData) setPlayers(pData)
    const { data: sData } = await supabase.from('settings').select('value').eq('key', 'server_ip').single()
    if (sData) { setServerIp(sData.value); setNewIp(sData.value); }
  }

  const handleAdd = async (e: any) => {
    e.preventDefault()
    const { error } = await supabase.from('players').insert([{ username: addName, gamemode: addMode, tier: addTier, points: addPoints, region: addRegion }])
    if (!error) { alert('✅ Added!'); setAddName(''); fetchData(); }
  }

  const handleChange = async (e: any) => {
    e.preventDefault()
    const { error } = await supabase.from('players').update({ tier: newTier, points: newPoints, region: newRegion })
      .eq('username', changeName).eq('gamemode', changeMode)
    if (!error) { alert('✅ Updated!'); fetchData(); } else { alert('Player not found in that mode'); }
  }

  const handleRemove = async (e: any) => {
    e.preventDefault()
    if (confirm(`Remove ${removeName} from ${removeMode}?`)) {
      const { error } = await supabase.from('players').delete().eq('username', removeName).eq('gamemode', removeMode)
      if (!error) { alert('🗑️ Removed!'); setRemoveName(''); fetchData(); }
    }
  }

  const handleIpChange = async (e: any) => {
    e.preventDefault()
    const { error } = await supabase.from('settings').update({ value: newIp }).eq('key', 'server_ip')
    if (!error) { alert('🌐 IP Changed!'); setServerIp(newIp); }
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] p-4 md:p-10">
      <h1 className="text-3xl font-black italic text-white uppercase mb-10"><span className="text-[#ffaa00]">ADMIN</span> MANAGEMENT</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1200px] mx-auto">
        
        {/* 1. ADD TIER */}
        <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-2xl">
          <h2 className="text-[#ffaa00] font-black uppercase text-sm mb-4 italic text-center">1. Add New Tier</h2>
          <form onSubmit={handleAdd} className="flex flex-col gap-3">
            <input value={addName} onChange={e => setAddName(e.target.value)} placeholder="Username" className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg text-xs outline-none focus:border-[#ffaa00]" required />
            <select value={addMode} onChange={e => setAddMode(e.target.value)} className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg text-xs text-white">
                {modes.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={addTier} onChange={e => setAddTier(e.target.value)} className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg text-xs text-[#ffaa00] font-bold">
                {allTierOptions.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-2">
                <input type="number" value={addPoints} onChange={e => setAddPoints(Number(e.target.value))} placeholder="Points" className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg text-xs outline-none" />
                <select value={addRegion} onChange={e => setAddRegion(e.target.value)} className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg text-xs text-blue-400">
                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
            </div>
            <button className="bg-[#ffaa00] text-black font-black py-3 rounded-lg text-[10px] uppercase">Add Entry</button>
          </form>
        </div>

        {/* 2. CHANGE TIER */}
        <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-2xl">
          <h2 className="text-blue-400 font-black uppercase text-sm mb-4 italic text-center">2. Change Existing Tier</h2>
          <form onSubmit={handleChange} className="flex flex-col gap-3">
            <input value={changeName} onChange={e => setChangeName(e.target.value)} placeholder="Username" className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg text-xs outline-none focus:border-blue-400" required />
            <select value={changeMode} onChange={e => setChangeMode(e.target.value)} className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg text-xs text-white">
                {modes.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={newTier} onChange={e => setNewTier(e.target.value)} className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg text-xs text-blue-400 font-bold">
                {allTierOptions.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-2">
                <input type="number" value={newPoints} onChange={e => setNewPoints(Number(e.target.value))} placeholder="New Points" className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg text-xs outline-none" />
                <select value={newRegion} onChange={e => setNewRegion(e.target.value)} className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg text-xs text-blue-400">
                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
            </div>
            <button className="bg-blue-600 text-white font-black py-3 rounded-lg text-[10px] uppercase">Update Player</button>
          </form>
        </div>

        {/* 3. REMOVE PLAYER */}
        <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-2xl">
          <h2 className="text-red-500 font-black uppercase text-sm mb-4 italic text-center">3. Remove Player</h2>
          <form onSubmit={handleRemove} className="flex flex-col gap-3">
            <input value={removeName} onChange={e => setRemoveName(e.target.value)} placeholder="Username" className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg text-xs outline-none focus:border-red-500" required />
            <select value={removeMode} onChange={e => setRemoveMode(e.target.value)} className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg text-xs text-white">
                {modes.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <button className="bg-red-600 text-white font-black py-3 rounded-lg text-[10px] uppercase">Delete Entry</button>
          </form>
        </div>

        {/* 4. CHANGE IP */}
        <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-2xl">
          <h2 className="text-green-400 font-black uppercase text-sm mb-4 italic text-center">4. Change Server IP</h2>
          <form onSubmit={handleIpChange} className="flex flex-col gap-3">
            <div className="text-[10px] text-gray-500 mb-1 uppercase font-bold text-center">Current: {serverIp}</div>
            <input value={newIp} onChange={e => setNewIp(e.target.value)} placeholder="New Server IP" className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg text-xs outline-none focus:border-green-400" />
            <button className="bg-green-600 text-white font-black py-3 rounded-lg text-[10px] uppercase">Update IP</button>
          </form>
        </div>

      </div>
    </div>
  )
}
