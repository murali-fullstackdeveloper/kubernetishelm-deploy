// //crud/Update.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { userService } from "@services/api";

const Update = () => {
    const { id } = useParams();
    const [values, setValues] = useState({ 
        name: '', 
        email: '', 
        password: '' 
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await userService.getById(id);
                if (response && response[0]) {
                    const userData = response[0];
                    setValues({ 
                        name: userData.name, 
                        email: userData.email, 
                        password: userData.password 
                    });
                } else {
                    setError('User data not found');
                }
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError('Error loading user data');
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id]);

    const validate = () => {
        const errors = {};
        
        if (!values.name.trim()) {
            errors.name = "Name is required";
        }
        
        if (!values.email.trim()) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = "Email is invalid";
        }
        
        if (!values.password) {
            errors.password = "Password is required";
        }
        
        return errors;
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            return;
        }
        
        setSubmitting(true);
        
        try {
            await userService.update(id, values);
            navigate('/');
        } catch (error) {
            console.error(error);
            setError('Error updating user');
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className='d-flex flex-column vh-100 bg-light justify-content-center align-items-center'>
            <h4>Update User</h4>
            {error && (
                <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                </div>
            )}
            <div className="w-50 mt-2 bg-white rounded p-3 shadow-sm">
                <form onSubmit={handleUpdate} data-testid="update-form">
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="name" 
                            data-testid="input-name"
                            value={values.name} 
                            onChange={e => setValues({ ...values, name: e.target.value })} 
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            id="email" 
                            data-testid="input-email"
                            value={values.email} 
                            onChange={e => setValues({ ...values, email: e.target.value })} 
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="password" 
                            data-testid="input-password"
                            value={values.password} 
                            onChange={e => setValues({ ...values, password: e.target.value })} 
                        />
                    </div>

                    <div className="d-flex">
                        <button 
                            type="submit" 
                            className="btn btn-dark"
                            disabled={submitting}
                            data-testid="update-btn"
                        >
                            {submitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-check2-circle me-2"></i>Update
                                </>
                            )}
                        </button>
                        <Link to={`/read/${id}`} className="btn btn-outline-dark ms-1">
                            <i className="bi bi-x-circle me-2"></i>Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Update;