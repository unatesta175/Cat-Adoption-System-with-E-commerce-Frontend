import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { catsAPI, adoptionsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getUploadImageUrl } from '../utils/imageUtils';
import './CatDetails.css';

const CatDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCatDetails();
  }, [id]);

  const fetchCatDetails = async () => {
    try {
      setLoading(true);
      const response = await catsAPI.getCatById(id);
      setCat(response.data);
    } catch (err) {
      setError('Failed to load cat details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (cat.isAdopted) {
      setError('This cat is already adopted');
      return;
    }

    // Navigate to adoption checkout
    navigate(`/adopt/${cat._id}/checkout`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!cat) {
    return (
      <div className="container py-5">
        <div className="alert alert-error">Cat not found</div>
      </div>
    );
  }

  return (
    <div className="cat-details-page py-5">
      <div className="container">
        {error && <div className="alert alert-error mb-3">{error}</div>}
        {success && <div className="alert alert-success mb-3">{success}</div>}

        <div className="cat-details-content">
          <div className="cat-image-section">
            <img 
              src={getUploadImageUrl(cat.image)} 
              alt={cat.name}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x400/9b5de5/ffffff?text=Cat+Image';
              }}
            />
          </div>

          <div className="cat-info-section">
            <div className="cat-header">
              <h1>{cat.name}</h1>
              <div className={`cat-status-badge ${cat.isAdopted ? 'adopted' : 'available'}`}>
                <i className={`fas ${cat.isAdopted ? 'fa-times-circle' : 'fa-check-circle'}`}></i> 
                {cat.isAdopted ? 'Adopted' : 'Available'}
              </div>
            </div>

            <p className="cat-breed"><i className="fas fa-dna"></i> {cat.breed}</p>

            {!cat.isAdopted && (
              <div className="adoption-fee">
                <h2 className="fee-amount">RM{cat.adoptionFee?.toFixed(2) || '0.00'}</h2>
                <p className="fee-label">Adoption Fee</p>
              </div>
            )}

            <div className="cat-quick-info">
              <div className="info-item">
                <i className="fas fa-birthday-cake"></i>
                <div>
                  <strong>Age</strong>
                  <span>{cat.age} {cat.age === 1 ? 'year' : 'years'}</span>
                </div>
              </div>
              <div className="info-item">
                <i className="fas fa-venus-mars"></i>
                <div>
                  <strong>Gender</strong>
                  <span className="capitalize">{cat.gender}</span>
                </div>
              </div>
            </div>

            <div className="cat-description">
              <h3><i className="fas fa-info-circle"></i> About {cat.name}</h3>
              <p>{cat.description}</p>
            </div>

            <div className="cat-traits-section">
              <h3><i className="fas fa-star"></i> Personality & Traits</h3>
              <div className="traits-grid">
                <div className="trait-item">
                  <i className="fas fa-bolt"></i>
                  <strong>Energy Level</strong>
                  <span className="capitalize">{cat.traits.energyLevel}</span>
                </div>
                <div className="trait-item">
                  <i className="fas fa-wrench"></i>
                  <strong>Maintenance</strong>
                  <span className="capitalize">{cat.traits.maintenanceLevel}</span>
                </div>
                <div className="trait-item">
                  <i className="fas fa-smile"></i>
                  <strong>Personality</strong>
                  <span className="capitalize">{cat.traits.personality}</span>
                </div>
                <div className="trait-item">
                  <i className="fas fa-child"></i>
                  <strong>Good with Kids</strong>
                  <span>{cat.traits.goodWithKids ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleAdoptNow}
              disabled={cat.isAdopted}
              className="btn btn-primary btn-lg btn-block"
            >
              <i className="fas fa-heart"></i> 
              {cat.isAdopted ? 'Already Adopted' : 'Adopt Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatDetails;




