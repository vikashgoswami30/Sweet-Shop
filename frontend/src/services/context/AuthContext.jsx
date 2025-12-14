import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log('Loaded user from storage:', parsedUser); 
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    console.log('Login response:', response); 
    
    const userData = response.data.user;
    const token = response.data.accessToken;
    
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    console.log('User logged in:', userData); 
    return response;
  };

  const register = async (userData) => {
    const response = await authAPI.register(userData);
    console.log('Register response:', response); 
    return response;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const isAdmin = () => {
    console.log('Checking admin - user:', user); 
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};