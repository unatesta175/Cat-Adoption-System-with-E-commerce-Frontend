import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { recommendationsAPI, adoptionsAPI, authAPI } from '../services/api';
import RecommendationList from '../components/RecommendationList';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user, updateUserPreferences } = useAuth();
  const location = useLocation();
  const [recommendations, setRecommendations] = useState([]);
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSurvey, setShowSurvey] = useState(false);
  const [showAdoptionSuccess, setShowAdoptionSuccess] = useState(false);
  const [preferences, setPreferences] = useState({
    homeType: user?.preferences?.homeType || '',
    activityLevel: user?.preferences?.activityLevel || '',
    hasKids: user?.preferences?.hasKids || false,
    experienceLevel: user?.preferences?.experienceLevel || '',
    preferredPersonality: user?.preferences?.preferredPersonality || ''
  });

  useEffect(() => {
    loadDashboardData();
    if (location.state?.adoptionSuccess) {
      setShowAdoptionSuccess(true);
      setTimeout(() => setShowAdoptionSuccess(false), 5000);
    }
  }, [location]);

  // Sync preferences form with user data when modal opens
  useEffect(() => {
    if (showSurvey && user?.preferences) {
      setPreferences({
        homeType: user.preferences.homeType || '',
        activityLevel: user.preferences.activityLevel || '',
        hasKids: user.preferences.hasKids || false,
        experienceLevel: user.preferences.experienceLevel || '',
        preferredPersonality: user.preferences.preferredPersonality || ''
      });
    }
  }, [showSurvey, user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load adoption requests
      const adoptionsRes = await adoptionsAPI.getMyRequests();
      setAdoptionRequests(adoptionsRes.data);

      // Load recommendations if user has preferences
      if (user.preferences && user.preferences.homeType) {
        try {
          const recsRes = await recommendationsAPI.getRecommendations();
          setRecommendations(recsRes.data);
        } catch (error) {
          console.error('Error loading recommendations:', error);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences({
      ...preferences,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSurveySubmit = async (e) => {
    e.preventDefault();
    try {
      await authAPI.updatePreferences(preferences);
      updateUserPreferences(preferences);
      setShowSurvey(false);
      
      // Fetch recommendations immediately with new preferences
      try {
        const recsRes = await recommendationsAPI.getRecommendations();
        setRecommendations(recsRes.data);
      } catch (error) {
        console.error('Error loading recommendations:', error);
      }
      
      // Reload other dashboard data
      const adoptionsRes = await adoptionsAPI.getMyRequests();
      setAdoptionRequests(adoptionsRes.data);
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'processing': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      default: return 'warning';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-page py-5">
      <div className="container">
        {showAdoptionSuccess && (
          <div className="success-banner" style={{ background: 'linear-gradient(135deg, #4caf50, #45a049)', color: 'white', padding: '20px 30px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px', boxShadow: '0 4px 6px rgba(76, 175, 80, 0.3)' }}>
            <i className="fas fa-check-circle" style={{ fontSize: '2.5rem' }}></i>
            <div>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '1.3rem' }}>Adoption Successful!</h3>
              <p style={{ margin: 0, opacity: 0.95 }}>Thank you for adopting! Your new companion is waiting for you.</p>
            </div>
          </div>
        )}
        <div className="dashboard-header">
          <div>
            <h1><i className="fas fa-user-circle"></i> Welcome, {user.name}!</h1>
            <p>Manage your adoption journey and find your perfect match</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowSurvey(true)}>
            <i className="fas fa-clipboard-list" style={{ marginRight: '8px' }}></i>
            {user.preferences?.homeType ? 'Update Survey' : 'Take Survey'}
          </button>
        </div>

        <div className="dashboard-grid">
          {/* My Adoptions */}
          <div className="dashboard-section card">
            <h2><i className="fas fa-heart"></i> My Adoptions</h2>
            {adoptionRequests.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-folder-open"></i>
                <p>No adoptions yet</p>
                <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>Browse cats to find your perfect companion!</p>
              </div>
            ) : (
              <div className="requests-list">
                {adoptionRequests.map((request) => (
                  <div key={request._id} className="request-item">
                    <div className="request-cat-info">
                      <img 
                        src={`/uploads/${request.catId.image}`} 
                        alt={request.catId.name}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80/9b5de5/ffffff?text=Cat';
                        }}
                      />
                      <div>
                        <h4>{request.catId.name}</h4>
                        <p>{request.catId.breed}</p>
                        {request.adoptionFee && (
                          <p style={{ color: '#667eea', fontWeight: '600', marginTop: '5px' }}>
                            RM{request.adoptionFee.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className={`status-badge status-${getStatusColor(request.status)}`}>
                      {request.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Preferences */}
          <div className="dashboard-section card">
            <h2><i className="fas fa-cog"></i> My Preferences</h2>
            {user.preferences?.homeType ? (
              <div className="preferences-display">
                <div className="pref-item">
                  <i className="fas fa-home"></i>
                  <div>
                    <strong>Home Type</strong>
                    <span className="capitalize">{user.preferences.homeType}</span>
                  </div>
                </div>
                <div className="pref-item">
                  <i className="fas fa-running"></i>
                  <div>
                    <strong>Activity Level</strong>
                    <span className="capitalize">{user.preferences.activityLevel}</span>
                  </div>
                </div>
                <div className="pref-item">
                  <i className="fas fa-child"></i>
                  <div>
                    <strong>Has Kids</strong>
                    <span>{user.preferences.hasKids ? 'Yes' : 'No'}</span>
                  </div>
                </div>
                <div className="pref-item">
                  <i className="fas fa-star"></i>
                  <div>
                    <strong>Experience Level</strong>
                    <span className="capitalize">{user.preferences.experienceLevel}</span>
                  </div>
                </div>
                <div className="pref-item">
                  <i className="fas fa-smile"></i>
                  <div>
                    <strong>Preferred Personality</strong>
                    <span className="capitalize">{user.preferences.preferredPersonality}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <i className="fas fa-clipboard-list"></i>
                <p>Complete your lifestyle survey to get personalized recommendations</p>
                <button className="btn btn-secondary" onClick={() => setShowSurvey(true)} style={{ textAlign: 'center' }}>
                  Take Survey
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="recommendations-section">
          <h2><i className="fas fa-star"></i> Recommended For You</h2>
          <RecommendationList recommendations={recommendations} />
        </div>

        {/* Survey Modal */}
        <Modal isOpen={showSurvey} onClose={() => setShowSurvey(false)} title="Lifestyle Survey">
          <form onSubmit={handleSurveySubmit}>
            <FormInput
              label="Home Type"
              type="select"
              name="homeType"
              value={preferences.homeType}
              onChange={handlePreferenceChange}
              options={[
                { value: 'apartment', label: 'Apartment' },
                { value: 'house', label: 'House' },
                { value: 'farm', label: 'Farm' }
              ]}
              required
            />

            <FormInput
              label="Activity Level"
              type="select"
              name="activityLevel"
              value={preferences.activityLevel}
              onChange={handlePreferenceChange}
              options={[
                { value: 'low', label: 'Low - Prefer calm activities' },
                { value: 'moderate', label: 'Moderate - Balanced lifestyle' },
                { value: 'high', label: 'High - Very active' }
              ]}
              required
            />

            <FormInput
              label="Do you have kids?"
              type="checkbox"
              name="hasKids"
              value={preferences.hasKids}
              onChange={handlePreferenceChange}
            />

            <FormInput
              label="Experience Level"
              type="select"
              name="experienceLevel"
              value={preferences.experienceLevel}
              onChange={handlePreferenceChange}
              options={[
                { value: 'beginner', label: 'Beginner - First time owner' },
                { value: 'intermediate', label: 'Intermediate - Some experience' },
                { value: 'experienced', label: 'Experienced - Many years' }
              ]}
              required
            />

            <FormInput
              label="Preferred Personality"
              type="select"
              name="preferredPersonality"
              value={preferences.preferredPersonality}
              onChange={handlePreferenceChange}
              options={[
                { value: 'playful', label: 'Playful - Energetic and fun' },
                { value: 'calm', label: 'Calm - Relaxed and gentle' },
                { value: 'independent', label: 'Independent - Low maintenance' },
                { value: 'social', label: 'Social - Loves attention' }
              ]}
              required
            />

            <button type="submit" className="btn btn-primary btn-block">
              Save Preferences
            </button>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default UserDashboard;



