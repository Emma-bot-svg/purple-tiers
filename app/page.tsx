export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-10">
      <h1 className="text-5xl font-bold text-purple-500 drop-shadow-lg">
        PURPLE TIERS
      </h1>
      <p className="text-purple-300 mt-2">The Ultimate SMP Ranking</p>

      <div className="mt-10 w-full max-w-2xl">
        {/* S TIER */}
        <div className="flex bg-neutral-900 border border-purple-900/50 rounded-lg mb-4 overflow-hidden">
          <div className="bg-red-500 w-20 flex items-center justify-center text-2xl font-bold text-black">S</div>
          <div className="p-4 flex gap-2">
            <span className="bg-neutral-800 border border-purple-500 px-3 py-1 rounded-full text-sm">Player 1</span>
          </div>
        </div>

        {/* A TIER */}
        <div className="flex bg-neutral-900 border border-purple-900/50 rounded-lg mb-4 overflow-hidden">
          <div className="bg-orange-400 w-20 flex items-center justify-center text-2xl font-bold text-black">A</div>
          <div className="p-4 flex gap-2">
            <span className="bg-neutral-800 border border-purple-500 px-3 py-1 rounded-full text-sm">Player 2</span>
          </div>
        </div>
      </div>
    </main>
  )
}