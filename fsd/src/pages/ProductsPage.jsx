import React from 'react';
import { useFetch } from '../hooks/useFetch';
import { useCart } from '../contexts/CartContext';
import { useNotification } from '../contexts/NotificationContext';
import { Loader2 } from 'lucide-react';

// A good free public API for placeholder products
const API_URL = 'https://fakestoreapi.com/products?limit=12';

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
        <h3 className="text-sm font-semibold text-gray-700 truncate mb-2">
          {product.title}
        </h3>
        <p className="text-lg font-bold text-gray-900 mb-4">
          ${product.price.toFixed(2)}
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
  // Use the custom useFetch hook
  const { data: products, loading, error } = useFetch(API_URL);

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
        {products &&
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </div>
  );
}

export default ProductsPage;
