import {
  useState,
  useEffect,
  createContext,
  useContext,
  useReducer,
  useCallback,
} from 'react';


// Icons will be imported from lucide-react
// Make sure to install it: npm install lucide-react
import {
  ShoppingBag,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
} from 'lucide-react';

//==============================================================================
// HOOK: useFetch
//==============================================================================
/**
 * A custom hook to fetch data from a URL.
 * Handles loading, error, and data states.
 * @param {string} url - The URL to fetch data from.
 * @returns {object} { data, loading, error }
 */
export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const response = await fetch(url, { signal });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (url) {
      fetchData();
    } else {
      setLoading(false);
    }

    return () => {
      controller.abort();
    };
  }, [url]);

  return { data, loading, error };
};

//==============================================================================
// HOOK: useLocalStorage
//==============================================================================
function getStorageValue(key, initialValue) {
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return saved;
    }
  }
  return initialValue instanceof Function ? initialValue() : initialValue;
}

/**
 * A custom hook to sync state with localStorage.
 * @param {string} key - The key for localStorage.
 */
export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, initialValue);
  });

  useEffect(() => {
    if (value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
};

//==============================================================================
// HOOK: useWindowSize
//==============================================================================
/**
 * A custom hook to track the browser window's dimensions.
 * @returns {object} { width, height }
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

//==============================================================================
// HOOK: useToggle
//==============================================================================
/**
 * A simple custom hook for toggling a boolean value.
 * @param {boolean} initialValue - The initial boolean state.
 */
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);
  return [value, toggle];
};

//==============================================================================
// CONTEXT: AuthContext
//==============================================================================
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    const fakeUser = {
      id: 1,
      name: userData.name || 'Test User',
      email: userData.email || 'test@example.com',
    };
    setUser(fakeUser);
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

//==============================================================================
// CONTEXT: CartContext
//==============================================================================
const CartContext = createContext();

const ACTIONS = {
  ADD_ITEM: 'add-item',
  REMOVE_ITEM: 'remove-item',
  UPDATE_QUANTITY: 'update-quantity',
  CLEAR_CART: 'clear-cart',
};

function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_ITEM: {
      const { product } = action.payload;
      const existingItem = state.find((item) => item.id === product.id);
      if (existingItem) {
        return state.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...product, quantity: 1 }];
    }
    case ACTIONS.REMOVE_ITEM: {
      const { productId } = action.payload;
      return state.filter((item) => item.id !== productId);
    }
    case ACTIONS.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;
      const newQuantity = Math.max(1, quantity);
      return state.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    }
    case ACTIONS.CLEAR_CART:
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const addItem = (product) => {
    dispatch({ type: ACTIONS.ADD_ITEM, payload: { product } });
  };
  const removeItem = (productId) => {
    dispatch({ type: ACTIONS.REMOVE_ITEM, payload: { productId } });
  };
  const updateQuantity = (productId, quantity) => {
    dispatch({
      type: ACTIONS.UPDATE_QUANTITY,
      payload: { productId, quantity },
    });
  };
  const clearCart = () => {
    dispatch({ type: ACTIONS.CLEAR_CART });
  };

  const value = { cart, addItem, removeItem, updateQuantity, clearCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

//==============================================================================
// CONTEXT: NotificationContext
//==============================================================================
const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState({
    message: '',
    type: 'info',
    duration: 3000,
  });

  const showNotification = (message, type = 'info', duration = 3000) => {
    setNotification({ message, type, duration });
  };

  const hideNotification = () => {
    setNotification({ message: '', type: 'info', duration: 3000 });
  };

  const value = { notification, showNotification, hideNotification };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
};

//==============================================================================
// COMPONENT: Header
//==============================================================================
const NavLink = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="text-gray-600 hover:text-blue-600 transition-colors"
  >
    {children}
  </button>
);

function Header({ setPage }) {
  const { user } = useAuth();
  const { cart } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-md w-full">
      <nav className="container mx-auto p-4 flex justify-between items-center">
        <button
          onClick={() => setPage('home')}
          className="text-2xl font-bold text-blue-600"
        >
          ExamSite
        </button>
        <div className="hidden md:flex gap-6 items-center">
          <NavLink onClick={() => setPage('home')}>Home</NavLink>
          <NavLink onClick={() => setPage('products')}>Products</NavLink>
          <NavLink onClick={() => setPage('hooks')}>Hooks Demo</NavLink>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPage('cart')}
            className="relative p-2 rounded-full hover:bg-gray-100"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-6 h-6 text-gray-700" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                {totalItems}
              </span>
            )}
          </button>
          <button
            onClick={() => setPage('profile')}
            className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100"
            aria-label="Open profile"
          >
            <User className="w-6 h-6 text-gray-700" />
            <span className="hidden md:block text-sm font-medium text-gray-700">
              {user ? user.name : 'Login'}
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
}

//==============================================================================
// COMPONENT: Notification
//==============================================================================
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
        setTimeout(hideNotification, 300);
      }, notification.duration || 3000);

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

//==============================================================================
// PAGE: HomePage
//==============================================================================
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

//==============================================================================
// PAGE: ProductsPage
//==============================================================================
const API_URL = 'https://dummyjson.com/recipes?limit=20';

function ProductCard({ product }) {
  const { addItem } = useCart();
  const { showNotification } = useNotification();
  
  const handleAddToCart = () => {
    addItem(product);
    showNotification(`${product.title} added to cart!`, 'success');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-48 object-contain p-4 border-b"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm font-semibold text-gray-700 truncate mb-2" title={product.name}>
          {product.name}
        </h3>
        <p className="text-lg font-bold text-gray-900 mb-4">
          Rating: {product.rating.toFixed(1)}
        </p>
        <button
          onClick={handleAddToCart}
          className="mt-auto w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

function ProductsPage() {
  const { data, loading, error } = useFetch(API_URL);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <span className="ml-4 text-xl text-gray-600">Loading Products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
        <p className="font-bold">Error</p>
        <p>Failed to fetch products: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data &&
          data.recipes.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </div>
  );
}

//==============================================================================
// PAGE: CartPage (Placeholder)
//==============================================================================
function CartPage() {
  const { cart, removeItem, updateQuantity, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="text-center bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600">Looks like you haven't added any recipes to your cart yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>
      <div className="space-y-4">
        {cart.map(item => (
          <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 gap-4">
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
              <div>
                <span className="font-semibold text-lg">{item.name}</span>
                <p className="text-sm text-gray-500">Rating: {item.rating.toFixed(1)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="px-2 py-1 border rounded-md hover:bg-gray-100"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10) || 1)}
                className="w-12 text-center border rounded-md"
                aria-label="Item quantity"
              />
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="px-2 py-1 border rounded-md hover:bg-gray-100"
                aria-label="Increase quantity"
              >
                +
              </button>
              <button onClick={() => removeItem(item.id)} className="ml-4 text-red-500 hover:text-red-700 font-semibold">Remove</button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={clearCart} className="mt-6 w-full bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors">Clear Cart</button>
    </div>
  );
}

//==============================================================================
// PAGE: ProfilePage
//==============================================================================
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

//==============================================================================
// PAGE: HooksDemoPage
//==============================================================================
function HooksDemoPage() {
  const [isModalOpen, toggleModal] = useToggle(false);
  const { width, height } = useWindowSize();
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

//==============================================================================
// COMPONENT: App (Main)
//==============================================================================
function App() {
  const [page, setPage] = useState('home');

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage />;
      case 'products':
        return <ProductsPage />;
      case 'cart':
        return <CartPage />;
      case 'profile':
        return <ProfilePage />;
      case 'hooks':
        return <HooksDemoPage setPage={setPage} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header setPage={setPage} />
      <main className="container mx-auto p-4 md:p-8">
        {renderPage()}
      </main>
      <Notification />
      <footer className="text-center p-4 text-gray-500 mt-8">
        Practical Exam Boilerplate
      </footer>
    </div>
  );
}

export default App;
