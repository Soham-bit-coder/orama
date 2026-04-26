"use client";

import React, { createContext, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const value = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
    login: async () => false,
    register: async () => false,
    logout: async () => {},
    clearError: () => {},
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
