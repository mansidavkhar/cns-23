import React, { createContext, useContext, useReducer } from 'react';

// 1. Define actions for the reducer
const ACTIONS = {
  ADD_ITEM: 'add-item',
  REMOVE_ITEM: 'remove-item',
  UPDATE_QUANTITY: 'update-quantity',
  CLEAR_CART: 'clear-cart',
};

// 2. Create the reducer function
// Reducers are great for managing complex state (like a cart)
function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_ITEM: {
      const { product } = action.payload;
      const existingItem = state.find((item) => item.id === product.id);
      if (existingItem) {
        // If item exists, just increase quantity
        return state.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // If new item, add to cart with quantity 1
      return [...state, { ...product, quantity: 1 }];
    }
    case ACTIONS.REMOVE_ITEM: {
      const { productId } = action.payload;
      return state.filter((item) => item.id !== productId);
    }
    case ACTIONS.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;
      // Prevent quantity from being less than 1
      const newQuantity = Math.max(1, quantity);
      return state.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    }
    case ACTIONS.CLEAR_CART:
      return []; // Return an empty array
    default:
      return state;
  }
}

// 3. Create the Context
const CartContext = createContext();

// 4. Create the Provider Component
export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);

  // Create helper functions that dispatch actions
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

  const value = {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// 5. Create a custom hook for easy consumption
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
