import React, { createContext, useContext, useState } from 'react';

// 1. Create the Context
const NotificationContext = createContext();

// 2. Create the Provider Component
export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState({
    message: '',
    type: 'info', // 'success', 'error', 'warning', 'info'
    duration: 3000,
  });

  // Function to show a notification
  const showNotification = (message, type = 'info', duration = 3000) => {
    setNotification({ message, type, duration });
  };

  // Function to hide the notification
  const hideNotification = () => {
    setNotification({ message: '', type: 'info', duration: 3000 });
  };

  const value = {
    notification,
    showNotification,
    hideNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// 3. Create a custom hook for easy consumption
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
};
