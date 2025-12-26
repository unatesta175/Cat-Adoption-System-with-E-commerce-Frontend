import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    const userData = response.data;
    const previousUser = localStorage.getItem('user');
    const previousUserId = previousUser ? JSON.parse(previousUser).id : null;
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Only clear cart if a different user logs in (to prevent cart sharing)
    if (previousUserId && previousUserId !== userData.id) {
      localStorage.removeItem('cart');
      window.dispatchEvent(new CustomEvent('userLogin', { detail: { ...userData, clearCart: true } }));
    } else {
      window.dispatchEvent(new CustomEvent('userLogin', { detail: { ...userData, clearCart: false } }));
    }
    return userData;
  };

  const register = async (name, email, password) => {
    const response = await authAPI.register({ name, email, password });
    const userData = response.data;
    const previousUser = localStorage.getItem('user');
    const previousUserId = previousUser ? JSON.parse(previousUser).id : null;
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Only clear cart if a different user registers (to prevent cart sharing)
    if (previousUserId && previousUserId !== userData.id) {
      localStorage.removeItem('cart');
      window.dispatchEvent(new CustomEvent('userLogin', { detail: { ...userData, clearCart: true } }));
    } else {
      window.dispatchEvent(new CustomEvent('userLogin', { detail: { ...userData, clearCart: false } }));
    }
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Clear cart on logout
    localStorage.removeItem('cart');
    // Dispatch custom event to notify CartContext
    window.dispatchEvent(new CustomEvent('userLogout'));
  };

  const updateUserPreferences = (preferences) => {
    const updatedUser = { ...user, preferences };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUserPreferences,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};




