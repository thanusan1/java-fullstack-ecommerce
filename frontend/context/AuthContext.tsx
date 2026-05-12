'use client';

import React, {
  createContext, useContext, useState, useEffect, useCallback,
} from 'react';
import { useRouter } from 'next/router';
import { authApi } from '@/lib/api';
import { User, LoginRequest, RegisterRequest } from '@/types';
import toast from 'react-hot-toast';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser]         = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate user from localStorage on mount
  useEffect(() => {
    const storedUser  = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const res = await authApi.login(data);
    const { accessToken, user: userData } = res.data.data;

    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    toast.success(`Welcome back, ${userData.firstName}!`);
    router.push(userData.role === 'ADMIN' ? '/admin' : '/');
  }, [router]);

  const register = useCallback(async (data: RegisterRequest) => {
    const res = await authApi.register(data);
    const { accessToken, user: userData } = res.data.data;

    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    toast.success(`Welcome to ShopSphere, ${userData.firstName}!`);
    router.push('/');
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/');
  }, [router]);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'ADMIN',
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
