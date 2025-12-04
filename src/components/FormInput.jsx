import React from 'react';
import './FormInput.css';

const FormInput = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  options = [],
  rows = 4
}) => {
  const renderInput = () => {
    if (type === 'select') {
      return (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="form-select"
          required={required}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (type === 'textarea') {
      return (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="form-textarea"
          required={required}
          rows={rows}
        />
      );
    }

    if (type === 'checkbox') {
      return (
        <label className="checkbox-label">
          <input
            type="checkbox"
            name={name}
            checked={value}
            onChange={onChange}
            className="form-checkbox"
          />
          <span>{label}</span>
        </label>
      );
    }

    return (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-input"
        required={required}
      />
    );
  };

  return (
    <div className="form-group">
      {type !== 'checkbox' && label && (
        <label className="form-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      {renderInput()}
    </div>
  );
};

export default FormInput;




