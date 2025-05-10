import { createContext, useContext, useState, useEffect } from 'react';
import { getData } from '../utils/localStorageUtils';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
      setCurrentUser(JSON.parse(loggedInUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = getData('users');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const userInfo = { ...user };
      delete userInfo.password; // Don't store password in session
      localStorage.setItem('currentUser', JSON.stringify(userInfo));
      setCurrentUser(userInfo);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout,
    isAdmin: currentUser?.role === 'Admin',
    isInspector: currentUser?.role === 'Inspector',
    isEngineer: currentUser?.role === 'Engineer',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
