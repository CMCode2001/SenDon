import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: any) => Promise<boolean>;
  isLoading: boolean;
  setUserFromOutside: (user: User) => void; // ✅ AJOUTÉ
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const setUserFromOutside = (userData: User) => {
  setUser(userData);
};


  useEffect(() => {
    const storedToken = localStorage.getItem('sendon_token');
    const storedUser = localStorage.getItem('sendon_user');

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        email,
        password
      });

      const { token, user: userData } = response.data;

      localStorage.setItem('sendon_token', token);
      localStorage.setItem('sendon_user', JSON.stringify(userData));

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, userData);
      const { token, user: createdUser } = response.data;

      localStorage.setItem('sendon_token', token);
      localStorage.setItem('sendon_user', JSON.stringify(createdUser));

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(createdUser);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sendon_token');
    localStorage.removeItem('sendon_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading , setUserFromOutside }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
