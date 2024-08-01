import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  currentUser: {
    id: string;
    username: string;
    isAdmin: boolean;
  } | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthContextType['currentUser']>(null);

  const login = (token: string) => {
    // Example: Decode the token to extract user info. This may vary depending on your token.
    const userData = JSON.parse(atob(token.split('.')[1])); // Assuming JWT token
    setCurrentUser({
      id: userData.id,
      username: userData.username,
      isAdmin: userData.isAdmin,
    });
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
