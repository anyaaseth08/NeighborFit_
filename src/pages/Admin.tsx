import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useEnhancedNeighborhoods } from '../contexts/EnhancedNeighborhoodContext';
import { 
  Users, 
  MapPin, 
  Star, 
  Plus, 
  Edit, 
  Trash2, 
  Settings,
  BarChart3,
  MessageSquare,
  Shield
} from 'lucide-react';

const Admin: React.FC = () => {
  const { user } = useAuth();
  const { neighborhoods } = useEnhancedNeighborhoods();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
          <p className="mt-1 text-sm text-gray-500">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'neighborhoods', name: 'Neighborhoods', icon: MapPin },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'reviews', name: 'Reviews', icon: MessageSquare },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const stats = [
    { name: 'Total Neighborhoods', value: neighborhoods.length, icon: MapPin, color: 'green' },
    { name: 'Total Users', value: '2,500', icon: Users, color: 'green' },
    { name: 'Total Reviews', value: '8,900', icon: MessageSquare, color: 'green' },
    { name: 'Avg Rating', value: '4.3', icon: Star, color: 'yellow' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage neighborhoods, users, and platform content across India</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="mr-2 h-5 w-5" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                        <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                        <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">New neighborhood "Hitech City" added to Hyderabad</span>
                    <span className="text-xs text-gray-400">2 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">User review approved for Koramangala, Bangalore</span>
                    <span className="text-xs text-gray-400">4 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">New user registration: priya@example.com</span>
                    <span className="text-xs text-gray-400">6 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Neighborhoods Tab */}
        {activeTab === 'neighborhoods' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Manage Neighborhoods</h2>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Add Neighborhood
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Neighborhood
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reviews
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {neighborhoods.map((neighborhood) => (
                    <tr key={neighborhood.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={neighborhood.image}
                            alt={neighborhood.name}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{neighborhood.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {neighborhood.city}, {neighborhood.state}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm text-gray-600">{neighborhood.ratings.overall}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {neighborhood.reviews.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Manage Users</h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600">User management functionality would be implemented here.</p>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Manage Reviews</h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600">Review moderation functionality would be implemented here.</p>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Platform Settings</h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600">Platform configuration settings would be implemented here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;