import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../layouts/Header';

const Manage = () => {
    const currentSkin = (localStorage.getItem('skin-mode')) ? 'dark' : '';
    const [skin, setSkin] = useState(currentSkin);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const baseurl = process.env.REACT_APP_API;
    const { USERID } = JSON.parse(localStorage.getItem('userData'));

    // State for sales data with today's date pre-filled
    const [salesData, setSalesData] = useState([]);
    const [newSale, setNewSale] = useState({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        USERID: USERID,
        StoreId: '',
        StoreName: '',
        StoreCategory: ''
    });
    const [editIndex, setEditIndex] = useState(null);

    // State for stores
    const [stores, setStores] = useState([]);
    const [options, setOptions] = useState([]);
    const [storeLoading, setStoreLoading] = useState(false);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // Fetch data from API on component mount
    useEffect(() => {
        fetchSalesData();
        fetchStores();
    }, []);

    // Update total pages when sales data or records per page changes
    useEffect(() => {
        setTotalPages(Math.ceil(salesData.length / recordsPerPage));
        // Reset to page 1 when changing records per page
        setCurrentPage(1);
    }, [salesData, recordsPerPage]);

    // Function to fetch stores for the user
    const fetchStores = async () => {
        setStoreLoading(true);
        try {
            // Fetch all stores for this user
            const res = await axios.post(baseurl + '/api/get-Store-names', { USERID });
            const StoreNames = res.data[0].StoreName;
            const formattedOptions = StoreNames.map((item) => ({
                value: item.StoreName,
                label: item.StoreName
            }));

            setOptions(formattedOptions);
            setStores(formattedOptions);
        } catch (err) {
            console.error('Error fetching stores:', err);
            setError('Failed to fetch store data');
        } finally {
            setStoreLoading(false);
        }
    };

    // Function to fetch sales data from API
    const fetchSalesData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Update the endpoint to include USERID
            const response = await axios.get(`${baseurl}/api/getsales/${USERID}`);
            setSalesData(response.data);
        } catch (err) {
            setError('Failed to fetch sales data');
            console.error('Error fetching sales data:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSale(prev => ({ ...prev, [name]: value }));
    };

    // Handle store selection
    const handleStoreChange = async (e) => {
        const selectedStoreName = e.target.value;
        if (!selectedStoreName) {
            // Reset store-related fields if no store is selected
            setNewSale(prev => ({
                ...prev,
                StoreId: '',
                StoreName: '',
                StoreCategory: ''
            }));
            return;
        }

        setNewSale(prev => ({
            ...prev,
            StoreName: selectedStoreName
        }));

        try {
            const response = await axios.post(baseurl + '/api/get-particular-Store-details', {
                USERID: USERID,
                StoreName: selectedStoreName
            });

            if (response.data && response.data.exist && response.data.exist[0] && response.data.exist[0].data && response.data.exist[0].data[0]) {
                const { StoreId, StoreCategory } = response.data.exist[0].data[0];
                setNewSale(prev => ({
                    ...prev,
                    StoreId: StoreId,
                    StoreCategory: StoreCategory
                }));
            }
        } catch (err) {
            console.error('Error fetching store details:', err);
            setError('Failed to fetch store details');
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate input
        if (!newSale.date || !newSale.amount || !newSale.StoreId || !newSale.StoreName) {
            alert('Please fill in all required fields including selecting a store');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Always include USERID in the data being sent
            const saleData = {
                ...newSale,
                USERID: USERID
            };

            if (editIndex !== null) {
                // Update existing record
                await axios.put(
                    `${baseurl}/api/putsales/${salesData[editIndex]._id}`,
                    saleData
                );
                fetchSalesData(); // Refresh data after update
                setEditIndex(null);
            } else {
                // Add new record
                await axios.post(`${baseurl}/api/postsales`, saleData);
                fetchSalesData(); // Refresh data after addition
            }

            // Reset form
            setNewSale({
                date: new Date().toISOString().split('T')[0],
                amount: '',
                USERID: USERID,
                StoreId: '',
                StoreName: '',
                StoreCategory: ''
            });
        } catch (err) {
            setError(editIndex !== null ? 'Failed to update record' : 'Failed to add record');
            console.error('Error saving data:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle edit button click
    const handleEdit = (index) => {
        // Calculate the actual index in the full dataset
        const actualIndex = (currentPage - 1) * recordsPerPage + index;
        setNewSale({
            date: salesData[actualIndex].date.split('T')[0], // Format date for input field
            amount: salesData[actualIndex].amount,
            USERID: USERID,
            StoreId: salesData[actualIndex].StoreId || '',
            StoreName: salesData[actualIndex].StoreName || '',
            StoreCategory: salesData[actualIndex].StoreCategory || ''
        });
        setEditIndex(actualIndex);
    };

    // Handle delete button click
    const handleDelete = async (index) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            // Calculate the actual index in the full dataset
            const actualIndex = (currentPage - 1) * recordsPerPage + index;
            setLoading(true);
            setError(null);
            try {
                // Include USERID in the delete request
                await axios.delete(`${baseurl}/api/deletesales/${salesData[actualIndex]._id}/${USERID}`);
                fetchSalesData(); // Refresh data after deletion
            } catch (err) {
                setError('Failed to delete record');
                console.error('Error deleting data:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    // Handle records per page change
    const handleRecordsPerPageChange = (e) => {
        setRecordsPerPage(parseInt(e.target.value));
    };

    // Pagination navigation
    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Get current records for pagination
    const getCurrentRecords = () => {
        const indexOfLastRecord = currentPage * recordsPerPage;
        const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
        return salesData.slice(indexOfFirstRecord, indexOfLastRecord);
    };

    // Generate pagination buttons
    const renderPaginationButtons = () => {
        const buttons = [];

        // Previous button
        buttons.push(
            <li key="prev" className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                    className="page-link"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    &laquo;
                </button>
            </li>
        );

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            buttons.push(
                <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => goToPage(i)}
                    >
                        {i}
                    </button>
                </li>
            );
        }

        // Next button
        buttons.push(
            <li key="next" className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                    className="page-link"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    &raquo;
                </button>
            </li>
        );

        return buttons;
    };

    const handleDownload = async (e) => {
        e.preventDefault();
        const csvContent = [
            ['Date', 'Store', 'Category', 'Amount (₹)'],
            ...salesData.map(sale => [
                new Date(sale.date).toLocaleDateString(),
                sale.StoreName || 'N/A',
                sale.StoreCategory || 'N/A',
                sale.amount
            ])
        ].map(e => e.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'sales_data.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <>
            <Header onSkin={setSkin} />
            <div className={`main main-app p-3 p-lg-4 ${skin === 'dark' ? 'bg-dark text-white' : 'bg-light'}`}>
                <div className="container">
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="d-flex justify-content-between align-items-center">
                                <h1 className="all_title mb-0">Store Analysis</h1>
                                <div className="card-header-action">
                                    <div className="dropdown">
                                        <button className={`btn ${skin === 'dark' ? 'btn-outline-light' : 'btn-outline-primary'} btn-sm`}
                                            onClick={(e) => handleDownload(e)}
                                        >
                                            <i className="fa fa-download me-1"></i> Export
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <div className={`card ${skin === 'dark' ? 'bg-dark-subtle border-dark' : 'bg-white'}`}>
                                <div className="card-header">
                                    <h5 className="card-title mb-0">{editIndex !== null ? 'Edit Sales Data' : 'Add Daily Sales'}</h5>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="date" className="form-label">Date</label>
                                            <input
                                                type="date"
                                                className={`form-control ${skin === 'dark' ? 'bg-dark-subtle border-dark text-white' : ''}`}
                                                id="date"
                                                name="date"
                                                value={newSale.date}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="StoreName" className="form-label">Store</label>
                                            {storeLoading ? (
                                                <div className="d-flex align-items-center">
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Loading stores...
                                                </div>
                                            ) : (
                                                <select
                                                    className={`form-select ${skin === 'dark' ? 'bg-dark-subtle border-dark text-white' : ''}`}
                                                    id="StoreName"
                                                    name="StoreName"
                                                    value={newSale.value}
                                                    onChange={handleStoreChange}
                                                    required
                                                >
                                                    <option value="">Select a store</option>
                                                    {stores.map((store, index) => (
                                                        <option key={index} value={store.value}>
                                                            {store.value}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="amount" className="form-label">Amount (₹)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className={`form-control ${skin === 'dark' ? 'bg-dark-subtle border-dark text-white' : ''}`}
                                                id="amount"
                                                name="amount"
                                                value={newSale.amount}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="d-grid">
                                            <button
                                                type="submit"
                                                className={`btn ${skin === 'dark' ? 'btn-light' : 'btn-primary'}`}
                                                disabled={loading || storeLoading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        {editIndex !== null ? 'Updating...' : 'Submitting...'}
                                                    </>
                                                ) : (
                                                    editIndex !== null ? 'Update' : 'Submit'
                                                )}
                                            </button>
                                            {editIndex !== null && (
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary mt-2"
                                                    onClick={() => {
                                                        setEditIndex(null);
                                                        setNewSale({
                                                            date: new Date().toISOString().split('T')[0],
                                                            amount: '',
                                                            USERID: USERID,
                                                            StoreId: '',
                                                            StoreName: '',
                                                            StoreCategory: ''
                                                        });
                                                    }}
                                                    disabled={loading}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-8">
                            <div className={`card ${skin === 'dark' ? 'bg-dark-subtle border-dark' : 'bg-white'}`}>
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5 className="card-title mb-0">Sales History</h5>
                                    <div className="d-flex align-items-center">
                                        <div className="me-3">
                                            <select
                                                className={`form-select form-select-sm ${skin === 'dark' ? 'bg-dark-subtle border-dark text-white' : ''}`}
                                                value={recordsPerPage}
                                                onChange={handleRecordsPerPageChange}
                                                aria-label="Records per page"
                                            >
                                                <option value="5">5 per page</option>
                                                <option value="10">10 per page</option>
                                                <option value="20">20 per page</option>
                                                <option value="50">50 per page</option>
                                            </select>
                                        </div>
                                        <span className="badge bg-primary">{salesData.length} Records</span>
                                    </div>
                                </div>
                                <div className="card-body">
                                    {loading && salesData.length === 0 ? (
                                        <div className="text-center py-4">
                                            <div className="spinner-border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <p className="mt-2">Loading sales data...</p>
                                        </div>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className={`table table-hover ${skin === 'dark' ? 'table-dark' : ''}`}>
                                                <thead>
                                                    <tr>
                                                        <th scope="col">#</th>
                                                        <th scope="col">Date</th>
                                                        <th scope="col">Store</th>
                                                        <th scope="col">Category</th>
                                                        <th scope="col">Amount (₹)</th>
                                                        <th scope="col" className="text-end">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {salesData.length > 0 ? (
                                                        getCurrentRecords().map((sale, index) => (
                                                            <tr key={sale._id || index}>
                                                                <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>
                                                                <td>{new Date(sale.date).toLocaleDateString()}</td>
                                                                <td>{sale.StoreName || 'N/A'}</td>
                                                                <td>{sale.StoreCategory || 'N/A'}</td>
                                                                <td>₹{parseFloat(sale.amount).toFixed(2)}</td>
                                                                <td className="text-end">
                                                                    <button
                                                                        className="btn btn-sm btn-outline-info me-2"
                                                                        onClick={() => handleEdit(index)}
                                                                        disabled={loading}
                                                                    >
                                                                        <i className="fa fa-edit"></i> Edit
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        onClick={() => handleDelete(index)}
                                                                        disabled={loading}
                                                                    >
                                                                        <i className="fa fa-trash"></i> Delete
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="6" className="text-center">No sales data available</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                                <div className="card-footer">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            {salesData.length > 0 && (
                                                <span>Total Sales: <strong>₹{salesData.reduce((total, sale) => total + parseFloat(sale.amount), 0).toFixed(2)}</strong></span>
                                            )}
                                        </div>

                                        <div className="d-flex align-items-center">
                                            {salesData.length > recordsPerPage && (
                                                <nav aria-label="Sales pagination" className="me-3">
                                                    <ul className="pagination pagination-sm mb-0">
                                                        {renderPaginationButtons()}
                                                    </ul>
                                                </nav>
                                            )}

                                            {salesData.length > 0 && (
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={async () => {
                                                        if (window.confirm('Are you sure you want to clear all data?')) {
                                                            setLoading(true);
                                                            try {
                                                                // Include USERID in the delete all request
                                                                await axios.delete(`${baseurl}/api/deleteallsales/${USERID}`);
                                                                fetchSalesData();
                                                            } catch (err) {
                                                                setError('Failed to clear all sales data');
                                                                console.error('Error clearing data:', err);
                                                            } finally {
                                                                setLoading(false);
                                                            }
                                                        }
                                                    }}
                                                    disabled={loading}
                                                >
                                                    Clear All
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Manage;