import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.ts';
import { api } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (loginId: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  hasRole: (roles: string[]) => boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('scsco_token') || sessionStorage.getItem('scsco_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session securely on page refresh
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('scsco_token') || sessionStorage.getItem('scsco_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await api.getCurrentUser();
        if (data.user) {
          setUser(data.user);
        } else {
          localStorage.removeItem('scsco_token');
          sessionStorage.removeItem('scsco_token');
          setToken(null);
        }
      } catch (err) {
        console.warn('Session restoration failed:', err);
        localStorage.removeItem('scsco_token');
        sessionStorage.removeItem('scsco_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (loginId: string, password: string): Promise<User> => {
    const data = await api.login({ loginId, password });
    if (data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('scsco_token', data.token);
      return data.user;
    }
    throw new Error('Invalid login response from server');
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // Ignore logout api errors
    } finally {
      localStorage.removeItem('scsco_token');
      sessionStorage.removeItem('scsco_token');
      setToken(null);
      setUser(null);
    }
  };

  const refreshProfile = async () => {
    try {
      const data = await api.getCurrentUser();
      if (data.user) {
        setUser(data.user);
      }
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  };

  const hasRole = (roles: string[]) => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    return roles.includes(user.role);
  };

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        refreshProfile,
        hasRole,
        isSuperAdmin,
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
