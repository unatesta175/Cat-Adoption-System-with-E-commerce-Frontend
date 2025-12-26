import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getUploadImageUrl } from '../utils/imageUtils';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1><i className="fas fa-shopping-cart"></i> Shopping Cart</h1>
          <div className="empty-cart">
            <i className="fas fa-shopping-cart"></i>
            <h2>Your cart is empty</h2>
            <p>Add some products to get started!</p>
            <button className="btn btn-primary" onClick={() => navigate('/shop')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1><i className="fas fa-shopping-cart"></i> Shopping Cart</h1>
          <button className="btn btn-outline-danger" onClick={clearCart}>
            <i className="fas fa-trash"></i> Clear Cart
          </button>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item._id} className="cart-item">
                <img
                  src={getUploadImageUrl(item.image)}
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100/9b5de5/ffffff?text=Product';
                  }}
                />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <span className="item-category">{item.category}</span>
                  <p className="item-price">RM{item.price.toFixed(2)} each</p>
                </div>
                <div className="item-quantity">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                <div className="item-total">
                  <p>RM{(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button
                  className="btn-remove"
                  onClick={() => removeFromCart(item._id)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>RM{getCartTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>RM9.99</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>RM{(getCartTotal() + 9.99).toFixed(2)}</span>
            </div>
            <button className="btn btn-primary btn-block" onClick={handleCheckout}>
              <i className="fas fa-lock"></i> Proceed to Checkout
            </button>
            <button
              className="btn btn-outline-secondary btn-block"
              onClick={() => navigate('/shop')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

