import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react';
import bcrypt from 'bcryptjs';

// Define the User structure
export interface User {
  id: string;
  email: string;
  name: string;
  password: string; // hashed
  role: 'user' | 'admin';
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
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load users from JSON file
  const loadUsers = async () => {
  try {
    const db = await import('../data/user_db.json');
    const parsed: User[] = (db.default || db).map((u: any) => ({
      ...u,
      role: u.role === 'admin' ? 'admin' : 'user' // ensure type safety
    })) as User[];

    setUsers(parsed);
  } catch (err) {
    console.error('Failed to load user DB:', err);
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
    loadUsers();

    const storedUser = localStorage.getItem('neighborfit_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch {
        localStorage.removeItem('neighborfit_user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const existingUser = users.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );
    if (!existingUser) {
      return { success: false, message: 'User not found' };
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return { success: false, message: 'Invalid password' };
    }

    setUser(existingUser);
    localStorage.setItem('neighborfit_user', JSON.stringify(existingUser));
    return { success: true };
  };

  const register = async (email: string, password: string, name: string) => {
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'User already exists' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      name: name.trim(),
      password: hashedPassword,
      role: 'user',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      preferences: {
        budget: 30000,
        lifestyle: [],
        priorities: [],
        ageGroup: 'young-professional'
      },
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Store in-memory only (simulate persistent DB)
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setUser(newUser);
    localStorage.setItem('neighborfit_user', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('neighborfit_user');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return false;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('neighborfit_user', JSON.stringify(updatedUser));
    return true;
  };

  const updatePreferences = (preferences: User['preferences']) => {
    if (!user) return;
    const updatedUser = { ...user, preferences };
    setUser(updatedUser);
    localStorage.setItem('neighborfit_user', JSON.stringify(updatedUser));
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
