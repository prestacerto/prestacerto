export default function Home() {
  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">PrestaCerto - APIs Live</h1>
      <div className="space-y-4">
        <div className="bg-green-100 p-4 rounded">✅ /api/badges/calculate</div>
        <div className="bg-green-100 p-4 rounded">✅ /api/match/score</div>
        <div className="bg-green-100 p-4 rounded">✅ /api/timing/optimal</div>
        <div className="bg-green-100 p-4 rounded">✅ /api/pricing/recommend</div>
        <div className="bg-green-100 p-4 rounded">✅ /api/trending/alerts</div>
        <div className="bg-green-100 p-4 rounded">✅ /api/insights/market</div>
        <p className="text-sm text-gray-600 mt-8">All 4 new products deployed and ready!</p>
      </div>
    </main>
  );
}
