import React, { createContext, useContext, useReducer, useState } from "react";

// AuthContext: manage login state and user info
const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null or user object

  const login = (userInfo) => setUser(userInfo);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);

// NotificationContext: manage global notifications/toasts
const NotificationContext = createContext();
export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const addNotification = (msg) =>
    setNotifications((prev) => [...prev, { id: Date.now(), msg }]);
  const removeNotification = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
export const useNotification = () => useContext(NotificationContext);

// AppSettingsContext: Settings, preferences, etc
const AppSettingsContext = createContext();
export function AppSettingsProvider({ children }) {
  const [language, setLanguage] = useState("en");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <AppSettingsContext.Provider
      value={{ language, setLanguage, sidebarOpen, setSidebarOpen }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}
export const useAppSettings = () => useContext(AppSettingsContext);

// Combine all providers for convenience
export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppSettingsProvider>{children}</AppSettingsProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
