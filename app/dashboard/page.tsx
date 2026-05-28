import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">🏡</span>
              <h1 className="text-2xl font-bold text-gray-900">KINKIN</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/browse" className="text-gray-600 hover:text-gray-900">Browse</Link>
              <Link href="/dashboard" className="text-emerald-600 font-medium">Dashboard</Link>
              <form action="/auth/signout" method="post">
                <button type="submit" className="text-gray-600 hover:text-gray-900">
                  Sign Out
                </button>
              </form>
            </nav>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.user_metadata?.name || user.email}! 👋
          </h2>
          <p className="text-gray-600 mt-2">Manage your neighborhood services</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Level Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Your Level</h3>
              <span className="text-4xl">{profile ? getLevelIcon(profile.level) : '🌱'}</span>
            </div>
            <div className="text-3xl font-bold text-emerald-600 mb-1">
              {profile ? getLevelTitle(profile.level) : 'Neighbor'}
            </div>
            <div className="text-sm text-gray-500">
              Level {profile?.level || 1} • {profile?.xp_total || 0} XP
            </div>
            {profile && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${getLevelProgress(profile.level, profile.xp_current)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {getXPToNextLevel(profile.level, profile.xp_current)} XP to next level
                </div>
              </div>
            )}
          </div>

          {/* Rating Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Rating</h3>
              <span className="text-4xl">⭐</span>
            </div>
            <div className="text-3xl font-bold text-emerald-600 mb-1">
              {profile?.rating?.toFixed(1) || '--'}
            </div>
            <div className="text-sm text-gray-500">
              {profile?.review_count || 0} reviews
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Higher rating = larger service area
            </div>
          </div>

          {/* Service Area Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Service Area</h3>
              <span className="text-4xl">📍</span>
            </div>
            <div className="text-3xl font-bold text-emerald-600 mb-1">
              {profile ? calculateRadius(profile.rating || 0, profile.review_count || 0).toFixed(1) : '0.5'} km
            </div>
            <div className="text-sm text-gray-500">
              Dynamic radius based on rating
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Level up to serve more neighbors
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/dashboard/listings"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="text-4xl">📝</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Manage Listings</h3>
                <p className="text-gray-600">Create or edit your service offerings</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/orders"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="text-4xl">📋</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">View Orders</h3>
                <p className="text-gray-600">Manage your bookings and earnings</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/profile"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="text-4xl">👤</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
                <p className="text-gray-600">Update your bio, skills, and availability</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/achievements"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="text-4xl">🏆</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
                <p className="text-gray-600">Track your badges and milestones</p>
              </div>
            </div>
          </Link>
        </div>

        {/* No Profile CTA */}
        {!profile && (
          <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-emerald-900 mb-2">
              🎉 Complete Your Profile
            </h3>
            <p className="text-emerald-700 mb-4">
              Set up your provider profile to start offering services and earning money in your neighborhood!
            </p>
            <Link
              href="/dashboard/profile"
              className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition"
            >
              Create Profile
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}

// Helper functions (should match lib/gamification.ts)
function getLevelIcon(level: number): string {
  const icons = ['🌱', '🏡', '🛠️', '⭐', '🏆', '👑']
  return icons[Math.min(level - 1, icons.length - 1)]
}

function getLevelTitle(level: number): string {
  const titles = ['Neighbor', 'Helper', 'Pro', 'Expert', 'Legend', 'Community Hero']
  return titles[Math.min(level - 1, titles.length - 1)]
}

function getLevelProgress(level: number, xpCurrent: number): number {
  const levels = [0, 100, 300, 750, 1500, 3000]
  const current = levels[level - 1] || 0
  const next = levels[level] || 3000
  const xpInRange = xpCurrent - current
  const xpNeeded = next - current
  return Math.min(100, Math.round((xpInRange / xpNeeded) * 100))
}

function getXPToNextLevel(level: number, xpCurrent: number): number {
  const levels = [0, 100, 300, 750, 1500, 3000]
  const next = levels[level] || 3000
  return Math.max(0, next - xpCurrent)
}

function calculateRadius(avgRating: number, reviewCount: number): number {
  const baseRadius = 0.5
  const radiusPerStar = 0.9
  const reviewWeight = Math.min(reviewCount / 10.0, 1.0)
  return baseRadius + (avgRating * radiusPerStar * reviewWeight)
}
