import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-overlay"></div>
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            <i className="fas fa-heart"></i> Find Your Purrfect Match
          </h1>
          <p className="hero-subtitle">
            Discover cats that match your lifestyle and bring joy to your home
          </p>
          <div className="hero-buttons">
            <Link to="/browse" className="btn btn-primary btn-lg">
              <i className="fas fa-search"></i> Browse Cats
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg">
              <i className="fas fa-user-plus"></i> Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;




