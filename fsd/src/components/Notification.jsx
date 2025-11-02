import React, { useEffect, useState } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

const icons = {
  success: <CheckCircle className="w-6 h-6" />,
  error: <XCircle className="w-6 h-6" />,
  warning: <AlertTriangle className="w-6 h-6" />,
  info: <Info className="w-6 h-6" />,
};

const bgColors = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
};

function Notification() {
  const { notification, hideNotification } = useNotification();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification.message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Give time for fade-out animation before hiding
        setTimeout(hideNotification, 300);
      }, notification.duration || 3000); // Default 3s duration

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [notification, hideNotification]);

  if (!notification.message) return null;

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-4 p-4 rounded-lg shadow-lg text-white transition-all duration-300
        ${bgColors[notification.type] || 'bg-gray-800'}
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}
      `}
    >
      {icons[notification.type] || icons.info}
      <span className="font-medium">{notification.message}</span>
      <button
        onClick={() => setIsVisible(false)}
        className="ml-auto opacity-70 hover:opacity-100"
      >
        &times;
      </button>
    </div>
  );
}

export default Notification;
