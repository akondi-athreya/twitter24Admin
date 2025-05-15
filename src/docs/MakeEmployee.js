import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../layouts/Header';
import { Toaster, toast } from 'react-hot-toast';

const MakeEmployee = () => {
    const currentSkin = (localStorage.getItem('skin-mode')) ? 'dark' : '';
    const [skin, setSkin] = useState(currentSkin);
    const [nowuser, setUserId] = useState('');
    const [role, setRole] = useState('employee');
    const [loading, setLoading] = useState(false);
    const baseurl = process.env.REACT_APP_API;

    // Get current user's ID from localStorage
    const {USERID} = JSON.parse(localStorage.getItem('userData'));

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nowuser.trim()) {
            toast.error('Please enter a User ID');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(baseurl+'/api/employees/make-an-employee', {
                USERID: nowuser,
                role: role,
                createdBy: USERID
            });

            if (response.data.success) {
                toast.success('Employee created successfully!');
                setUserId('');
            } else {
                toast.error(response.data.message || 'Failed to create employee');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred');
            console.error('Error creating employee:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header onSkin={setSkin} />
            <div className={`main main-app p-3 p-lg-4 ${skin === 'dark' ? 'bg-dark text-white' : 'bg-light'}`}>
                <div className="container">
                    <div className='all_title'><h1 className="mb-4">Create New Employee</h1></div>

                    <div className="card col-md-6 d-flex justify-content-center mx-auto">
                        <div className={`card-body ${skin === 'dark' ? 'bg-dark' : ''}`}>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="nowuser" className="form-label">User ID</label>
                                    <input
                                        type="text"
                                        className={`form-control ${skin === 'dark' ? 'bg-dark text-white' : ''}`}
                                        id="nowuser"
                                        value={nowuser}
                                        onChange={(e) => setUserId(e.target.value)}
                                        placeholder="Enter user ID"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="role" className="form-label">Role</label>
                                    <select
                                        className={`form-select ${skin === 'dark' ? 'bg-dark text-white' : ''}`}
                                        id="role"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option value="employee">Employee</option>
                                        <option value="manager">Manager</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Creating...' : 'Create Employee'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <Toaster />
            </div>
        </>
    );
};

export default MakeEmployee;