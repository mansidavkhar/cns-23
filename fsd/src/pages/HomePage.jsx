import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function HomePage() {
  const { user } = useAuth();

  return (
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Welcome to the React Practical Exam Boilerplate!
      </h1>
      {user ? (
        <p className="text-xl text-gray-600">
          Hello, <span className="font-semibold text-blue-600">{user.name}</span>!
        </p>
      ) : (
        <p className="text-xl text-gray-600">
          You are not logged in.
        </p>
      )}
      <p className="mt-6 text-gray-500 max-w-2xl mx-auto">
        This project is a template to help you start your exam quickly. It includes examples of Context API for state management (Auth, Cart, Notifications) and several useful custom hooks (useFetch, useLocalStorage, etc.).
      </p>
      <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
        Check out the different pages to see them in action!
      </p>
    </div>
  );
}

export default HomePage;
