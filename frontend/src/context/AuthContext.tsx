import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUserAPI, registerUserAPI, fetchUserProfileAPI } from '../services/api';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, password: string, email?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('canteen_auth_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('canteen_auth_token');
      if (storedToken) {
        const profile = await fetchUserProfileAPI(storedToken);
        if (profile) {
          setUser(profile);
          setToken(storedToken);
        } else {
          // Invalid or expired token
          localStorage.removeItem('canteen_auth_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    const res = await loginUserAPI(username, password);
    setIsLoading(false);

    if (res.success && res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('canteen_auth_token', res.token);
      return { success: true };
    }

    return { success: false, error: res.error || 'Invalid credentials' };
  };

  const register = async (username: string, password: string, email?: string) => {
    setIsLoading(true);
    const res = await registerUserAPI(username, password, email);
    setIsLoading(false);

    if (res.success && res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('canteen_auth_token', res.token);
      return { success: true };
    }

    return { success: false, error: res.error || 'Registration failed' };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('canteen_auth_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
