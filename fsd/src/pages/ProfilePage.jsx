import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

function ProfilePage() {
  const { user, login, logout } = useAuth();
  const { showNotification } = useNotification();
  const [username, setUsername] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      login({ name: username });
      showNotification(`Welcome, ${username}!`, 'success');
      setUsername('');
    } else {
      showNotification('Please enter a username', 'error');
    }
  };

  const handleLogout = () => {
    showNotification('You have been logged out.', 'info');
    logout();
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Profile
      </h1>
      {user ? (
        <div className="text-center">
          <img
            src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.name}`}
            alt="avatar"
            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-500"
          />
          <h2 className="text-2xl font-semibold text-gray-700">
            Welcome, {user.name}!
          </h2>
          <p className="text-gray-500 mt-2">{user.email}</p>
          <button
            onClick={handleLogout}
            className="mt-6 w-full bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            Log Out
          </button>
        </div>
      ) : (
        <form onSubmit={handleLogin}>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Please Log In
          </h2>
          <p className="text-gray-500 mb-4">
            (This is a simulation, just enter any name)
          </p>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., ExamStudent"
            />
          </div>
          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Log In
          </button>
        </form>
      )}
    </div>
  );
}

export default ProfilePage;
