export default function AdminPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-500 border-b border-purple-900 pb-4">
          Purple Tiers Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Action Card 1 */}
          <div className="bg-neutral-900 p-6 rounded-xl border border-purple-500/30">
            <h2 className="text-xl font-semibold mb-2">Update Tier List</h2>
            <p className="text-gray-400 text-sm mb-4">Add or move players between S, A, B, and C tiers.</p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition">
              Edit Tiers
            </button>
          </div>

          {/* Action Card 2 */}
          <div className="bg-neutral-900 p-6 rounded-xl border border-purple-500/30">
            <h2 className="text-xl font-semibold mb-2">Server Status</h2>
            <p className="text-gray-400 text-sm mb-4">Check if the SMP tiering system is synced with Discord.</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400">System Online</span>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-neutral-900 p-6 rounded-xl border border-purple-500/30">
          <h2 className="text-xl font-semibold mb-4">Recent Changes</h2>
          <ul className="space-y-3 text-sm text-gray-300">
            <li>• <span className="text-purple-400">Player 1</span> was moved to S-Tier</li>
            <li>• <span className="text-purple-400">Player 3</span> was added to the list</li>
          </ul>
        </div>
      </div>
    </main>
  );
}