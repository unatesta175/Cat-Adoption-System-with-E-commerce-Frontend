import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <i className="fas fa-cat"></i>
            <span>Purrfect Match</span>
          </Link>

          <ul className="navbar-menu">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/browse">Browse Cats</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            
            {isAuthenticated ? (
              <>
                <li>
                  <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'}>
                    Dashboard
                  </Link>
                </li>
                {!isAdmin && (
                  <li>
                    <Link to="/orders">Orders</Link>
                  </li>
                )}
                <li className="cart-link-wrapper">
                  <Link to="/cart" className="cart-link">
                    <i className="fas fa-shopping-cart"></i>
                    {getCartCount() > 0 && (
                      <span className="cart-badge">{getCartCount()}</span>
                    )}
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="btn-logout">
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="cart-link-wrapper">
                  <Link to="/cart" className="cart-link">
                    <i className="fas fa-shopping-cart"></i>
                    {getCartCount() > 0 && (
                      <span className="cart-badge">{getCartCount()}</span>
                    )}
                  </Link>
                </li>
                <li><Link to="/login" className="btn btn-secondary btn-sm">Login</Link></li>
                <li><Link to="/register" className="btn btn-primary btn-sm">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



