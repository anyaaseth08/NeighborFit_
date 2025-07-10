import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEnhancedNeighborhoods } from '../contexts/EnhancedNeighborhoodContext';
import { useTheme } from '../contexts/ThemeContext';
import { Home, Search, BarChart3, User, Settings, LogOut, Menu, X, Moon, Sun } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { compareList } = useEnhancedNeighborhoods();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">NeighborFit</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/browse"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/browse')
                  ? 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300'
                  : 'text-gray-700 dark:text-gray-300 hover:text-green-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Browse</span>
            </Link>

            {user && (
              <Link
                to="/compare"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  isActive('/compare')
                    ? 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300'
                    : 'text-gray-700 dark:text-gray-300 hover:text-green-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Compare</span>
                {compareList.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {compareList.length}
                  </span>
                )}
              </Link>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-green-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/profile"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/profile')
                      ? 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : 'text-gray-700 dark:text-gray-300 hover:text-green-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </Link>

                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/admin')
                        ? 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300'
                        : 'text-gray-700 dark:text-gray-300 hover:text-green-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-green-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-2">
              <Link
                to="/browse"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Search className="h-4 w-4" />
                <span>Browse</span>
              </Link>

              {user && (
                <>
                  <Link
                    to="/compare"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Compare</span>
                    {compareList.length > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                        {compareList.length}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>

                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900 transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              )}

              {!user && (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;