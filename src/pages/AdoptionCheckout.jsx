import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { catsAPI, adoptionsAPI } from '../services/api';
import FormInput from '../components/FormInput';
import './AdoptionCheckout.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51SYq7W2eyUAhZYyLXcsW0B7A2DV3SywDb85Sxr7njgfMlO3vyVbK0uLULQCORQGKriJ5eC5dtIq3BLlXBbMoyQZL007QS1EPPg');

const AdoptionCheckoutForm = ({ cat, adoptionFee }) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  
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
      const { data } = await adoptionsAPI.createPaymentIntent(cat._id);

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

      // Create adoption
      const adoptionData = {
        catId: cat._id,
        paymentIntentId: paymentIntent.id,
        shippingAddress
      };

      await adoptionsAPI.purchaseAdoption(adoptionData);
      
      // Redirect to dashboard with success
      navigate('/dashboard', { state: { adoptionSuccess: true } });
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
    <form onSubmit={handleSubmit} className="adoption-checkout-form">
      <div className="checkout-section">
        <h2><i className="fas fa-shipping-fast"></i> Contact & Pickup Information</h2>
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
            <i className="fas fa-lock"></i> Pay RM{adoptionFee.toFixed(2)} to Adopt
          </>
        )}
      </button>
    </form>
  );
};

const AdoptionCheckout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCatDetails();
  }, [id]);

  const loadCatDetails = async () => {
    try {
      setLoading(true);
      const res = await catsAPI.getCatById(id);
      setCat(res.data);
      
      if (res.data.isAdopted) {
        navigate(`/cats/${id}`);
      }
    } catch (error) {
      console.error('Error loading cat:', error);
      navigate('/browse');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!cat) {
    return null;
  }

  return (
    <div className="adoption-checkout-page">
      <div className="container">
        <h1><i className="fas fa-heart"></i> Adopt {cat.name}</h1>
        
        <div className="checkout-content">
          <div className="checkout-main">
            <Elements stripe={stripePromise}>
              <AdoptionCheckoutForm cat={cat} adoptionFee={cat.adoptionFee || 0} />
            </Elements>
          </div>

          <div className="checkout-sidebar">
            <div className="adoption-summary-card">
              <h2>Adoption Summary</h2>
              <div className="cat-preview">
                <img
                  src={`/uploads/${cat.image}`}
                  alt={cat.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200/9b5de5/ffffff?text=Cat';
                  }}
                />
                <div className="cat-preview-info">
                  <h3>{cat.name}</h3>
                  <p><i className="fas fa-dna"></i> {cat.breed}</p>
                  <p><i className="fas fa-birthday-cake"></i> {cat.age} {cat.age === 1 ? 'year' : 'years'} old</p>
                  <p><i className="fas fa-venus-mars"></i> {cat.gender}</p>
                </div>
              </div>
              <div className="summary-totals">
                <div className="summary-row">
                  <span>Adoption Fee</span>
                  <span>RM{cat.adoptionFee?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="summary-row summary-total">
                  <span>Total</span>
                  <span>RM{cat.adoptionFee?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
              <div className="adoption-note">
                <i className="fas fa-info-circle"></i>
                <p>After payment, you'll receive confirmation and pickup instructions for your new companion.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdoptionCheckout;

