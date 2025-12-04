import React from 'react';
import { Link } from 'react-router-dom';
import PetCard from './PetCard';
import './RecommendationList.css';

const RecommendationList = ({ recommendations }) => {
  if (recommendations.length === 0) {
    return (
      <div className="no-recommendations">
        <i className="fas fa-heart-broken"></i>
        <h3>No recommendations yet</h3>
        <p>Complete your lifestyle survey to get personalized cat recommendations</p>
     
      </div>
    );
  }

  return (
    <div className="recommendation-list">
      <div className="recommendation-grid">
        {recommendations.map((rec) => (
          <div key={rec.cat._id} className="recommendation-item">
            <div className="compatibility-badge">
              <i className="fas fa-star"></i>
              <span>{rec.compatibilityScore}% Match</span>
            </div>
            <PetCard cat={rec.cat} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationList;




