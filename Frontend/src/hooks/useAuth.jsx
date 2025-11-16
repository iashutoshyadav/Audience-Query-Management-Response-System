import { useEffect, useState, createContext, useContext } from 'react';
import api from '../utils/api';
import { TOKEN_KEY } from '../utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ------------------------------------
  // Initialize FROM TOKEN ONLY (no /me)
  // ------------------------------------
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Consider logged-in BUT no user data → just token
    setUser({ token });
    setLoading(false);
  }, []);

  // ------------------------------------
  // LOGIN
  // ------------------------------------
  const login = async (data) => {
    const res = await api.post('/api/auth/login', data);

    console.log("LOGIN RESPONSE:", res.data);

    const loginData = res?.data?.data;

    const token = loginData?.token;

    const userData = {
      id: loginData?.id,
      name: loginData?.name,
      email: loginData?.email,
      role: loginData?.role,
    };

    if (!token) throw new Error("No token returned from server");

    // Save token & user
    localStorage.setItem(TOKEN_KEY, token);
    setUser(userData);

    return res.data;
  };

  // ------------------------------------
  // REGISTER
  // ------------------------------------
  const register = async (data) => {
    const res = await api.post('/api/auth/register', data);
    return res.data;
  };

  // ------------------------------------
  // LOGOUT (redirect to HOME PAGE)
  // ------------------------------------
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    window.location.href = "/";  // 👈 FORCE redirect to HOME page
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: Boolean(user),
  };
}
