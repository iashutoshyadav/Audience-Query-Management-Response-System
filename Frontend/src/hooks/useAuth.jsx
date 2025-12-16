import { useEffect, useState, createContext, useContext } from "react";
import api from "../utils/api";
import { TOKEN_KEY } from "../utils/constants";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ AUTO LOGOUT ON TAB CLOSE / REFRESH
  useEffect(() => {
    const handleUnload = () => {
      sessionStorage.removeItem(TOKEN_KEY);
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  // ✅ CHECK SESSION ON LOAD
  useEffect(() => {
    const token = sessionStorage.getItem(TOKEN_KEY);

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setUser({ token });
    setLoading(false);
  }, []);

  const login = async (data) => {
    const res = await api.post("/api/auth/login", data);

    const loginData = res?.data?.data;
    const token = loginData?.token;

    if (!token) throw new Error("No token returned from server");

    const userData = {
      id: loginData?.id,
      name: loginData?.name,
      email: loginData?.email,
      role: loginData?.role,
    };

    // ✅ STORE IN SESSION STORAGE
    sessionStorage.setItem(TOKEN_KEY, token);
    setUser(userData);

    return res.data;
  };

  const register = async (data) => {
    const res = await api.post("/api/auth/register", data);
    return res.data;
  };

  const logout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setUser(null);
    window.location.href = "/";
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
