import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage (guests can have cart too)
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Clear cart when user logs out
  useEffect(() => {
    const handleUserLogout = () => {
      setCart([]);
      localStorage.removeItem('cart');
    };

    // Clear cart when a different user logs in (to prevent cart sharing between users)
    const handleUserLogin = (event) => {
      if (event.detail?.clearCart) {
        setCart([]);
        localStorage.removeItem('cart');
      }
    };

    // Listen for custom events from AuthContext
    window.addEventListener('userLogout', handleUserLogout);
    window.addEventListener('userLogin', handleUserLogin);

    // No need to check on mount - allow guest carts

    return () => {
      window.removeEventListener('userLogout', handleUserLogout);
      window.removeEventListener('userLogin', handleUserLogin);
    };
  }, []); // Only run on mount

  useEffect(() => {
    // Save cart to localStorage (works for both guests and logged-in users)
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};









