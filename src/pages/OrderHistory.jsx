import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import './OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
    loadOrders();
  }, [location]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await ordersAPI.getMyOrders();
      setOrders(res.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      processing: '#2196f3',
      shipped: '#9c27b0',
      delivered: '#4caf50',
      cancelled: '#f44336'
    };
    return colors[status] || '#999';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: 'fa-clock',
      processing: 'fa-cog',
      shipped: 'fa-shipping-fast',
      delivered: 'fa-check-circle',
      cancelled: 'fa-times-circle'
    };
    return icons[status] || 'fa-question-circle';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <div className="container">
        {showSuccess && (
          <div className="success-banner">
            <i className="fas fa-check-circle"></i>
            <div>
              <h3>Order Placed Successfully!</h3>
              <p>Thank you for your purchase. Your order is being processed.</p>
            </div>
          </div>
        )}

        <h1><i className="fas fa-history"></i> Order History</h1>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <i className="fas fa-box-open"></i>
            <h2>No orders yet</h2>
            <p>Your order history will appear here</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                    <p className="order-date">
                      <i className="far fa-calendar"></i>
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="order-status" style={{ backgroundColor: getStatusColor(order.status) }}>
                    <i className={`fas ${getStatusIcon(order.status)}`}></i>
                    <span>{order.status}</span>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <img
                        src={`/uploads/${item.product?.image || 'default-product.jpg'}`}
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80/9b5de5/ffffff?text=Product';
                        }}
                      />
                      <div className="order-item-details">
                        <h4>{item.name}</h4>
                        <p>Quantity: {item.quantity}</p>
                        <p className="order-item-price">RM{item.price.toFixed(2)} each</p>
                      </div>
                      <div className="order-item-total">
                        RM{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="shipping-address">
                    <h4><i className="fas fa-map-marker-alt"></i> Shipping Address</h4>
                    <p>{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                  <div className="order-total">
                    <h4>Total Amount</h4>
                    <p className="total-amount">RM{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;

