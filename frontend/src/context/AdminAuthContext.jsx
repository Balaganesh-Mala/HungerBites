import React, { createContext, useState, useEffect } from "react";
import { saveAdminToken, getAdminToken, clearAdminToken } from "../utils/token";
import axios from "../api/adminAxios";

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null); // { name, email, role }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAdminToken();
    if (token) {
      // optionally fetch profile
      axios.get("/auth/profile").then((res) => {
        setAdmin(res.data.user);
        setLoading(false);
      }).catch(() => {
        clearAdminToken();
        setAdmin(null);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await axios.post("/auth/login", { email, password });
    const token = res.data.token;
    saveAdminToken(token);
    // fetch profile now
    const profile = await axios.get("/auth/profile");
    setAdmin(profile.data.user);
    return res.data;
  };

  const logout = () => {
    clearAdminToken();
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
