export default function TestHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">🏡</span>
            <h1 className="text-2xl font-bold text-gray-900">KINKIN</h1>
          </div>
        </div>
      </header>
      
      <main className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Help Neighbors, Earn Money, Level Up
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            KINKIN is running! Root page issue being debugged.
          </p>
          <a href="/signin" className="bg-emerald-600 text-white px-8 py-4 rounded-full hover:bg-emerald-700 inline-block">
            Sign In
          </a>
        </div>
      </main>
    </div>
  );
}
