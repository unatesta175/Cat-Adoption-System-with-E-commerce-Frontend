import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      
      <section className="features-section py-5">
        <div className="container">
          <h2 className="section-title text-center mb-4">Why Choose Purrfect Match?</h2>
          
          <div className="features-grid grid grid-3">
            <div className="feature-card card text-center">
              <div className="feature-icon">
                <i className="fas fa-search-plus"></i>
              </div>
              <h3>Smart Matching</h3>
              <p>Our intelligent algorithm matches you with cats that fit your lifestyle and preferences</p>
            </div>
            
            <div className="feature-card card text-center">
              <div className="feature-icon">
                <i className="fas fa-heart"></i>
              </div>
              <h3>Easy Adoption</h3>
              <p>Streamlined adoption process with simple application and quick approval</p>
            </div>
            
            <div className="feature-card card text-center">
              <div className="feature-icon">
                <i className="fas fa-paw"></i>
              </div>
              <h3>Perfect Companions</h3>
              <p>Find your perfect feline friend who will bring joy to your home</p>
            </div>
          </div>
        </div>
      </section>

      <section className="shop-promo-section py-5">
        <div className="container">
          <div className="shop-promo-card card text-center">
            <div className="shop-promo-icon">
              <i className="fas fa-shopping-bag"></i>
            </div>
            <h2>Cat Supplies Shop</h2>
            <p>Everything your feline friend needs - from premium food to fun toys and cozy beds</p>
            <Link to="/shop" className="btn btn-primary btn-lg">
              <i className="fas fa-store"></i> Visit Shop
            </Link>
          </div>
        </div>
      </section>
      
      <section className="cta-section py-5">
        <div className="container">
          <div className="cta-card card text-center">
            <h2>Ready to Meet Your New Best Friend?</h2>
            <p>Start your journey to finding the perfect cat companion today</p>
            <div className="cta-buttons">
              <Link to="/browse" className="btn btn-primary btn-lg">
                <i className="fas fa-cat"></i> Browse Available Cats
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg">
                <i className="fas fa-user-plus"></i> Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;




