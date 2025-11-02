import React from 'react';
import { useToggle } from '../hooks/useToggle';
import { useWindowSize } from '../hooks/useWindowSize';
import { useLocalStorage } from '../hooks/useLocalStorage';

function HooksDemoPage() {
  // 1. useToggle example
  const [isModalOpen, toggleModal] = useToggle(false);

  // 2. useWindowSize example
  const { width, height } = useWindowSize();

  // 3. useLocalStorage example
  const [name, setName] = useLocalStorage('demoName', 'Guest');

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Custom Hooks Demonstration
      </h1>

      {/* useToggle Demo */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          1. `useToggle`
        </h2>
        <button
          onClick={toggleModal}
          className="bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          {isModalOpen ? 'Hide' : 'Show'} Message
        </button>
        {isModalOpen && (
          <div className="mt-4 p-4 bg-purple-100 text-purple-800 rounded-lg">
            Hello! You toggled me!
          </div>
        )}
      </div>

      {/* useWindowSize Demo */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          2. `useWindowSize`
        </h2>
        <p className="text-lg text-gray-600">
          Try resizing your browser window.
        </p>
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg font-mono text-lg">
          <p>Width: <span className="font-bold">{width}px</span></p>
          <p>Height: <span className="font-bold">{height}px</span></p>
        </div>
      </div>

      {/* useLocalStorage Demo */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          3. `useLocalStorage`
        </h2>
        <p className="text-lg text-gray-600 mb-4">
          Your name is <span className="font-bold text-blue-600">{name}</span>.
        </p>
        <p className="text-gray-500 mb-2">
          Type in the box below. The value will persist even if you refresh the page.
        </p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your name"
        />
      </div>
    </div>
  );
}

export default HooksDemoPage;
