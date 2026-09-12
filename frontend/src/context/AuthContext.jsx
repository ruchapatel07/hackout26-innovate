import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const ADMIN_SECURITY_KEY = "CC-ADMIN-2026";

export const roleNames = {
  buyer: "Buyer",
  seller: "Seller",
  transporter: "Transporter",
  admin: "Admin",
  consumer: "Buyer",
  producer: "Seller"
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { showToast } = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [activePage, setActivePage] = useState("home");
  const [loginRole, setLoginRole] = useState("buyer");
  const [signupRole, setSignupRole] = useState("buyer");
  const [dashboardSection, setDashboardSection] = useState("overview");

  const saveSession = (email, role) => {
    localStorage.setItem(
      "carbonConnectSession",
      JSON.stringify({ email, role })
    );
  };

  const clearSession = () => {
    localStorage.removeItem("carbonConnectSession");
    localStorage.removeItem("carbonToken");
  };

  // Restore authenticated session from backend on page refresh
  useEffect(() => {
    const token = localStorage.getItem("carbonToken");
    if (token) {
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            setCurrentUser(data.user);
            setActivePage("dashboard");
            setDashboardSection("overview");
          } else {
            clearSession();
          }
        })
        .catch(() => clearSession());
    }
  }, []);

  const navigatePage = (page, options = {}) => {
    setActivePage(page);
    if (options.role) {
      setLoginRole(options.role);
    }
    if (options.section) {
      setDashboardSection(options.section);
    }
    window.scrollTo(0, 0);
  };

  const login = async (email, password, role, adminKey, rememberMe) => {
    const cleanEmail = email.trim().toLowerCase();

    if (role === "admin") {
      if (!adminKey || adminKey.trim() !== ADMIN_SECURITY_KEY) {
        showToast("Invalid Admin Security Key.", "error");
        return false;
      }
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password })
      });
      const data = await res.json();

      if (!data.success) {
        showToast(data.error || "Login failed. Please check your credentials.", "error");
        return false;
      }

      const user = data.user;
      localStorage.setItem("carbonToken", data.token);
      setCurrentUser(user);

      if (rememberMe) {
        saveSession(user.email, user.role);
      }

      showToast(`Login successful. Welcome back, ${user.name}!`);
      setActivePage("dashboard");
      setDashboardSection("overview");
      return true;
    } catch (err) {
      console.error("[Login API Error]", err);
      showToast("Backend server error. Ensure server is running on port 5005.", "error");
      return false;
    }
  };

  const signup = async (name, phone, email, password, confirmPassword, role) => {
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (cleanName.length < 2) {
      showToast("Please enter your full name.", "error");
      return false;
    }

    if (!emailPattern.test(cleanEmail)) {
      showToast("Please enter a valid email address.", "error");
      return false;
    }

    if (password.length < 6) {
      showToast("Password must contain at least 6 characters.", "error");
      return false;
    }

    if (password !== confirmPassword) {
      showToast("Password and confirm password do not match.", "error");
      return false;
    }

    // Role mapping: buyer -> consumer, seller -> producer
    const backendRole = role === "buyer" ? "consumer" : role === "seller" ? "producer" : role;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          phone: cleanPhone,
          email: cleanEmail,
          password,
          role: backendRole
        })
      });
      const data = await res.json();

      if (!data.success) {
        showToast(data.error || "Account creation failed.", "error");
        return false;
      }

      localStorage.setItem("carbonToken", data.token);
      setCurrentUser(data.user);
      showToast(`Account successfully created!`);
      setActivePage("dashboard");
      setDashboardSection("overview");
      return { email: cleanEmail, role };
    } catch (err) {
      console.error("[Signup API Error]", err);
      showToast("Backend connection error. Please ensure backend is running.", "error");
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    clearSession();
    setActivePage("home");
    showToast("Logged out successfully.");
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activePage,
        loginRole,
        signupRole,
        dashboardSection,
        setLoginRole,
        setSignupRole,
        setDashboardSection,
        navigatePage,
        login,
        signup,
        logout,
        ADMIN_SECURITY_KEY
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
