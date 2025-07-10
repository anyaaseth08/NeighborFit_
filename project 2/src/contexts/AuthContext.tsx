import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  preferences?: {
    budget: number;
    commute?: string;
    lifestyle: string[];
    priorities: string[];
    familySize?: number;
    ageGroup?: 'young-professional' | 'family' | 'senior';
    workLocation?: { lat: number; lng: number };
  };
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  updatePreferences: (preferences: User['preferences']) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('neighborfit_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch (e) {
        console.error('Error loading user from localStorage:', e);
        localStorage.removeItem('neighborfit_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await authService.login(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        localStorage.setItem('neighborfit_user', JSON.stringify(result.user));
      }
      return result;
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, message: 'Login failed. Try again.' };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const result = await authService.register(email, password, name);
      if (result.success && result.user) {
        setUser(result.user);
        localStorage.setItem('neighborfit_user', JSON.stringify(result.user));
      }
      return result;
    } catch (err) {
      console.error('Registration error:', err);
      return { success: false, message: 'Registration failed. Try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('neighborfit_user');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return false;

    try {
      const success = await authService.updateUser(user.id, data);
      if (success) {
        const updated = { ...user, ...data };
        setUser(updated);
        localStorage.setItem('neighborfit_user', JSON.stringify(updated));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Profile update error:', err);
      return false;
    }
  };

  const updatePreferences = (preferences: User['preferences']) => {
    if (!user) return;
    const updated = { ...user, preferences };
    setUser(updated);
    localStorage.setItem('neighborfit_user', JSON.stringify(updated));
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateProfile,
    updatePreferences,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
