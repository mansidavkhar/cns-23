import React from 'react';
import ReactDOM from 'react-dom/client';
// Import App and all providers from the single App.jsx file

import App, {
  AuthProvider,
  CartProvider,
  NotificationProvider,
} from './App';
// Import the CSS file
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap the entire App in the providers.
      This makes the context available to all components.
    */}
    <NotificationProvider>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </NotificationProvider>
  </React.StrictMode>
);

