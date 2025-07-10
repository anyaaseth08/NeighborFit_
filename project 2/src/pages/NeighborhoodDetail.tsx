import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEnhancedNeighborhoods } from '../contexts/EnhancedNeighborhoodContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Star, 
  MapPin, 
  DollarSign, 
  Users, 
  Shield, 
  GraduationCap, 
  Bus, 
  Coffee, 
  Plus,
  Check,
  ArrowLeft,
  ThumbsUp,
  Calendar,
  Edit,
  Trash2,
  Heart,
  Share2,
  AlertCircle,
  CheckCircle,
  Phone,
  Mail,
  User,
  Truck,
  Home,
  Zap,
  Wifi,
  Moon
} from 'lucide-react';

const NeighborhoodDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    neighborhoods, 
    addToCompare, 
    removeFromCompare, 
    compareList, 
    addReview,
    updateReview,
    deleteReview,
    markReviewHelpful,
    contactLocalAgent
  } = useEnhancedNeighborhoods();
  const { user } = useAuth();
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showMovingServices, setShowMovingServices] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    message: ''
  });
  const [isContacting, setIsContacting] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    content: '',
    pros: [''],
    cons: ['']
  });

  const neighborhood = neighborhoods.find(n => n.id === id);

  if (!neighborhood) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Neighborhood Not Found</h1>
          <Link to="/browse" className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  const isInCompareList = compareList.includes(neighborhood.id);
  const userReview = neighborhood.reviews.find(r => r.userId === user?.id);

  const handleCompareToggle = () => {
    if (isInCompareList) {
      removeFromCompare(neighborhood.id);
    } else {
      addToCompare(neighborhood.id);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${neighborhood.name} - NeighborFit`,
        text: `Check out ${neighborhood.name} in ${neighborhood.city}`,
        url: window.location.href,
      }).catch(() => {
        // Fallback if share fails
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      alert('Neighborhood saved to your favorites!');
    } else {
      alert('Neighborhood removed from favorites!');
    }
  };

  const handleContactAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsContacting(true);

    try {
      await contactLocalAgent(neighborhood.id, contactForm);
      alert('Your request has been sent to the local agent. They will contact you soon!');
      setShowContactModal(false);
      setContactForm({ name: user?.name || '', email: user?.email || '', phone: '', message: '' });
    } catch (error) {
      alert('Failed to send request. Please try again.');
    } finally {
      setIsContacting(false);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const reviewData = {
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      rating: reviewForm.rating,
      title: reviewForm.title,
      content: reviewForm.content,
      pros: reviewForm.pros.filter(p => p.trim()),
      cons: reviewForm.cons.filter(c => c.trim())
    };

    if (editingReview) {
      updateReview(editingReview, reviewData);
      setEditingReview(null);
    } else {
      addReview(neighborhood.id, reviewData);
    }

    setReviewForm({ rating: 5, title: '', content: '', pros: [''], cons: [''] });
    setShowReviewForm(false);
  };

  const handleEditReview = (review: any) => {
    setReviewForm({
      rating: review.rating,
      title: review.title,
      content: review.content,
      pros: review.pros.length > 0 ? review.pros : [''],
      cons: review.cons.length > 0 ? review.cons : ['']
    });
    setEditingReview(review.id);
    setShowReviewForm(true);
  };

  const handleDeleteReview = (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReview(reviewId);
    }
  };

  const addProsCons = (type: 'pros' | 'cons') => {
    setReviewForm(prev => ({
      ...prev,
      [type]: [...prev[type], '']
    }));
  };

  const updateProsCons = (type: 'pros' | 'cons', index: number, value: string) => {
    setReviewForm(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => i === index ? value : item)
    }));
  };

  const removeProsCons = (type: 'pros' | 'cons', index: number) => {
    setReviewForm(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const ratingCategories = [
    { key: 'safety', label: 'Safety', icon: Shield, color: 'text-green-600 dark:text-green-400' },
    { key: 'schools', label: 'Schools', icon: GraduationCap, color: 'text-green-600 dark:text-green-400' },
    { key: 'transit', label: 'Transit', icon: Bus, color: 'text-green-600 dark:text-green-400' },
    { key: 'nightlife', label: 'Nightlife', icon: Coffee, color: 'text-green-600 dark:text-green-400' },
    { key: 'cost', label: 'Cost of Living', icon: DollarSign, color: 'text-green-600 dark:text-green-400' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link
              to="/browse"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Browse
            </Link>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleSave}
                className={`flex items-center px-3 py-2 transition-colors ${
                  isSaved 
                    ? 'text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Heart className={`h-5 w-5 mr-1 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Saved' : 'Save'}
              </button>
              <button 
                onClick={handleShare}
                className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              >
                <Share2 className="h-5 w-5 mr-1" />
                Share
              </button>
              <button
                onClick={handleCompareToggle}
                disabled={!isInCompareList && compareList.length >= 3}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  isInCompareList
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : compareList.length >= 3
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isInCompareList ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Added to Compare
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    Add to Compare
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section with Gallery */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8 transition-colors">
          <div className="relative">
            <div className="h-64 md:h-80 relative">
              <img
                src={neighborhood.gallery[activeImageIndex]}
                alt={neighborhood.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                <div className="p-6 text-white">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{neighborhood.name}</h1>
                  <div className="flex items-center text-lg">
                    <MapPin className="h-5 w-5 mr-2" />
                    {neighborhood.city}, {neighborhood.state}
                  </div>
                </div>
              </div>
              
              {/* Gallery Navigation */}
              {neighborhood.gallery.length > 1 && (
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  {neighborhood.gallery.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`w-3 h-3 rounded-full ${
                        index === activeImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {neighborhood.gallery.length > 1 && (
              <div className="p-4 flex space-x-2 overflow-x-auto">
                {neighborhood.gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
                      index === activeImageIndex ? 'border-green-600' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${neighborhood.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Overview</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{neighborhood.description}</p>
              
              {/* Overall Rating */}
              <div className="flex items-center mb-6">
                <div className="flex items-center mr-4">
                  <Star className="h-6 w-6 text-yellow-400 fill-current" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white ml-2">
                    {neighborhood.ratings.overall}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">/ 5</span>
                </div>
                <span className="text-gray-600 dark:text-gray-400">
                  Based on {neighborhood.reviews.length} review{neighborhood.reviews.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {neighborhood.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full text-sm font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Explore More</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  to={`/schools/${neighborhood.id}`}
                  className="flex items-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                >
                  <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Schools</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Educational institutions</p>
                  </div>
                </Link>
                <Link
                  to={`/nightlife/${neighborhood.id}`}
                  className="flex items-center p-4 bg-purple-50 dark:bg-purple-900 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors"
                >
                  <Moon className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Nightlife</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Restaurants & bars</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Detailed Ratings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Detailed Ratings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ratingCategories.map(({ key, label, icon: Icon, color }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Icon className={`h-5 w-5 ${color} mr-3`} />
                      <span className="font-medium text-gray-900 dark:text-white">{label}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-3">
                        <div
                          className="bg-green-600 dark:bg-green-400 h-2 rounded-full"
                          style={{ width: `${(neighborhood.ratings[key as keyof typeof neighborhood.ratings] / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                        {neighborhood.ratings[key as keyof typeof neighborhood.ratings]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities & Nearby Places */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Amenities & Nearby Places</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Amenities</h3>
                  <ul className="space-y-2">
                    {neighborhood.amenities.map((amenity, index) => (
                      <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Nearby Places</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Hospitals</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{neighborhood.nearbyPlaces.hospitals.join(', ')}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Schools</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{neighborhood.nearbyPlaces.schools.join(', ')}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Shopping</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{neighborhood.nearbyPlaces.malls.join(', ')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Moving Services */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Moving Services</h2>
                <button
                  onClick={() => setShowMovingServices(!showMovingServices)}
                  className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium"
                >
                  {showMovingServices ? 'Hide' : 'Show'} Services
                </button>
              </div>

              {showMovingServices && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center mb-3">
                      <Truck className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Packers & Movers</h3>
                    </div>
                    <ul className="space-y-2">
                      {neighborhood.movingServices.packers.map((packer, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                          {packer}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center mb-3">
                      <Home className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Local Agents</h3>
                    </div>
                    <ul className="space-y-2">
                      {neighborhood.movingServices.localAgents.map((agent, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                          {agent}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center mb-3">
                      <Zap className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Utilities</h3>
                    </div>
                    <ul className="space-y-2">
                      {neighborhood.movingServices.utilities.map((utility, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                          {utility}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews</h2>
                {user && !userReview && (
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Write a Review
                  </button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && user && (
                <form onSubmit={handleReviewSubmit} className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    {editingReview ? 'Edit Review' : 'Write a Review'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rating
                      </label>
                      <select
                        value={reviewForm.rating}
                        onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                      >
                        {[5, 4, 3, 2, 1].map(rating => (
                          <option key={rating} value={rating}>
                            {rating} Star{rating !== 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={reviewForm.title}
                        onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                        placeholder="Summarize your experience"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Review
                    </label>
                    <textarea
                      value={reviewForm.content}
                      onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                      rows={4}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                      placeholder="Share your thoughts about this neighborhood"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Pros
                      </label>
                      {reviewForm.pros.map((pro, index) => (
                        <div key={index} className="flex mb-2">
                          <input
                            type="text"
                            value={pro}
                            onChange={(e) => updateProsCons('pros', index, e.target.value)}
                            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                            placeholder="What did you like?"
                          />
                          {reviewForm.pros.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeProsCons('pros', index)}
                              className="ml-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addProsCons('pros')}
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-sm"
                      >
                        + Add another pro
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Cons
                      </label>
                      {reviewForm.cons.map((con, index) => (
                        <div key={index} className="flex mb-2">
                          <input
                            type="text"
                            value={con}
                            onChange={(e) => updateProsCons('cons', index, e.target.value)}
                            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                            placeholder="What could be improved?"
                          />
                          {reviewForm.cons.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeProsCons('cons', index)}
                              className="ml-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addProsCons('cons')}
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-sm"
                      >
                        + Add another con
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      {editingReview ? 'Update Review' : 'Submit Review'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowReviewForm(false);
                        setEditingReview(null);
                        setReviewForm({ rating: 5, title: '', content: '', pros: [''], cons: [''] });
                      }}
                      className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {neighborhood.reviews.length > 0 ? (
                  neighborhood.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 dark:border-gray-600 pb-6 last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3">
                          {review.userAvatar && (
                            <img
                              src={review.userAvatar}
                              alt={review.userName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <div className="flex items-center mb-1">
                              <span className="font-medium text-gray-900 dark:text-white">{review.userName}</span>
                              <div className="flex items-center ml-3">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{review.title}</h4>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(review.date).toLocaleDateString()}
                          </div>
                          
                          {user && user.id === review.userId && (
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleEditReview(review)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteReview(review.id)}
                                className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-3">{review.content}</p>
                      
                      {(review.pros.length > 0 || review.cons.length > 0) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          {review.pros.length > 0 && (
                            <div>
                              <h5 className="font-medium text-green-800 dark:text-green-300 mb-2">Pros</h5>
                              <ul className="space-y-1">
                                {review.pros.map((pro, index) => (
                                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                    <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400 mr-2" />
                                    {pro}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {review.cons.length > 0 && (
                            <div>
                              <h5 className="font-medium text-red-800 dark:text-red-300 mb-2">Cons</h5>
                              <ul className="space-y-1">
                                {review.cons.map((con, index) => (
                                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                    <AlertCircle className="h-3 w-3 text-red-600 dark:text-red-400 mr-2" />
                                    {con}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <button 
                          onClick={() => user && markReviewHelpful(review.id, user.id)}
                          className="flex items-center hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                          disabled={!user}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Helpful ({review.helpful})
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No reviews yet. Be the first to share your experience!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Range */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Price Range</h3>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                  ₹{neighborhood.priceRange.min.toLocaleString()} - ₹{neighborhood.priceRange.max.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average monthly rent</p>
              </div>
            </div>

            {/* Demographics */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Demographics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Population</span>
                  <span className="font-medium text-gray-900 dark:text-white">{neighborhood.demographics.population.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Median Age</span>
                  <span className="font-medium text-gray-900 dark:text-white">{neighborhood.demographics.medianAge} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Median Income</span>
                  <span className="font-medium text-gray-900 dark:text-white">₹{neighborhood.demographics.medianIncome.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/browse"
                  className="block w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-center py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Browse Similar Areas
                </Link>
                {user && (
                  <Link
                    to="/compare"
                    className="block w-full bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Compare Neighborhoods
                  </Link>
                )}
                <button 
                  onClick={() => setShowContactModal(true)}
                  className="w-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 py-2 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                >
                  Contact Local Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Agent Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Local Agent</h3>
            <form onSubmit={handleContactAgent} className="space-y-4">
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

export default NeighborhoodDetail;