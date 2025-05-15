import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../layouts/Header';

const Followers = () => {
    const currentSkin = (localStorage.getItem('skin-mode')) ? 'dark' : '';
    const [skin, setSkin] = useState(currentSkin);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const baseurl = process.env.REACT_APP_API;
    const { USERID } = JSON.parse(localStorage.getItem('userData'));

    useEffect(() => {
        fetchStoresWithFollowers();
    }, []);

    const fetchStoresWithFollowers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(baseurl + '/api/stores/followers/' + USERID);
            setStores(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load followers data');
            setLoading(false);
            console.error('Error fetching followers:', err);
        }
    };

    return (
        <>
            <Header onSkin={setSkin} />
            <div className={`main main-app p-3 p-lg-4 ${skin === 'dark' ? 'bg-dark text-white' : 'bg-light'}`}>
                <div className="container-fluid">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <h2 className="mb-0">Store Followers</h2>
                        <span className="fs-5">Total Stores: {stores.length}</span>
                    </div>

                    {loading && <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>}

                    {error && <div className="alert alert-danger">{error}</div>}

                    {!loading && !error && (
                        <div className="row g-4">
                            {stores.map((store, index) => (
                                <div key={index} className="col-md-6 col-lg-4 col-xl-3">
                                    <div className={`card h-100 ${skin === 'dark' ? 'bg-dark-subtle border-dark' : ''}`}>
                                        <div className="card-header">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <h5 className="card-title mb-0">{store.storeName}</h5>
                                                <span className="badge bg-primary rounded-pill">{store.followersCount}</span>
                                            </div>
                                            <small className="text-muted">{store.storeCategory}</small>
                                        </div>
                                        <div className="card-body d-flex flex-column">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h6 className="mb-0">Followers</h6>
                                                {store.followers.length > 0 && (
                                                    <small className="text-muted">
                                                        Showing {Math.min(store.followers.length, 10)} of {store.followers.length}
                                                    </small>
                                                )}
                                            </div>

                                            {store.followers.length > 0 ? (
                                                <div className="overflow-auto" style={{ maxHeight: '200px' }}>
                                                    <div className="list-group list-group-flush">
                                                        {store.followers.map(follower => (
                                                            <div
                                                                key={follower.userId}
                                                                className={`list-group-item py-2 px-0 d-flex justify-content-between align-items-center ${skin === 'dark' ? 'bg-dark-subtle text-white border-dark' : 'bg-transparent'}`}
                                                            >
                                                                <span>
                                                                    <i className="bi bi-person-circle me-2"></i>
                                                                    {follower.username}
                                                                </span>
                                                                <small className="text-muted">
                                                                    {new Date(follower.followedAt).toLocaleDateString()}
                                                                </small>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-muted text-center">No followers yet</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {stores.length === 0 && (
                                <div className="col-12 text-center py-5">
                                    <i className="bi bi-shop opacity-50" style={{ fontSize: '3rem' }}></i>
                                    <p className="mt-3">No stores found</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Followers;