import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEnhancedNeighborhoods } from '../contexts/EnhancedNeighborhoodContext';
import { Search, BarChart3, Users, Star, TrendingUp } from 'lucide-react';
import type { MatchScore } from '../services/matchingAlgorithm';

const Home: React.FC = () => {
  const { user } = useAuth();
  const {
    neighborhoods,
    matchScores,
    getRecommendations,
    isLoading
  } = useEnhancedNeighborhoods();
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState<MatchScore[]>([]);

  useEffect(() => {
    if (user?.preferences) {
      const recs = getRecommendations(user.preferences);
      setRecommendations(recs);
    }
  }, [user]);

  const featured = neighborhoods.slice(0, 3);

  const handleFeatureClick = (feature: string) => {
    if (feature === 'search') return navigate('/browse');
    if (feature === 'compare') return user ? navigate('/compare') : navigate('/login');
    if (feature === 'reviews') return navigate('/browse');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading neighborhoods...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 transition-colors">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white py-24">
        <div className="absolute inset-0 bg-black opacity-20" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Find Your Perfect{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-400">
              Neighborhood
            </span>
          </h1>
          <p className="text-xl mb-6">
            Discover real neighborhoods matched to your lifestyle using live data and smart scoring.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/browse"
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center"
            >
              <Search className="mr-2" /> Browse
            </Link>
            {!user && (
              <Link
                to="/register"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors flex items-center"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">All-in-One Tool Kit</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Smart search, comparison across real-world metrics, and community reviews in one place.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { id: 'search', icon: <Search />, title: 'Smart Search', desc: 'Filter by budget, safety, schools & more.' },
              { id: 'compare', icon: <BarChart3 />, title: 'Compare Neighborhoods', desc: 'Compare up to 3 at once.' },
              { id: 'reviews', icon: <Users />, title: 'Read Reviews', desc: 'See what locals think.' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => handleFeatureClick(f.id)}
                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:ring-2 hover:ring-green-400 transition"
              >
                <div className="h-12 w-12 mx-auto mb-4 text-green-600">{f.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">{f.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Section */}
      {user && recommendations.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
              Recommended for You
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
              Based on your preferences and live neighborhood data.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {recommendations.map((r: MatchScore, index) => (
                <div key={r.id || index} className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
                  <img
                    src={r.image || '/default-placeholder.png'}
                    alt={r.name || 'Neighborhood'}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{r.name || 'Unnamed Area'}</h3>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <span className="ml-1">
                          {r.overallRating !== undefined ? r.overallRating.toFixed(1) : 'N/A'}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {(r.city || 'Unknown')}, {(r.state || '')}
                    </p>
                    <div className="text-lg font-semibold text-green-600 dark:text-green-400 mb-4">
                      ₹{!isNaN(r.avgCost) ? Math.round(r.avgCost).toLocaleString() : 'N/A'}
                    </div>
                    <Link
                      to={`/neighborhood/${r.id || ''}`}
                      className="text-green-600 dark:text-green-400 font-medium hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Featured Neighborhoods</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featured.map(n => (
              <div key={n.id} className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
                <img src={n.image} alt={n.name} className="h-48 w-full object-cover"/>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{n.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <span className="ml-1">{n.ratings?.overall?.toFixed(1) ?? 'N/A'}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{n.city}, {n.state}</p>
                  <Link
                    to={`/neighborhood/${n.id}`}
                    className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/browse"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center mx-auto"
            >
              View All Neighborhoods <TrendingUp className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
