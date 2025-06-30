import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'isActive'>) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@hopital-dakar.sn',
    nom: 'Diallo',
    prenom: 'Amadou',
    role: 'admin_hopital',
    telephone: '+221771234567',
    hopitalId: 'hopital-1',
    isActive: true,
  },
  {
    id: '2',
    email: 'fatou.sarr@gmail.com',
    nom: 'Sarr',
    prenom: 'Fatou',
    role: 'donneur',
    telephone: '+221776543210',
    groupeSanguin: 'O+',
    dateNaissance: '1990-05-15',
    dateDerniereDonation: '2024-01-10',
    sexe: 'F',
    adresse: 'Plateau, Dakar, Sénégal',
    position: { latitude: 14.6928, longitude: -17.4467 },
    isActive: true,
  },
  {
    id: '3',
    email: 'superadmin@sendon.sn',
    nom: 'Ndiaye',
    prenom: 'Moussa',
    role: 'super_admin',
    telephone: '+221778888888',
    isActive: true,
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('sendon_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock authentication
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('sendon_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (userData: Omit<User, 'id' | 'isActive'>): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock registration
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
      isActive: true,
    };
    
    mockUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem('sendon_user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sendon_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}