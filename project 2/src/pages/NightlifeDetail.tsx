import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Moon, Star, MapPin, Clock, Music, Users, Wine, Camera } from 'lucide-react';

const NightlifeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [reservationForm, setReservationForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock nightlife data based on neighborhood
  const getNightlifeForNeighborhood = (neighborhoodId: string) => {
    const nightlifeData: Record<string, any[]> = {
      '1': [ // Koramangala
        {
          id: '1',
          name: 'Toit Brewpub',
          type: 'Brewery & Restaurant',
          rating: 4.4,
          priceRange: '₹1,500 - ₹3,000 for two',
          timings: '12:00 PM - 1:00 AM',
          image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
          description: 'Popular microbrewery known for craft beers, live music, and vibrant atmosphere.',
          features: ['Live Music', 'Craft Beer', 'Rooftop Seating', 'DJ Nights', 'Happy Hours'],
          cuisine: ['Continental', 'Asian', 'Indian'],
          specialties: ['Craft Beer', 'Wood Fired Pizza', 'Live Performances'],
          address: 'Koramangala, Bangalore',
          ambiance: 'Casual, Lively, Music-focused',
          capacity: 200,
          events: ['Live Band Nights', 'DJ Sets', 'Beer Festivals', 'Open Mic']
        }
      ],
      '2': [ // Bandra West
        {
          id: '2',
          name: 'Bastian',
          type: 'Fine Dining & Bar',
          rating: 4.6,
          priceRange: '₹3,000 - ₹5,000 for two',
          timings: '7:00 PM - 1:30 AM',
          image: 'https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&w=800',
          description: 'Upscale seafood restaurant and bar with celebrity chef cuisine and premium cocktails.',
          features: ['Celebrity Chef', 'Premium Cocktails', 'Seafood Speciality', 'Rooftop Bar', 'VIP Seating'],
          cuisine: ['Seafood', 'Continental', 'Mediterranean'],
          specialties: ['Fresh Seafood', 'Craft Cocktails', 'Wine Selection'],
          address: 'Bandra West, Mumbai',
          ambiance: 'Upscale, Sophisticated, Trendy',
          capacity: 150,
          events: ['Wine Tasting', 'Chef Specials', 'Celebrity Nights', 'Private Parties']
        }
      ],
      '9': [ // Powai
        {
          id: '9',
          name: 'The Bar Stock Exchange',
          type: 'Sports Bar & Lounge',
          rating: 4.3,
          priceRange: '₹2,000 - ₹4,000 for two',
          timings: '6:00 PM - 1:00 AM',
          image: 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=800',
          description: 'Unique concept bar where drink prices fluctuate like stock market based on demand.',
          features: ['Stock Market Concept', 'Live Sports', 'Happy Hours', 'Corporate Events', 'Game Zone'],
          cuisine: ['North Indian', 'Continental', 'Chinese'],
          specialties: ['Dynamic Pricing', 'Sports Viewing', 'Corporate Parties'],
          address: 'Powai, Mumbai',
          ambiance: 'Corporate, Energetic, Sports-focused',
          capacity: 180,
          events: ['Match Screenings', 'Corporate Events', 'Theme Nights', 'Happy Hours']
        }
      ]
    };

    return nightlifeData[neighborhoodId] || nightlifeData['1'];
  };

  const venues = getNightlifeForNeighborhood(id || '1');
  const venue = venues[0];

  const handleMakeReservation = () => {
    setShowReservationModal(true);
  };

  const handleViewMenu = () => {
    // In a real app, this would open a menu PDF or page
    alert('Menu will be displayed here. In a real app, this would show the full menu with prices.');
  };

  const handleGetDirections = () => {
    // In a real app, this would open maps
    alert('Opening directions in your default maps app...');
  };

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    alert('Reservation request sent! The venue will contact you to confirm your booking.');
    setShowReservationModal(false);
    setReservationForm({ name: '', email: '', phone: '', date: '', time: '', guests: '2' });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to={`/neighborhood/${id}`}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Neighborhood
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8 transition-colors">
          <div className="relative h-64 md:h-80">
            <img
              src={venue.image}
              alt={venue.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-6 text-white">
                <div className="flex items-center mb-2">
                  <Moon className="h-8 w-8 mr-3" />
                  <h1 className="text-3xl md:text-4xl font-bold">{venue.name}</h1>
                </div>
                <div className="flex items-center text-lg">
                  <MapPin className="h-5 w-5 mr-2" />
                  {venue.address}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Venue Overview</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{venue.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white ml-1">{venue.rating}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{venue.capacity}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Capacity</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">{venue.type}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Type</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">{venue.ambiance.split(',')[0]}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Ambiance</div>
                </div>
              </div>
            </div>

            {/* Features & Specialties */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Features & Specialties</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Features</h3>
                  <div className="space-y-2">
                    {venue.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <Music className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                        <span className="text-gray-900 dark:text-white">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Specialties</h3>
                  <div className="space-y-2">
                    {venue.specialties.map((specialty: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <Wine className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                        <span className="text-gray-900 dark:text-white">{specialty}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Events & Entertainment */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Events & Entertainment</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {venue.events.map((event: string, index: number) => (
                  <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Camera className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{event}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Price Range</span>
                  <span className="font-medium text-green-600 dark:text-green-400">{venue.priceRange}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400 mr-2" />
                  <span className="text-gray-900 dark:text-white">{venue.timings}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-gray-600 dark:text-gray-400 mr-2" />
                  <span className="text-gray-900 dark:text-white">Capacity: {venue.capacity}</span>
                </div>
              </div>
            </div>

            {/* Cuisine */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cuisine Types</h3>
              <div className="flex flex-wrap gap-2">
                {venue.cuisine.map((type: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full text-sm"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={handleMakeReservation}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Make Reservation
                </button>
                <button 
                  onClick={handleViewMenu}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Menu
                </button>
                <button 
                  onClick={handleGetDirections}
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      {showReservationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Make Reservation at {venue.name}</h3>
            <form onSubmit={handleReservationSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={reservationForm.name}
                  onChange={(e) => setReservationForm({ ...reservationForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={reservationForm.email}
                  onChange={(e) => setReservationForm({ ...reservationForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={reservationForm.phone}
                  onChange={(e) => setReservationForm({ ...reservationForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={reservationForm.date}
                    onChange={(e) => setReservationForm({ ...reservationForm, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={reservationForm.time}
                    onChange={(e) => setReservationForm({ ...reservationForm, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Number of Guests
                </label>
                <select
                  value={reservationForm.guests}
                  onChange={(e) => setReservationForm({ ...reservationForm, guests: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Booking...' : 'Book Table'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReservationModal(false)}
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

export default NightlifeDetail;