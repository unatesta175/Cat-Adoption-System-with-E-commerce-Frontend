import React, { useState, useEffect } from 'react';
import { catsAPI } from '../services/api';
import PetCard from '../components/PetCard';
import './Browse.css';

const Browse = () => {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    breed: '',
    gender: '',
    energyLevel: '',
    goodWithKids: ''
  });

  useEffect(() => {
    fetchCats();
  }, []);

  const fetchCats = async () => {
    try {
      setLoading(true);
      const response = await catsAPI.getAllCats();
      setCats(response.data);
    } catch (err) {
      setError('Failed to load cats. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const filteredCats = cats.filter(cat => {
    if (filters.breed && cat.breed.toLowerCase() !== filters.breed.toLowerCase()) return false;
    if (filters.gender && cat.gender !== filters.gender) return false;
    if (filters.energyLevel && cat.traits.energyLevel !== filters.energyLevel) return false;
    if (filters.goodWithKids === 'true' && !cat.traits.goodWithKids) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="browse-page py-5">
      <div className="container">
        <div className="browse-header">
          <h1><i className="fas fa-paw"></i> Browse Available Cats</h1>
          <p>Find your perfect feline companion from our available cats</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        <div className="filters-section card mb-4">
          <h3><i className="fas fa-filter"></i> Filters</h3>
          <div className="filters-grid">
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select 
                name="gender" 
                value={filters.gender} 
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">All</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Energy Level</label>
              <select 
                name="energyLevel" 
                value={filters.energyLevel} 
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">All</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Good with Kids</label>
              <select 
                name="goodWithKids" 
                value={filters.goodWithKids} 
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">All</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
        </div>

        {filteredCats.length === 0 ? (
          <div className="no-results">
            <i className="fas fa-cat"></i>
            <h3>No cats found</h3>
            <p>Try adjusting your filters or check back later for new arrivals</p>
          </div>
        ) : (
          <div className="cats-grid grid grid-3">
            {filteredCats.map(cat => (
              <PetCard key={cat._id} cat={cat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;




