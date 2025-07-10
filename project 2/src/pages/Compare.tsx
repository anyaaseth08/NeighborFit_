import React, { useState } from 'react';
import { useEnhancedNeighborhoods } from '../contexts/EnhancedNeighborhoodContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Star, X, BarChart3, DollarSign, Shield, GraduationCap, Bus, Moon, MapPin, Phone, Mail, User } from 'lucide-react';

const Compare: React.FC = () => {
  const { neighborhoods, compareList, removeFromCompare, clearCompare, contactLocalAgent } = useEnhancedNeighborhoods();
  const { user } = useAuth();
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    message: ''
  });
  const [isContacting, setIsContacting] = useState(false);

  const compareNeighborhoods = neighborhoods.filter(n => compareList.includes(n.id));

  const handleContactAgent = async (neighborhoodId: string) => {
    setSelectedNeighborhood(neighborhoodId);
    setShowContactModal(true);
  };

  const submitContactForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsContacting(true);

    try {
      if (selectedNeighborhood) {
        await contactLocalAgent(selectedNeighborhood, contactForm);
        alert('Your request has been sent to the local agent. They will contact you soon!');
        setShowContactModal(false);
        setContactForm({ name: user?.name || '', email: user?.email || '', phone: '', message: '' });
      }
    } catch (error) {
      alert('Failed to send request. Please try again.');
    } finally {
      setIsContacting(false);
    }
  };

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <BarChart3 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No neighborhoods to compare</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Add neighborhoods to your comparison list to see them here.</p>
          <Link
            to="/browse"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Browse Neighborhoods
          </Link>
        </div>
      </div>
    );
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600 dark:text-green-400';
    if (rating >= 4.0) return 'text-green-600 dark:text-green-400';
    if (rating >= 3.5) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getRatingBg = (rating: number) => {
    if (rating >= 4.5) return 'bg-green-100 dark:bg-green-900';
    if (rating >= 4.0) return 'bg-green-100 dark:bg-green-900';
    if (rating >= 3.5) return 'bg-yellow-100 dark:bg-yellow-900';
    return 'bg-red-100 dark:bg-red-900';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Compare Neighborhoods</h1>
            <p className="text-gray-600 dark:text-gray-400">Side-by-side comparison of {compareNeighborhoods.length} neighborhoods</p>
          </div>
          <button
            onClick={clearCompare}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Comparison Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-48">
                    Neighborhood
                  </th>
                  {compareNeighborhoods.map((neighborhood) => (
                    <th key={neighborhood.id} className="px-6 py-4 text-center min-w-64">
                      <div className="relative">
                        <button
                          onClick={() => removeFromCompare(neighborhood.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <img
                          src={neighborhood.image}
                          alt={neighborhood.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{neighborhood.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{neighborhood.city}, {neighborhood.state}</p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {/* Overall Rating */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 mr-2" />
                      Overall Rating
                    </div>
                  </td>
                  {compareNeighborhoods.map((neighborhood) => (
                    <td key={neighborhood.id} className="px-6 py-4 whitespace-nowrap text-center">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRatingBg(neighborhood.ratings.overall)} ${getRatingColor(neighborhood.ratings.overall)}`}>
                        {neighborhood.ratings.overall}/5
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Price Range */}
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                      Price Range (₹)
                    </div>
                  </td>
                  {compareNeighborhoods.map((neighborhood) => (
                    <td key={neighborhood.id} className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                        ₹{neighborhood.priceRange.min.toLocaleString()} - ₹{neighborhood.priceRange.max.toLocaleString()}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Safety */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                      Safety
                    </div>
                  </td>
                  {compareNeighborhoods.map((neighborhood) => (
                    <td key={neighborhood.id} className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-600 dark:bg-green-400 h-2 rounded-full" 
                            style={{ width: `${(neighborhood.ratings.safety / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{neighborhood.ratings.safety}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Schools */}
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <GraduationCap className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                      Schools
                    </div>
                  </td>
                  {compareNeighborhoods.map((neighborhood) => (
                    <td key={neighborhood.id} className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-600 dark:bg-green-400 h-2 rounded-full" 
                            style={{ width: `${(neighborhood.ratings.schools / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{neighborhood.ratings.schools}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Transit */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <Bus className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                      Transit
                    </div>
                  </td>
                  {compareNeighborhoods.map((neighborhood) => (
                    <td key={neighborhood.id} className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-600 dark:bg-green-400 h-2 rounded-full" 
                            style={{ width: `${(neighborhood.ratings.transit / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{neighborhood.ratings.transit}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Nightlife */}
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <Moon className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                      Nightlife
                    </div>
                  </td>
                  {compareNeighborhoods.map((neighborhood) => (
                    <td key={neighborhood.id} className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-600 dark:bg-green-400 h-2 rounded-full" 
                            style={{ width: `${(neighborhood.ratings.nightlife / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{neighborhood.ratings.nightlife}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Population */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                      Population
                    </div>
                  </td>
                  {compareNeighborhoods.map((neighborhood) => (
                    <td key={neighborhood.id} className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {neighborhood.demographics.population.toLocaleString()}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Median Age */}
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    Median Age
                  </td>
                  {compareNeighborhoods.map((neighborhood) => (
                    <td key={neighborhood.id} className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {neighborhood.demographics.medianAge} years
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Median Income */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    Median Income (₹)
                  </td>
                  {compareNeighborhoods.map((neighborhood) => (
                    <td key={neighborhood.id} className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm text-gray-900 dark:text-white">
                        ₹{neighborhood.demographics.medianIncome.toLocaleString()}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Features */}
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    Key Features
                  </td>
                  {compareNeighborhoods.map((neighborhood) => (
                    <td key={neighborhood.id} className="px-6 py-4 text-center">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {neighborhood.features.slice(0, 4).map((feature) => (
                          <span
                            key={feature}
                            className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                        {neighborhood.features.length > 4 && (
                          <span className="inline-block bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                            +{neighborhood.features.length - 4} more
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Actions */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    Actions
                  </td>
                  {compareNeighborhoods.map((neighborhood) => (
                    <td key={neighborhood.id} className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="space-y-2">
                        <Link
                          to={`/neighborhood/${neighborhood.id}`}
                          className="block bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleContactAgent(neighborhood.id)}
                          className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Contact Agent
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Add More Button */}
        {compareList.length < 3 && (
          <div className="mt-8 text-center">
            <Link
              to="/browse"
              className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              Add More Neighborhoods
            </Link>
          </div>
        )}
      </div>

      {/* Contact Agent Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Local Agent</h3>
            <form onSubmit={submitContactForm} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Tell us about your requirements..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isContacting}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isContacting ? 'Sending...' : 'Send Request'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compare;