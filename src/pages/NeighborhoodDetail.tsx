import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEnhancedNeighborhoods } from '../contexts/EnhancedNeighborhoodContext';
import { Star, MapPin, Building, PhoneCall } from 'lucide-react';

const NeighborhoodDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { neighborhoods, isLoading, contactLocalAgent } = useEnhancedNeighborhoods();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (isLoading) {
    return <div className="p-8 text-center text-xl">Loading neighborhood...</div>;
  }

  const neighborhood = neighborhoods.find(n => n.id === id);

  if (!neighborhood) {
    return <div className="p-8 text-center text-red-500">Neighborhood not found.</div>;
  }

  // Defensive default if gallery is missing
  const gallery = neighborhood.gallery?.length ? neighborhood.gallery : [neighborhood.image || ''];

  const handleSubmit = async () => {
    if (!userEmail.trim()) return;

    setIsSubmitting(true);
    const success = await contactLocalAgent(neighborhood.id, {
      email: userEmail,
      message: userMessage
    });
    setSubmitSuccess(success);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Image gallery */}
        <div className="w-full h-64 sm:h-96 rounded-lg overflow-hidden shadow-lg">
          <img
            src={gallery[activeImageIndex]}
            alt={neighborhood.name}
            className="w-full h-full object-cover"
          />
        </div>

        {gallery.length > 1 && (
          <div className="p-4 flex space-x-2 overflow-x-auto">
            {gallery.map((image, index) => (
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

        {/* Neighborhood info */}
        <h1 className="text-3xl font-bold mt-6 mb-2">{neighborhood.name}</h1>
        <div className="flex items-center space-x-2 mb-4">
          <MapPin className="w-5 h-5 text-green-500" />
          <span>
            {neighborhood.city}, {neighborhood.state}
          </span>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {neighborhood.description || 'No description available.'}
        </p>

        {/* Ratings */}
        <div className="flex items-center space-x-2 mb-2">
          <Star className="w-5 h-5 text-yellow-400" />
          <span>
            {neighborhood.ratings?.overall?.toFixed(1) ?? 'N/A'} / 5 rating
          </span>
        </div>

        {/* Price */}
        <p className="text-lg font-semibold text-green-600 dark:text-green-400 mb-4">
          ₹{neighborhood.priceRange?.min?.toLocaleString() ?? '—'} - ₹{neighborhood.priceRange?.max?.toLocaleString() ?? '—'}
        </p>

        {/* Features */}
        {neighborhood.features?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Key Features</h3>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
              {neighborhood.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Amenities */}
        {neighborhood.amenities?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Top Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {neighborhood.amenities.map((a, i) => (
                <span key={i} className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 px-3 py-1 rounded-full text-sm">
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contact Agent */}
        <div className="mt-8">
          <button
            onClick={() => setShowContactForm(true)}
            className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            <PhoneCall className="mr-2" />
            Contact Local Agent
          </button>
        </div>

        {/* Modal */}
        {showContactForm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
              <h2 className="text-xl font-semibold mb-4">Contact Local Agent</h2>

              {submitSuccess ? (
                <div className="text-green-600">Message sent successfully!</div>
              ) : (
                <>
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full mb-3 px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
                    value={userEmail}
                    onChange={e => setUserEmail(e.target.value)}
                  />
                  <textarea
                    placeholder="Your message"
                    className="w-full mb-4 px-4 py-2 border rounded h-28 dark:bg-gray-700 dark:text-white"
                    value={userMessage}
                    onChange={e => setUserMessage(e.target.value)}
                  />
                  <button
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </>
              )}

              <button
                onClick={() => setShowContactForm(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NeighborhoodDetail;
