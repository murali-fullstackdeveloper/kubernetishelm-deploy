// //crud/Read.jsx

import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { userService } from "@services/api";

const Read = () => {
    const { id } = useParams();
    const [data, setData] = useState({
        id: '',
        name: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await userService.getById(id);
                if (response && response[0]) {
                    const userData = response[0];
                    setData({
                        id: userData._id,
                        name: userData.name,
                        email: userData.email,
                        password: userData.password
                    });
                } else {
                    setError('User not found');
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

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await userService.delete(id);
                window.location.href = "/";  // Redirect to home after deletion
            } catch (error) {
                console.error(error);
                setError('Error deleting user');
            }
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

    if (error) {
        return (
            <div className="d-flex flex-column vh-100 bg-light justify-content-center align-items-center">
                <div className="alert alert-danger w-50">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                </div>
                <Link to="/" className="btn btn-primary mt-3">Return to Home</Link>
            </div>
        );
    }

    return (
        <div className='d-flex flex-column vh-100 bg-light justify-content-center align-items-center'>
            <h4>User Details</h4>

            <div className='w-50 mt-2 bg-white rounded p-3 shadow-sm'>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="name" 
                        value={data.name} 
                        disabled 
                        data-testid="user-name"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="email" 
                        value={data.email} 
                        disabled 
                        data-testid="user-email"
                    />
                </div>

                <div className="mb-3">
                    <Link to='/' className='btn btn-dark'>
                        <i className="bi bi-arrow-left me-2"></i>Back
                    </Link>
                    <Link to={`/update/${id}`} className='btn btn-outline-dark ms-1'>
                        <i className="bi bi-pencil me-2"></i>Update
                    </Link>
                    <button 
                        onClick={handleDelete} 
                        className='btn btn-danger ms-1'
                        data-testid="delete-btn"
                    >
                        <i className="bi bi-trash me-2"></i>Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Read;