import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);

  //  — user
  const [user, setUser] = useState(
    localStorage.getItem("userId")
      ? { id: localStorage.getItem("userId"), token: localStorage.getItem("token") }
      : null
  );

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUserId = localStorage.getItem("userId");

    if (savedToken && savedUserId) {
      setToken(savedToken);
      setUserId(savedUserId);

      // -user
      setUser({ id: savedUserId, token: savedToken });
    }
  }, []);

  const login = ({ token, userId }) => {
    setToken(token);
    setUserId(userId);

    setUser({ id: userId, token });

    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider value={{ token, userId, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
