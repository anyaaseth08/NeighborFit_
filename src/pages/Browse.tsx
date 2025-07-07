import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useEnhancedNeighborhoods } from '../contexts/EnhancedNeighborhoodContext';
import { Search, Filter, Star, Plus, Check, MapPin, Grid, List, SortAsc } from 'lucide-react';

const Browse: React.FC = () => {
  const { 
    filteredNeighborhoods, 
    filters, 
    setFilters, 
    compareList, 
    addToCompare, 
    removeFromCompare,
    searchNeighborhoods
  } = useEnhancedNeighborhoods();
  
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(filteredNeighborhoods);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (searchTerm.trim()) {
      setSearchResults(searchNeighborhoods(searchTerm));
    } else {
      setSearchResults(filteredNeighborhoods);
    }
  }, [searchTerm, filteredNeighborhoods, searchNeighborhoods]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleFeatureToggle = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature];
    handleFilterChange('features', newFeatures);
  };

  const clearAllFilters = () => {
    setFilters({
      priceRange: [15000, 150000],
      minSafety: 0,
      minSchools: 0,
      minTransit: 0,
      features: [],
      city: '',
      sortBy: 'name'
    });
    setSearchTerm('');
  };

  const isInCompareList = (id: string) => compareList.includes(id);

  const handleCompareToggle = (id: string) => {
    if (isInCompareList(id)) {
      removeFromCompare(id);
    } else {
      addToCompare(id);
    }
  };

  const availableFeatures = [
    'tech-hub', 'modern', 'family-friendly', 'nightlife', 'affordable', 'walkable',
    'metro', 'shopping', 'restaurants', 'schools', 'it-sector', 'upscale',
    'historic', 'commercial', 'seafront', 'planned', 'educational', 'biotech',
    'trendy', 'pubs', 'social', 'bollywood', 'coastal', 'art-deco', 'premium',
    'scenic', 'iconic', 'lake-view', 'it-companies', 'international-companies',
    'residential', 'it-corridor', 'central', 'startups', 'high-rise', 'gated-community',
    'golf-course', 'luxury', 'market', 'cultural', 'food', 'parks', 'airport-proximity',
    'malls'
  ];

  const cities = ['Bangalore', 'Mumbai', 'Delhi', 'Gurgaon', 'Hyderabad', 'Kolkata', 'Noida'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Browse Neighborhoods</h1>
          <p className="text-gray-600 dark:text-gray-300">Find your perfect community across India with our advanced search and filtering tools.</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-colors">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search neighborhoods, cities, or features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'} transition-colors`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'} transition-colors`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
            >
              <Filter className="mr-2 h-5 w-5" />
              Filters
              {(filters.features.length > 0 || filters.city || filters.minSafety > 0 || filters.minSchools > 0 || filters.minTransit > 0) && (
                <span className="ml-2 bg-green-600 text-white text-xs rounded-full px-2 py-1">
                  Active
                </span>
              )}
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price Range (₹)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="15000"
                      max="150000"
                      step="5000"
                      value={filters.priceRange[0]}
                      onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
                      className="w-full"
                    />
                    <input
                      type="range"
                      min="15000"
                      max="150000"
                      step="5000"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>₹{filters.priceRange[0].toLocaleString()}</span>
                      <span>₹{filters.priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* City Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City
                  </label>
                  <select
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Cities</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                    <option value="rating">Rating</option>
                    <option value="popularity">Popularity</option>
                  </select>
                </div>

                {/* Safety Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Min Safety Rating
                  </label>
                  <select
                    value={filters.minSafety}
                    onChange={(e) => handleFilterChange('minSafety', parseFloat(e.target.value))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value={0}>Any</option>
                    <option value={3}>3+ Stars</option>
                    <option value={4}>4+ Stars</option>
                    <option value={4.5}>4.5+ Stars</option>
                  </select>
                </div>
              </div>

              {/* Features */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Neighborhood Features
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableFeatures.map((feature) => (
                    <button
                      key={feature}
                      onClick={() => handleFeatureToggle(feature)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        filters.features.includes(feature)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={clearAllFilters}
                  className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Showing {searchResults.length} neighborhood{searchResults.length !== 1 ? 's' : ''}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
          <div className="flex items-center space-x-2">
            <SortAsc className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Sorted by {filters.sortBy}
            </span>
          </div>
        </div>

        {/* Neighborhood Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((neighborhood) => (
              <div key={neighborhood.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={neighborhood.image}
                    alt={neighborhood.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => handleCompareToggle(neighborhood.id)}
                    disabled={!isInCompareList(neighborhood.id) && compareList.length >= 3}
                    className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
                      isInCompareList(neighborhood.id)
                        ? 'bg-green-600 text-white'
                        : compareList.length >= 3
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {isInCompareList(neighborhood.id) ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Plus className="h-5 w-5" />
                    )}
                  </button>
                  <div className="absolute bottom-2 left-2">
                    <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                      {neighborhood.reviews.length} review{neighborhood.reviews.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{neighborhood.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">{neighborhood.ratings.overall}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{neighborhood.city}, {neighborhood.state}</span>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{neighborhood.description}</p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {neighborhood.features.slice(0, 3).map((feature) => (
                      <span
                        key={feature}
                        className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                    {neighborhood.features.length > 3 && (
                      <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full">
                        +{neighborhood.features.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                      ₹{neighborhood.priceRange.min.toLocaleString()} - ₹{neighborhood.priceRange.max.toLocaleString()}
                    </span>
                    <Link
                      to={`/neighborhood/${neighborhood.id}`}
                      className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {searchResults.map((neighborhood) => (
              <div key={neighborhood.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex">
                  <div className="relative w-48 h-32">
                    <img
                      src={neighborhood.image}
                      alt={neighborhood.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleCompareToggle(neighborhood.id)}
                      disabled={!isInCompareList(neighborhood.id) && compareList.length >= 3}
                      className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${
                        isInCompareList(neighborhood.id)
                          ? 'bg-green-600 text-white'
                          : compareList.length >= 3
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {isInCompareList(neighborhood.id) ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{neighborhood.name}</h3>
                        <div className="flex items-center text-gray-600 dark:text-gray-400 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{neighborhood.city}, {neighborhood.state}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">{neighborhood.ratings.overall}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-3">{neighborhood.description}</p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {neighborhood.features.slice(0, 5).map((feature) => (
                        <span
                          key={feature}
                          className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                        ₹{neighborhood.priceRange.min.toLocaleString()} - ₹{neighborhood.priceRange.max.toLocaleString()}
                      </span>
                      <Link
                        to={`/neighborhood/${neighborhood.id}`}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {searchResults.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No neighborhoods found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm 
                  ? `No neighborhoods match your search for "${searchTerm}"`
                  : "No neighborhoods match your current filters"
                }
              </p>
              <button
                onClick={clearAllFilters}
                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium"
              >
                Clear all filters and search
              </button>
            </div>
          </div>
        )}

        {/* Compare Bar */}
        {compareList.length > 0 && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            <div className="flex items-center space-x-4">
              <span>{compareList.length} neighborhood{compareList.length !== 1 ? 's' : ''} selected</span>
              <Link
                to="/compare"
                className="bg-white text-green-600 px-4 py-1 rounded font-medium hover:bg-gray-100 transition-colors"
              >
                Compare
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;