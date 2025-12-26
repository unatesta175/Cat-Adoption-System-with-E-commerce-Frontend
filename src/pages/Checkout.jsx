import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';
import { getUploadImageUrl } from '../utils/imageUtils';
import FormInput from '../components/FormInput';
import './Checkout.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51SYq7W2eyUAhZYyLXcsW0B7A2DV3SywDb85Sxr7njgfMlO3vyVbK0uLULQCORQGKriJ5eC5dtIq3BLlXBbMoyQZL007QS1EPPg');

const CheckoutForm = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { cart, getCartTotal, clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Malaysia'
  });

  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create payment intent
      const items = cart.map(item => ({
        productId: item._id,
        quantity: item.quantity
      }));

      const { data } = await ordersAPI.createPaymentIntent(items);

      // Confirm payment
      const cardElement = elements.getElement(CardElement);
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: shippingAddress.fullName
            }
          }
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      // Create order
      const orderData = {
        items,
        paymentIntentId: paymentIntent.id,
        shippingAddress
      };

      await ordersAPI.createOrder(orderData);
      
      // Clear cart and redirect
      clearCart();
      navigate('/orders', { state: { success: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="checkout-section">
        <h2><i className="fas fa-shipping-fast"></i> Shipping Address</h2>
        <div className="form-grid">
          <FormInput
            label="Full Name"
            type="text"
            name="fullName"
            value={shippingAddress.fullName}
            onChange={handleInputChange}
            required
          />
          <FormInput
            label="Address"
            type="text"
            name="address"
            value={shippingAddress.address}
            onChange={handleInputChange}
            required
          />
          <FormInput
            label="City"
            type="text"
            name="city"
            value={shippingAddress.city}
            onChange={handleInputChange}
            required
          />
          <FormInput
            label="State"
            type="text"
            name="state"
            value={shippingAddress.state}
            onChange={handleInputChange}
            required
          />
          <FormInput
            label="ZIP Code"
            type="text"
            name="zipCode"
            value={shippingAddress.zipCode}
            onChange={handleInputChange}
            required
          />
          <FormInput
            label="Country"
            type="text"
            name="country"
            value={shippingAddress.country}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="checkout-section">
        <h2><i className="fas fa-credit-card"></i> Payment Details</h2>
        <div className="card-element-wrapper">
          <CardElement options={cardElementOptions} />
        </div>
        <p className="payment-note">
          <i className="fas fa-lock"></i> Your payment information is secure
        </p>
      </div>

      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary btn-block btn-lg"
        disabled={!stripe || loading}
      >
        {loading ? (
          <>
            <span className="spinner-small"></span> Processing...
          </>
        ) : (
          <>
            <i className="fas fa-lock"></i> Pay RM{(getCartTotal() + 9.99).toFixed(2)}
          </>
        )}
      </button>
    </form>
  );
};

const Checkout = () => {
  const { cart, getCartTotal } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1><i className="fas fa-shopping-bag"></i> Checkout</h1>
        
        <div className="checkout-content">
          <div className="checkout-main">
            <Elements stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          </div>

          <div className="checkout-sidebar">
            <div className="order-summary-card">
              <h2>Order Summary</h2>
              <div className="summary-items">
                {cart.map(item => (
                  <div key={item._id} className="summary-item">
                    <img
                      src={getUploadImageUrl(item.image)}
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/60/9b5de5/ffffff?text=Product';
                      }}
                    />
                    <div className="summary-item-info">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity} × RM{item.price.toFixed(2)}</p>
                    </div>
                    <span className="summary-item-total">
                      RM{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="summary-totals">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

