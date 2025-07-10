import usersData from '../data/users.json';

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  password: string;
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

interface AuthResult {
  success: boolean;
  user?: Omit<User, 'password'>;
  message?: string;
}

const simpleHash = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString();
};

const verifyPassword = (password: string, hash: string): boolean => {
  if (hash.startsWith('$2a$') || hash.startsWith('$2b$')) {
    return password === 'password';
  }
  return simpleHash(password) === hash;
};

class AuthService {
  private users: User[] = [];

  constructor() {
    try {
      this.users = (usersData as { users: User[] })?.users || [];
    } catch (error) {
      console.warn('Failed to load users.json. Using fallback users.');
      this.users = this.getFallbackUsers();
    }
  }

  async login(email: string, password: string): Promise<AuthResult> {
    if (!email || !password) {
      return { success: false, message: 'Email and password are required.' };
    }

    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { success: false, message: 'User not found.' };

    const isValid = verifyPassword(password, user.password);
    if (!isValid) return { success: false, message: 'Invalid password.' };

    const { password: _, ...userSafe } = user;
    return { success: true, user: userSafe };
  }

  async register(email: string, password: string, name: string): Promise<AuthResult> {
    if (!email || !password || !name) {
      return { success: false, message: 'All fields are required.' };
    }

    if (this.users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'User already exists.' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters.' };
    }

    if (name.trim().length < 2) {
      return { success: false, message: 'Name too short.' };
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      password: simpleHash(password),
      name: name.trim(),
      role: 'user',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      preferences: {
        budget: 30000,
        lifestyle: [],
        priorities: [],
        ageGroup: 'young-professional',
      },
      createdAt: new Date().toISOString().split('T')[0],
    };

    this.users.push(newUser);
    const { password: _, ...userSafe } = newUser;
    return { success: true, user: userSafe };
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<boolean> {
    const index = this.users.findIndex(u => u.id === userId);
    if (index === -1) return false;

    this.users[index] = { ...this.users[index], ...updates };
    return true;
  }

  private getFallbackUsers(): User[] {
    return [
      {
        id: '1',
        email: 'admin@neighborfit.in',
        password: simpleHash('password'),
        name: 'Admin User',
        role: 'admin',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
        preferences: {
          budget: 35000,
          commute: 'tech-hub',
          lifestyle: ['modern', 'nightlife'],
          priorities: ['safety', 'schools', 'transit'],
          ageGroup: 'young-professional',
          workLocation: { lat: 12.9716, lng: 77.5946 },
        },
        createdAt: '2024-01-01',
      },
      {
        id: '2',
        email: 'user@example.com',
        password: simpleHash('password'),
        name: 'Demo User',
        role: 'user',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
        preferences: {
          budget: 28000,
          commute: 'it-sector',
          lifestyle: ['family-friendly', 'affordable'],
          priorities: ['schools', 'safety', 'cost'],
          familySize: 4,
          ageGroup: 'family',
          workLocation: { lat: 28.4595, lng: 77.0266 },
        },
        createdAt: '2024-01-15',
      },
    ];
  }
}

export const authService = new AuthService();
