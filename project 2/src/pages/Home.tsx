import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEnhancedNeighborhoods } from '../contexts/EnhancedNeighborhoodContext';
import { Search, BarChart3, Users, Shield, Star, TrendingUp, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();
  const { neighborhoods, getRecommendations, isLoading } = useEnhancedNeighborhoods();
  const navigate = useNavigate();

  const [dynamicStats, setDynamicStats] = React.useState({
    totalNeighborhoods: 0,
    totalReviews: 0,
    avgRating: 0,
  });

  const [recommendations, setRecommendations] = React.useState([]);

  React.useEffect(() => {
    if (user?.preferences) {
      const recs = getRecommendations(user.preferences);
      setRecommendations(recs);
    } else {
      setRecommendations([]);
    }
  }, [user, getRecommendations]);

  React.useEffect(() => {
    if (neighborhoods.length > 0) {
      const totalReviews = neighborhoods.reduce((sum, n) => sum + n.reviews.length, 0);
      const avgRating =
        neighborhoods.reduce((sum, n) => sum + n.ratings.overall, 0) / neighborhoods.length;

      setDynamicStats({
        totalNeighborhoods: neighborhoods.length,
        totalReviews,
        avgRating: Math.round(avgRating * 10) / 10,
      });
    }
  }, [neighborhoods]);

  const featuredNeighborhoods = React.useMemo(() => {
    return neighborhoods
      .sort((a, b) => b.ratings.overall - a.ratings.overall)
      .slice(0, 3);
  }, [neighborhoods]);

  const handleFeatureClick = (feature: string) => {
    switch (feature) {
      case 'search':
        navigate('/browse');
        break;
      case 'compare':
        user ? navigate('/compare') : navigate('/login');
        break;
      case 'reviews':
        navigate('/browse');
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Loading neighborhoods...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Neighborhood
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              Discover neighborhoods across India that match your lifestyle, compare communities, and make informed decisions about where to call home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/browse" className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center">
                <Search className="mr-2 h-5 w-5" />
                Browse Neighborhoods
              </Link>
              {!user && (
                <Link to="/register" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors inline-flex items-center justify-center">
                  Get Started Free
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Everything You Need to Find Home</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our comprehensive platform helps you make the best decision for your next move across India.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Search />, title: 'Smart Search', desc: 'Filter neighborhoods by price, safety, schools...', key: 'search' },
              { icon: <BarChart3 />, title: 'Comparison', desc: 'Compare up to 3 neighborhoods at once...', key: 'compare' },
              { icon: <Users />, title: 'Real Reviews', desc: 'Read reviews from actual residents...', key: 'reviews' }
            ].map(({ icon, title, desc, key }) => (
              <button
                key={key}
                onClick={() => handleFeatureClick(key)}
                className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
              >
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  {React.cloneElement(icon, { className: 'h-8 w-8 text-green-600 dark:text-green-400' })}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{desc}</p>
                <div className="flex items-center justify-center text-green-600 dark:text-green-400 font-medium">
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recommendations
      {user && recommendations.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Recommended for You</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">Based on your preferences and priorities</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {recommendations.map((n) => (
                <div key={n.id} className="bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  <img src={n.image} alt={n.name} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{n.name}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">{n.ratings?.overall ?? 'N/A'}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">{n.city}, {n.state}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{n.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                        ₹{n.priceRange?.min?.toLocaleString() ?? 0} - ₹{n.priceRange?.max?.toLocaleString() ?? 0}
                      </span>
                      <Link to={`/neighborhood/${n.id}`} className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )} */}

      {/* Featured Section */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Featured Neighborhoods</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Discover popular communities across India</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredNeighborhoods.map((n) => (
              <div key={n.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <img src={n.image} alt={n.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{n.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">{n.ratings.overall}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">{n.city}, {n.state}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{n.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                      ₹{n.priceRange.min.toLocaleString()} - ₹{n.priceRange.max.toLocaleString()}
                    </span>
                    <Link to={`/neighborhood/${n.id}`} className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/browse" className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center">
              View All Neighborhoods
              <TrendingUp className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {dynamicStats.totalNeighborhoods}+
              </div>
              <div className="text-gray-600 dark:text-gray-300">Neighborhoods Listed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {dynamicStats.totalReviews.toLocaleString()}+
              </div>
              <div className="text-gray-600 dark:text-gray-300">User Reviews</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {dynamicStats.avgRating}/5
              </div>
              <div className="text-gray-600 dark:text-gray-300">Average Rating</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
