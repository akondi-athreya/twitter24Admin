import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../layouts/Header';
import { Toaster, toast } from 'react-hot-toast';

const ViewEmployee = () => {
    const currentSkin = (localStorage.getItem('skin-mode')) ? 'dark' : '';
    const [skin, setSkin] = useState(currentSkin);
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(null);
    const [editRole, setEditRole] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const baseurl = process.env.REACT_APP_API;

    // Get current user's ID from localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const currentUserId = userData.USERID || '';

    useEffect(() => {
        fetchEmployees();
    }, []);

    // Filter employees when search term or employees list changes
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredEmployees(employees);
        } else {
            const lowercasedSearch = searchTerm.toLowerCase();
            const filtered = employees.filter(employee =>
                employee.USERID.toLowerCase().includes(lowercasedSearch) ||
                (employee.name && employee.name.toLowerCase().includes(lowercasedSearch))
            );
            setFilteredEmployees(filtered);
        }
    }, [searchTerm, employees]);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const response = await axios.get(baseurl + '/api/employees/get-all-employees');
            setEmployees(response.data.employees);
            setFilteredEmployees(response.data.employees);
        } catch (error) {
            toast.error('Failed to fetch employees');
            console.error('Error fetching employees:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (employeeId, currentRole) => {
        setEditMode(employeeId);
        setEditRole(currentRole);
    };

    const handleCancelEdit = () => {
        setEditMode(null);
        setEditRole('');
    };

    const handleUpdate = async (employeeId) => {
        try {
            const response = await axios.put(baseurl + `/api/employees/update-employee/${employeeId}`, {
                role: editRole,
                updatedBy: currentUserId
            });

            if (response.data.success) {
                toast.success('Employee updated successfully');
                setEditMode(null);
                fetchEmployees();
            } else {
                toast.error(response.data.message || 'Update failed');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred');
            console.error('Error updating employee:', error);
        }
    };

    const handleDelete = async (employeeId) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                const response = await axios.delete(baseurl + `/api/employees/delete-employee/${employeeId}`);

                if (response.data.success) {
                    toast.success('Employee deleted successfully');
                    fetchEmployees();
                } else {
                    toast.error(response.data.message || 'Delete failed');
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'An error occurred');
                console.error('Error deleting employee:', error);
            }
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <>
            <Header onSkin={setSkin} />
            <div className={`main main-app p-3 p-lg-4 ${skin === 'dark' ? 'bg-dark text-white' : 'bg-light'}`}>
                <div className="container">
                    <div className='all_title'><h1>Employee List</h1></div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="d-flex gap-2 flex-grow-1 me-3">
                            <input
                                type="text"
                                className={`form-control ${skin === 'dark' ? 'bg-dark text-white' : ''}`}
                                placeholder="Search by name or user ID"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={fetchEmployees}
                            disabled={loading}
                        >
                            Refresh
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center my-5">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className={`table ${skin === 'dark' ? 'table-dark' : ''}`}>
                                <thead>
                                    <tr>
                                        <th>User ID</th>
                                        <th>Role</th>
                                        <th>Created By</th>
                                        <th>Created At</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEmployees.length > 0 ? (
                                        filteredEmployees.map((employee) => (
                                            <tr key={employee._id}>
                                                <td>{employee.USERID}</td>
                                                <td>
                                                    {editMode === employee._id ? (
                                                        <select
                                                            className={`form-select ${skin === 'dark' ? 'bg-dark text-white' : ''}`}
                                                            value={editRole}
                                                            onChange={(e) => setEditRole(e.target.value)}
                                                        >
                                                            <option value="employee">Employee</option>
                                                            <option value="manager">Manager</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                    ) : (
                                                        employee.role
                                                    )}
                                                </td>
                                                <td>{employee.createdBy}</td>
                                                <td>{new Date(employee.createdAt).toLocaleString()}</td>
                                                <td>
                                                    {editMode === employee._id ? (
                                                        <>
                                                            <button
                                                                className="btn btn-success btn-sm me-2"
                                                                onClick={() => handleUpdate(employee._id)}
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                className="btn btn-secondary btn-sm"
                                                                onClick={handleCancelEdit}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                className="btn btn-info btn-sm me-2"
                                                                onClick={() => handleEdit(employee._id, employee.role)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => handleDelete(employee._id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center">
                                                {searchTerm ? 'No matching employees found' : 'No employees found'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                <Toaster />
            </div>
        </>
    );
};

export default ViewEmployee;