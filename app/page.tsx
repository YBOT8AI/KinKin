import Link from 'next/link';

// Service categories
const CATEGORIES = [
  { slug: 'home_repair', name: 'Home Repairs', icon: '🔧', description: 'Fix appliances, plumbing, electrical' },
  { slug: 'car_maintenance', name: 'Car Maintenance', icon: '🚗', description: 'Oil change, tire rotation, detailing' },
  { slug: 'cooking', name: 'Home-Cooked Meals', icon: '🍳', description: 'Daily meals, batch cooking, special diets' },
  { slug: 'childcare', name: 'Nanny/Childcare', icon: '👶', description: 'After-school care, babysitting, tutoring' },
  { slug: 'pet_sitting', name: 'Pet Sitting', icon: '🐾', description: 'Dog walking, feeding, overnight stays' },
  { slug: 'funeral_prayer', name: 'Funeral/Ancestor Prayer', icon: '🙏', description: 'Graveyard visits, prayer ceremonies' },
];

export default function Home() {
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
              <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">How it Works</Link>
              <Link href="/signin" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
                Sign In
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Help Neighbors, Earn Money, Level Up
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Connect with nearby residents for everyday services. 
            Build your reputation. Get rewarded for good work.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="What service do you need? (e.g., plumber, cook, pet sitter)"
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-full focus:border-emerald-500 focus:outline-none shadow-lg"
              />
              <button className="absolute right-2 top-2 bg-emerald-600 text-white px-8 py-2 rounded-full hover:bg-emerald-700">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Service Categories
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/browse/${category.slug}`}
                className="p-6 rounded-xl border-2 border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="text-5xl mb-4">{category.icon}</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {category.name}
                </h4>
                <p className="text-gray-600">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">How KINKIN Works</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-6xl mb-4">📍</div>
              <h4 className="text-xl font-semibold mb-2">1. Find Nearby Providers</h4>
              <p className="text-emerald-100">
                Search for services in your neighborhood. Higher-rated providers reach farther.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-6xl mb-4">🤝</div>
              <h4 className="text-xl font-semibold mb-2">2. Book & Connect</h4>
              <p className="text-emerald-100">
                Message providers, schedule services, and pay securely through the platform.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-6xl mb-4">⭐</div>
              <h4 className="text-xl font-semibold mb-2">3. Rate & Level Up</h4>
              <p className="text-emerald-100">
                Leave reviews. Providers earn XP, level up, and unlock bigger service areas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gamification Teaser */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">
            Turn Good Service Into Rewards
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-2">🌱</div>
              <div className="font-semibold">Neighbor</div>
              <div className="text-sm text-gray-600">Level 1</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-2">🏡</div>
              <div className="font-semibold">Helper</div>
              <div className="text-sm text-gray-600">Level 2</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-2">🛠️</div>
              <div className="font-semibold">Pro</div>
              <div className="text-sm text-gray-600">Level 3</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-2">⭐</div>
              <div className="font-semibold">Expert</div>
              <div className="text-sm text-gray-600">Level 4+</div>
            </div>
          </div>
          
          <p className="mt-8 text-gray-600">
            Complete jobs → Earn XP → Level up → Serve larger area → Earn more
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🏡</span>
                <h4 className="text-xl font-bold">KINKIN</h4>
              </div>
              <p className="text-gray-400">
                Building stronger neighborhoods, one service at a time.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">For Customers</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/browse" className="hover:text-white">Browse Services</Link></li>
                <li><Link href="/how-to-book" className="hover:text-white">How to Book</Link></li>
                <li><Link href="/safety" className="hover:text-white">Safety & Trust</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">For Providers</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/become-provider" className="hover:text-white">Become a Provider</Link></li>
                <li><Link href="/level-system" className="hover:text-white">Level System</Link></li>
                <li><Link href="/earnings" className="hover:text-white">Earnings Calculator</Link></li>
                <li><Link href="/success-stories" className="hover:text-white">Success Stories</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2026 KINKIN. Built with ⚡ by YBOT for TOBY NG</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
