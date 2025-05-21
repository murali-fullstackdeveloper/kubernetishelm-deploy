// //crud/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userService } from "@services/api";

const Home = () => {
    const [getData, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await userService.getAll();
            setData(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setError("Failed to fetch data");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await userService.delete(id);
                fetchData();
            } catch (error) {
                console.error(error);
                alert("Failed to delete user");
            }
        }
    };

    if (loading) {
        return (
            <div className="d-flex flex-column vh-100 justify-content-center align-items-center" style={{ background: "linear-gradient(to right, #f8f9fa, #e9ecef)" }}>
                <div className="spinner-grow text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 fw-bold text-primary">Loading your data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="d-flex flex-column vh-100 justify-content-center align-items-center" style={{ background: "linear-gradient(to right, #f8f9fa, #e9ecef)" }}>
                <div className="alert alert-danger border-start border-5 border-danger shadow" role="alert" style={{ maxWidth: "400px" }}>
                    <div className="d-flex">
                        <div className="me-3">
                            <i className="bi bi-exclamation-octagon-fill fs-1 text-danger"></i>
                        </div>
                        <div>
                            <h4 className="alert-heading">Error Loading Data</h4>
                            <p className="mb-0">{error}</p>
                        </div>
                    </div>
                </div>
                <button className="btn btn-primary mt-3 px-4 py-2 fw-bold shadow-sm" onClick={fetchData}>
                    <i className="bi bi-arrow-clockwise me-2"></i>Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="min-vh-100 py-5" style={{ background: "linear-gradient(to right, #f8f9fa, #e9ecef)" }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="card border-0 shadow" style={{ borderRadius: "12px", overflow: "hidden" }}>
                            {/* Header Section with Gradient */}
                            <div className="card-header border-0 py-4" style={{ background: "linear-gradient(to right, #4e73df, #6f42c1)" }}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h4 className="mb-0 text-white fw-bold">
                                            <i className="bi bi-people-fill me-2"></i>User Management Dashboard
                                        </h4>
                                        <p className="text-white-50 mb-0">Manage your users with ease</p>
                                    </div>
                                    <Link to="/create" className="btn btn-light text-primary fw-bold px-4">
                                        <i className="bi bi-plus-circle-fill me-2"></i>Add New User
                                    </Link>
                                </div>
                            </div>
                            
                            {/* Main Content Area */}
                            <div className="card-body p-4">
                                {getData.length === 0 ? (
                                    <div className="text-center py-5">
                                        <div className="mb-4">
                                            <i className="bi bi-inbox-fill display-1 text-secondary opacity-50"></i>
                                        </div>
                                        <h5 className="fw-bold text-secondary mb-3">No Users Found</h5>
                                        <p className="text-muted mb-4">Your user database is currently empty. Add your first user to get started.</p>
                                        <Link to="/create" className="btn btn-primary px-4 py-2 fw-bold">
                                            <i className="bi bi-person-plus-fill me-2"></i>Add Your First User
                                        </Link>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="row mb-4 align-items-center">
                                            <div className="col">
                                                <h5 className="mb-0 text-secondary">
                                                    <i className="bi bi-list-ul me-2"></i>User Records
                                                </h5>
                                            </div>
                                            <div className="col-auto">
                                                <button className="btn btn-outline-secondary btn-sm" onClick={fetchData}>
                                                    <i className="bi bi-arrow-repeat me-1"></i>Refresh
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="table-responsive border border-2 rounded-3" style={{ boxShadow: "0 0 10px rgba(0,0,0,0.05)" }}>
                                            <table className="table table-hover mb-0">
                                                <thead className="table-light border-bottom">
                                                    <tr>
                                                        <th scope="col" className="ps-4 py-3 text-uppercase text-secondary fw-bold" style={{ fontSize: "0.85rem" }}>
                                                            <i className="bi bi-person me-2"></i>Name
                                                        </th>
                                                        <th scope="col" className="py-3 text-uppercase text-secondary fw-bold" style={{ fontSize: "0.85rem" }}>
                                                            <i className="bi bi-envelope me-2"></i>Email
                                                        </th>
                                                        <th scope="col" className="text-end pe-4 py-3 text-uppercase text-secondary fw-bold" style={{ fontSize: "0.85rem" }}>
                                                            <i className="bi bi-gear me-2"></i>Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {getData.map((data, index) => (
                                                        <tr key={data._id} className={index % 2 === 0 ? "bg-white" : "bg-light"}>
                                                            <td className="ps-4 py-3 fw-medium">{data.name}</td>
                                                            <td className="py-3">{data.email}</td>
                                                            <td className="text-end pe-4 py-3">
                                                                <div className="btn-group">
                                                                    <Link to={`/read/${data._id}`} className="btn btn-outline-primary" title="View Details">
                                                                        <i className="bi bi-eye-fill"></i>
                                                                    </Link>
                                                                    <Link to={`/update/${data._id}`} className="btn btn-outline-warning" title="Edit User">
                                                                        <i className="bi bi-pencil-fill"></i>
                                                                    </Link>
                                                                    <button 
                                                                        onClick={() => handleDelete(data._id)} 
                                                                        className="btn btn-outline-danger" 
                                                                        title="Delete User"
                                                                        data-testid={`delete-btn-${data._id}`}
                                                                    >
                                                                        <i className="bi bi-trash-fill"></i>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Footer Area */}
                            <div className="card-footer border-top bg-white py-3">
                                <div className="d-flex flex-wrap justify-content-between align-items-center">
                                    <div className="badge bg-primary p-2">
                                        <i className="bi bi-people-fill me-1"></i>
                                        Total Users: <span className="fw-bold">{getData.length}</span>
                                    </div>
                                    <div className="text-muted small">
                                        <i className="bi bi-clock-history me-1"></i>
                                        Last updated: {new Date().toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;