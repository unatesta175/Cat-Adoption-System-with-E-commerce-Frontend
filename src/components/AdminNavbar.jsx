import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const AdminNavbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to={isAuthenticated ? "/admin/dashboard" : "/admin/login"} className="navbar-brand">
            <i className="fas fa-cat"></i>
            <span>Purrfect Match</span>
          </Link>

          <ul className="navbar-menu">
            {isAuthenticated && (
              <>
                <li className="admin-badge">
                  <i className="fas fa-user-shield"></i> Admin Panel
                </li>
                <li>
                  <button onClick={handleLogout} className="btn-logout">
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;



