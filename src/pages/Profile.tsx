import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, MapPin, DollarSign, Heart, Settings, Save } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updatePreferences } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [preferences, setPreferences] = useState(user?.preferences || {
    budget: 30000,
    commute: '',
    lifestyle: [],
    priorities: []
  });

  const lifestyleOptions = [
    'modern', 'traditional', 'family-friendly', 'nightlife', 'affordable', 
    'upscale', 'tech-hub', 'cultural', 'walkable', 'peaceful'
  ];

  const priorityOptions = [
    'safety', 'schools', 'transit', 'nightlife', 'cost', 'shopping',
    'restaurants', 'commute', 'community', 'infrastructure'
  ];

  const commuteOptions = [
    'tech-hub', 'it-sector', 'financial-district', 'commercial',
    'educational', 'government', 'work-from-home'
  ];

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleArrayToggle = (array: string[], item: string, key: string) => {
    const newArray = array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
    handlePreferenceChange(key, newArray);
  };

  const handleSave = () => {
    updatePreferences(preferences);
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <div className="flex items-center text-gray-600 mt-1">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center text-gray-600 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role === 'admin' ? 'Administrator' : 'Member'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Settings className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit Preferences'}
            </button>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Housing Preferences</h2>
            {isEditing && (
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            )}
          </div>

          <div className="space-y-8">
            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <DollarSign className="inline h-4 w-4 mr-2" />
                Monthly Budget (₹)
              </label>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="range"
                    min="15000"
                    max="150000"
                    step="5000"
                    value={preferences.budget}
                    onChange={(e) => handlePreferenceChange('budget', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹15,000</span>
                    <span className="font-medium">₹{preferences.budget.toLocaleString()}</span>
                    <span>₹1,50,000+</span>
                  </div>
                </div>
              ) : (
                <div className="text-lg font-semibold text-green-600">
                  ₹{preferences.budget.toLocaleString()} / month
                </div>
              )}
            </div>

            {/* Commute Preference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <MapPin className="inline h-4 w-4 mr-2" />
                Primary Commute Destination
              </label>
              {isEditing ? (
                <select
                  value={preferences.commute}
                  onChange={(e) => handlePreferenceChange('commute', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select commute destination</option>
                  {commuteOptions.map(option => (
                    <option key={option} value={option}>
                      {option.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-gray-900">
                  {preferences.commute 
                    ? preferences.commute.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                    : 'Not specified'
                  }
                </div>
              )}
            </div>

            {/* Lifestyle Preferences */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Heart className="inline h-4 w-4 mr-2" />
                Lifestyle Preferences
              </label>
              <div className="flex flex-wrap gap-2">
                {lifestyleOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => isEditing && handleArrayToggle(preferences.lifestyle || [], option, 'lifestyle')}
                    disabled={!isEditing}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      (preferences.lifestyle || []).includes(option)
                        ? 'bg-green-600 text-white'
                        : isEditing
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-gray-100 text-gray-700'
                    } ${!isEditing ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Priorities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Top Priorities
              </label>
              <div className="flex flex-wrap gap-2">
                {priorityOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => isEditing && handleArrayToggle(preferences.priorities || [], option, 'priorities')}
                    disabled={!isEditing}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      (preferences.priorities || []).includes(option)
                        ? 'bg-green-600 text-white'
                        : isEditing
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-gray-100 text-gray-700'
                    } ${!isEditing ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {!isEditing && (!preferences.budget && !preferences.commute && (!preferences.lifestyle || preferences.lifestyle.length === 0)) && (
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                Complete your preferences to get personalized neighborhood recommendations!
              </p>
            </div>
          )}
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-500">Receive updates about new neighborhoods and reviews</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Marketing Communications</h3>
                <p className="text-sm text-gray-500">Receive tips and insights about neighborhood living</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
            <div className="pt-3">
              <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;