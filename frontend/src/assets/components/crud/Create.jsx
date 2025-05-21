// //crud/Create.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from "@services/api";

const Create = () => {
  const [values, setValues] = useState({ 
    name: '', 
    email: '', 
    password: '' 
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    
    if (!values.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!values.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!values.password) {
      newErrors.password = "Password is required";
    } else if (values.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await userService.create(values);
      navigate('/');
    } catch (error) {
      console.error(error);
      alert("Failed to create user. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column vh-100 bg-light justify-content-center align-items-center">
      <h4>Add New User</h4>

      <div className="w-50 mt-2 bg-white rounded p-3 shadow-sm">
        <form onSubmit={handleSubmit} data-testid="create-form">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input 
              type="text" 
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              id="name" 
              data-testid="input-name"
              value={values.name}
              onChange={e => setValues({ ...values, name: e.target.value })} 
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input 
              type="email" 
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              id="email" 
              data-testid="input-email"
              value={values.email}
              onChange={e => setValues({ ...values, email: e.target.value })} 
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input 
              type="password" 
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              id="password" 
              data-testid="input-password"
              value={values.password}
              onChange={e => setValues({ ...values, password: e.target.value })} 
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <div className="d-flex">
            <button 
              type="submit" 
              className="btn btn-dark" 
              disabled={loading}
              data-testid="submit-btn"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Submitting...
                </>
              ) : 'Submit'}
            </button>
            <Link to="/" className="btn btn-outline-dark ms-2">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;