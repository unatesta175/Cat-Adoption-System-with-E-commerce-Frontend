import React from 'react';
import { Link } from 'react-router-dom';
import './PetCard.css';

const PetCard = ({ cat }) => {
  const getImageUrl = (imageName) => {
    return `/uploads/${imageName}`;
  };

  const getTraitIcon = (trait) => {
    const icons = {
      energyLevel: 'fa-bolt',
      maintenanceLevel: 'fa-wrench',
      goodWithKids: 'fa-child',
      personality: 'fa-smile'
    };
    return icons[trait] || 'fa-info-circle';
  };

  return (
    <div className="pet-card">
      <div className="pet-card-image">
        <img 
          src={getImageUrl(cat.image)} 
          alt={cat.name}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300/9b5de5/ffffff?text=Cat+Image';
          }}
        />
        <div className="pet-card-badge">
          <i className="fas fa-paw"></i> Available
        </div>
      </div>
      
      <div className="pet-card-content">
        <h3 className="pet-card-name">{cat.name}</h3>
        <p className="pet-card-breed">{cat.breed}</p>
        
        <div className="pet-card-info">
          <span><i className="fas fa-birthday-cake"></i> {cat.age} {cat.age === 1 ? 'year' : 'years'}</span>
          <span><i className="fas fa-venus-mars"></i> {cat.gender}</span>
        </div>
        
        <p className="pet-card-description">
          {cat.description.substring(0, 100)}...
        </p>
        
        <div className="pet-card-traits">
          <span className="trait" title="Energy Level">
            <i className="fas fa-bolt"></i> {cat.traits.energyLevel}
          </span>
          <span className="trait" title="Personality">
            <i className="fas fa-smile"></i> {cat.traits.personality}
          </span>
          {cat.traits.goodWithKids && (
            <span className="trait trait-highlight" title="Good with kids">
              <i className="fas fa-child"></i> Kid-friendly
            </span>
          )}
        </div>
        
        <Link to={`/cats/${cat._id}`} className="btn btn-primary btn-block">
          <i className="fas fa-info-circle"></i> Learn More
        </Link>
      </div>
    </div>
  );
};

export default PetCard;




