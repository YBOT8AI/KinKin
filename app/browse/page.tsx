'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const CATEGORIES = [
  { slug: 'home_repair', name: 'Home Repairs', icon: '🔧' },
  { slug: 'car_maintenance', name: 'Car Maintenance', icon: '🚗' },
  { slug: 'cooking', name: 'Home-Cooked Meals', icon: '🍳' },
  { slug: 'childcare', name: 'Nanny/Childcare', icon: '👶' },
  { slug: 'pet_sitting', name: 'Pet Sitting', icon: '🐾' },
  { slug: 'funeral_prayer', name: 'Funeral/Ancestor Prayer', icon: '🙏' },
];

export default function BrowsePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('');
  const supabase = createClientComponentClient();

  // Fetch providers by category
  useEffect(() => {
    async function fetchProviders() {
      if (!selectedCategory) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('listings')
          .select(`
            *,
            users (name, avatar_url, rating),
            service_categories (name, slug)
          `)
          .eq('service_categories.slug', selectedCategory)
          .eq('is_active', true);

        if (data) setProviders(data);
      } catch (err) {
        console.error('Error fetching providers:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProviders();
  }, [selectedCategory, supabase]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-3xl">🏡</span>
              <h1 className="text-2xl font-bold text-gray-900">KINKIN</h1>
            </Link>
            <nav className="flex items-center space-x-4">
              <Link href="/signin" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
                Sign In
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse Services</h2>

        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Filter by Category</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full border-2 transition-all ${
                !selectedCategory
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-full border-2 transition-all flex items-center gap-2 ${
                  selectedCategory === cat.slug
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Location Search */}
        <div className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter your location (e.g., Central, HK)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
            />
            <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700">
              Search Nearby
            </button>
          </div>
        </div>

        {/* Providers List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-gray-600">Loading providers...</p>
            </div>
          ) : providers.length > 0 ? (
            providers.map((provider: any) => (
              <Link
                key={provider.id}
                href={`/providers/${provider.id}`}
                className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-emerald-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  {provider.users?.avatar_url ? (
                    <img
                      src={provider.users.avatar_url}
                      alt={provider.users.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-2xl">
                      👤
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900">{provider.users?.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>⭐ {provider.users?.rating || 'New'}</span>
                      <span>•</span>
                      <span className="text-emerald-600">{provider.service_categories?.name}</span>
                    </div>
                  </div>
                </div>
                <h5 className="font-medium text-gray-900 mb-2">{provider.title}</h5>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{provider.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-600 font-semibold">
                    ${provider.price_per_hour || provider.price_flat}/hr
                  </span>
                  <span className="text-sm text-gray-500">View Profile →</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {selectedCategory ? 'No providers found' : 'Select a category to browse'}
              </h3>
              <p className="text-gray-600">
                {selectedCategory
                  ? 'Be the first to offer this service in your area!'
                  : 'Choose from the categories above to find nearby providers.'}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">&copy; 2026 KINKIN. Built with ⚡ by YBOT for TOBY NG</p>
        </div>
      </footer>
    </div>
  );
}
