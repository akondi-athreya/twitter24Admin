import React, { useState, useEffect } from 'react';
import { Tab, Nav } from 'react-bootstrap';
import Header from '../layouts/Header';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

const PreOrders = () => {
    const currentSkin = localStorage.getItem('skin-mode') ? 'dark' : '';
    const [skin, setSkin] = useState(currentSkin);
    const [loading, setLoading] = useState(true);
    const [stores, setStores] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [pendingOrders, setPendingOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [tempAmount, setTempAmount] = useState({});
    const baseurl = process.env.REACT_APP_API;

    // Fetch stores and preorder data on component mount
    useEffect(() => {
        // fetchStores();
        // fetchPreOrders();
    }, []);

    const fetchStores = async () => {
        try {
            setLoading(true);
            const response = await axios.get(baseurl+'/api/owner/stores');
            setStores(response.data);

            // Initialize tempAmount with current preorder amounts
            const initialAmounts = {};
            response.data.forEach(store => {
                initialAmounts[store._id] = store.preOrderAmount || '';
            });
            setTempAmount(initialAmounts);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching stores:', error);
            toast.error('Failed to load stores');
            setLoading(false);
        }
    };

    const fetchPreOrders = async () => {
        try {
            const [pendingRes, completedRes] = await Promise.all([
                axios.get(baseurl+'/api/owner/preorders/pending'),
                axios.get(baseurl+'/api/owner/preorders/completed')
            ]);

            setPendingOrders(pendingRes.data);
            setCompletedOrders(completedRes.data);
        } catch (error) {
            console.error('Error fetching preorders:', error);
            toast.error('Failed to load preorder data');
        }
    };

    const handleTogglePreOrder = async (storeId, enabled) => {
        // If trying to enable preorders but no amount is set, prevent toggle
        if (enabled && (!tempAmount[storeId] || tempAmount[storeId] <= 0)) {
            toast.warning('Please enter a valid preorder amount first');
            return false;
        }

        try {
            await axios.post(baseurl+'/api/owner/preorders/toggle', {
                storeId,
                enabled,
                amount: tempAmount[storeId]
            });

            // Update local state to reflect changes
            setStores(stores.map(store =>
                store._id === storeId ?
                    { ...store, preOrderEnabled: enabled, preOrderAmount: tempAmount[storeId] } :
                    store
            ));

            toast.success(`Preorders ${enabled ? 'enabled' : 'disabled'} successfully`);
            return true;
        } catch (error) {
            console.error('Error toggling preorder status:', error);
            toast.error('Failed to update preorder status');
            return false;
        }
    };

    const handleAmountChange = (storeId, value) => {
        setTempAmount({
            ...tempAmount,
            [storeId]: value
        });
    };

    const handleSaveAmount = async (storeId) => {
        if (!tempAmount[storeId] || tempAmount[storeId] <= 0) {
            toast.warning('Please enter a valid amount');
            return;
        }

        try {
            await axios.post(baseurl+'/api/owner/preorders/update-amount', {
                storeId,
                amount: tempAmount[storeId]
            });

            // Update local state
            setStores(stores.map(store =>
                store._id === storeId ?
                    { ...store, preOrderAmount: tempAmount[storeId] } :
                    store
            ));

            toast.success('Preorder amount updated successfully');
        } catch (error) {
            console.error('Error updating preorder amount:', error);
            toast.error('Failed to update preorder amount');
        }
    };

    const completeOrder = async (orderId) => {
        try {
            await axios.post(baseurl+'/api/owner/preorders/complete', { orderId });

            // Move the order from pending to completed
            const completedOrder = pendingOrders.find(order => order._id === orderId);

            setPendingOrders(pendingOrders.filter(order => order._id !== orderId));
            setCompletedOrders([completedOrder, ...completedOrders]);

            toast.success('Order marked as completed');
        } catch (error) {
            console.error('Error completing order:', error);
            toast.error('Failed to complete order');
        }
    };

    const generateInvoice = async (orderId) => {
        try {
            setLoading(true);
            await axios.post(baseurl+'/api/owner/preorders/generate-invoice', { orderId });
            toast.success('Invoice generated and sent to emails');
            setLoading(false);
        } catch (error) {
            console.error('Error generating invoice:', error);
            toast.error('Failed to generate invoice');
            setLoading(false);
        }
    };

    return (
        <>
            <Header onSkin={setSkin} />
            <div className="main main-app p-3 p-lg-4">
                <div className="all_title mb-4">
                    <h1>Pre-Orders & Pre-Bookings</h1>
                </div>

                <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                    <Nav variant="tabs" className="nav-tabs-for-dark mb-4">
                        <Nav.Item>
                            <Nav.Link eventKey="dashboard">Dashboard</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="settings">On & Off Settings</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="history">History</Nav.Link>
                        </Nav.Item>
                    </Nav>

                    <Tab.Content>
                        <Tab.Pane eventKey="dashboard">
                            {loading ? (
                                <LoadingSpinner />
                            ) : (
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="card-title">Active Preorders</h5>
                                    </div>
                                    <div className="card-body">
                                        {pendingOrders.length === 0 ? (
                                            <p className="text-muted">No active preorders at the moment.</p>
                                        ) : (
                                            <div className="table-responsive">
                                                <table className="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th>Order ID</th>
                                                            <th>Store</th>
                                                            <th>Customer</th>
                                                            <th>Amount</th>
                                                            <th>Date</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {pendingOrders.map(order => (
                                                            <tr key={order._id}>
                                                                <td>#{order.orderNumber}</td>
                                                                <td>{order.storeName}</td>
                                                                <td>{order.customerName}</td>
                                                                <td>₹{order.amount}</td>
                                                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                                <td>
                                                                    <button
                                                                        className="btn btn-sm btn-primary me-2"
                                                                        onClick={() => completeOrder(order._id)}
                                                                    >
                                                                        Complete
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-secondary"
                                                                        onClick={() => generateInvoice(order._id)}
                                                                    >
                                                                        Generate Invoice
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </Tab.Pane>

                        <Tab.Pane eventKey="settings">
                            {loading ? (
                                <LoadingSpinner />
                            ) : (
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="card-title">Preorder Settings</h5>
                                    </div>
                                    <div className="card-body">
                                        {stores.length === 0 ? (
                                            <p className="text-muted">No stores found.</p>
                                        ) : (
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>Store Name</th>
                                                            <th>Preorder Status</th>
                                                            <th>Amount (₹)</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {stores.map(store => (
                                                            <tr key={store._id}>
                                                                <td>{store.name}</td>
                                                                <td>
                                                                    <div className="form-check form-switch">
                                                                        <input
                                                                            className="form-check-input"
                                                                            type="checkbox"
                                                                            checked={store.preOrderEnabled || false}
                                                                            onChange={(e) => {
                                                                                handleTogglePreOrder(store._id, e.target.checked);
                                                                            }}
                                                                        />
                                                                        <label className="form-check-label">
                                                                            {store.preOrderEnabled ? 'Enabled' : 'Disabled'}
                                                                        </label>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="input-group">
                                                                        <span className="input-group-text">₹</span>
                                                                        <input
                                                                            type="number"
                                                                            className="form-control"
                                                                            placeholder="Amount"
                                                                            value={tempAmount[store._id] || ''}
                                                                            onChange={(e) => handleAmountChange(store._id, e.target.value)}
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        className="btn btn-primary btn-sm"
                                                                        onClick={() => handleSaveAmount(store._id)}
                                                                    >
                                                                        Save
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </Tab.Pane>

                        <Tab.Pane eventKey="history">
                            {loading ? (
                                <LoadingSpinner />
                            ) : (
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="card-title">Completed Preorders</h5>
                                    </div>
                                    <div className="card-body">
                                        {completedOrders.length === 0 ? (
                                            <p className="text-muted">No completed preorders found.</p>
                                        ) : (
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>Order ID</th>
                                                            <th>Store</th>
                                                            <th>Customer</th>
                                                            <th>Amount</th>
                                                            <th>Ordered Date</th>
                                                            <th>Completed Date</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {completedOrders.map(order => (
                                                            <tr key={order._id}>
                                                                <td>#{order.orderNumber}</td>
                                                                <td>{order.storeName}</td>
                                                                <td>{order.customerName}</td>
                                                                <td>₹{order.amount}</td>
                                                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                                <td>{new Date(order.completedAt).toLocaleDateString()}</td>
                                                                <td>
                                                                    <button
                                                                        className="btn btn-sm btn-secondary"
                                                                        onClick={() => generateInvoice(order._id)}
                                                                    >
                                                                        Generate Invoice
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </div>
        </>
    );
};

export default PreOrders;