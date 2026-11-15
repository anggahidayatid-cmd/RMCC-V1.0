import React, { createContext, useContext, useState } from 'react';
import { UserRole } from './RbacContext';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  avatar: string;
}

export const DEMO_ACCOUNTS: AuthUser[] = [
  { id: '1', name: 'Victoria Sterling', email: 'owner@rmcc.com', role: 'owner', title: 'Restaurant Owner & Founder', avatar: 'VS' },
  { id: '2', name: 'Marcus Vance', email: 'gm@rmcc.com', role: 'gm', title: 'General Manager', avatar: 'MV' },
  { id: '3', name: 'Chloe Dupont', email: 'asst@rmcc.com', role: 'asst_mgr', title: 'Assistant Manager', avatar: 'CD' },
  { id: '4', name: 'Alex Morgan', email: 'marketing@rmcc.com', role: 'marketing', title: 'Marketing Director', avatar: 'AM' },
  { id: '5', name: 'David Sterling', email: 'finance@rmcc.com', role: 'finance', title: 'Chief Financial Officer', avatar: 'DS' },
];

interface AuthContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
}

const AUTH_STORAGE_KEY = 'rmcc_auth_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return null;
  });

  const login = (email: string, _pass: string): boolean => {
    const found = DEMO_ACCOUNTS.find((acc) => acc.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(found));
      localStorage.setItem('rmcc_user_role', found.role);
      window.dispatchEvent(new Event('rmcc_rbac_changed'));
      return true;
    }
    return false;
  };

  const loginAsRole = (role: UserRole) => {
    const found = DEMO_ACCOUNTS.find((acc) => acc.role === role);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(found));
      localStorage.setItem('rmcc_user_role', found.role);
      window.dispatchEvent(new Event('rmcc_rbac_changed'));
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        loginAsRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
