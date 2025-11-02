import React, { createContext, useContext, useState } from 'react';

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider Component
export function AuthProvider({ children }) {
  // This state holds the current user object or null
  const [user, setUser] = useState(null);

  // Login function: in a real app, this would be async and call an API
  const login = (userData) => {
    // For the exam, we just simulate a login
    const fakeUser = {
      id: 1,
      name: userData.name || 'Test User',
      email: userData.email || 'test@example.com',
    };
    setUser(fakeUser);
    // In a real app, you'd save a token to localStorage here
  };

  // Logout function
  const logout = () => {
    setUser(null);
    // In a real app, you'd remove the token from localStorage
  };

  // The value object to be passed to consumers
  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Create a custom hook for easy consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
