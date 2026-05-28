'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ProviderProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingModal, setBookingModal] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchProvider() {
      if (!params.id) return;

      try {
        const { data, error } = await supabase
          .from('listings')
          .select(`
            *,
            users (name, avatar_url, rating, review_count, verified_at),
            service_categories (name, slug, icon_emoji, description),
            reviews (rating, comment, created_at)
          `)
          .eq('id', params.id)
          .single();

        if (data) setProvider(data);
      } catch (err) {
        console.error('Error fetching provider:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProvider();
  }, [params.id, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading provider profile...</p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Provider Not Found</h2>
          <Link href="/browse" className="text-emerald-600 hover:underline">
            ← Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/browse" className="text-gray-600 hover:text-gray-900">
              ← Back to Browse
            </Link>
            <button
              onClick={() => setBookingModal(true)}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
            >
              Book Now
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Provider Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-start gap-6 mb-6">
            {provider.users?.avatar_url ? (
              <img
                src={provider.users.avatar_url}
                alt={provider.users.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-5xl">
                👤
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{provider.users?.name}</h1>
              <div className="flex items-center gap-4 text-lg">
                <span className="flex items-center gap-1">
                  ⭐ {provider.users?.rating || 'New'}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{provider.users?.review_count || 0} reviews</span>
                <span className="text-gray-400">•</span>
                <span className="text-emerald-600 font-medium">
                  {provider.service_categories?.name}
                </span>
              </div>
              {provider.users?.verified_at && (
                <div className="mt-2 text-sm text-emerald-600">✓ Verified Member</div>
              )}
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{provider.title}</h2>
            <p className="text-gray-600 text-lg mb-6">{provider.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-emerald-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  ${provider.price_per_hour || provider.price_flat}
                </div>
                <div className="text-sm text-gray-600">per hour</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {provider.service_radius_km || 0.5} km
                </div>
                <div className="text-sm text-gray-600">service radius</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  Level {provider.level || 1}
                </div>
                <div className="text-sm text-gray-600">provider level</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {provider.xp_total || 0} XP
                </div>
                <div className="text-sm text-gray-600">total earned</div>
              </div>
            </div>
          </div>
        </div>

        {/* Availability */}
        {provider.availability && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📅 Availability</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(provider.availability).map(([day, slots]: [string, any]) => (
                <div key={day} className="border rounded-lg p-3">
                  <div className="font-semibold text-gray-900 capitalize mb-2">{day}</div>
                  <div className="text-sm text-gray-600">
                    {Array.isArray(slots) && slots.length > 0
                      ? slots.join(', ')
                      : 'Not available'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">⭐ Reviews</h2>
          {provider.reviews && provider.reviews.length > 0 ? (
            <div className="space-y-4">
              {provider.reviews.map((review: any, idx: number) => (
                <div key={idx} className="border-b pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              <div className="text-4xl mb-4">📝</div>
              <p>No reviews yet. Be the first to book!</p>
            </div>
          )}
        </div>
      </main>

      {/* Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Book {provider.users?.name}</h2>
            <p className="text-gray-600 mb-6">{provider.title}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell me about your needs..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setBookingModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">&copy; 2026 KINKIN. Built with ⚡ by YBOT for TOBY NG</p>
        </div>
      </footer>
    </div>
  );
}
