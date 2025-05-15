/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import Header from '../layouts/Header';
import axios from 'axios';
import { useUser } from '../userContext';
import { Alert } from 'react-bootstrap';
import Sidebar from '../layouts/Sidebar';
import Footer from '../layouts/Footer';
import ComapnyDashboard from './ComapnyDashboard';
import UserDashBoard from './UserDash';

const NewHome = () => {
    const currentSkin = (localStorage.getItem('skin-mode')) ? 'dark' : '';
    const [skin, setSkin] = useState(currentSkin);
    const [banner, setBanner] = useState('');
    const [video, setVideo] = useState(false);
    const {USERID} = JSON.parse(localStorage.getItem("userData")) || {};
    const isEmployee = JSON.parse(localStorage.getItem("userIsEmployee"));

    const baseurl = process.env.REACT_APP_API;
    const [rej, setRej] = useState([]);

    useEffect(() => {
        axios.get(baseurl + '/api/imagePath')
            .then(response => {
                const imagePath = response.data.company.image;
                setBanner(imagePath);
                setVideo(imagePath.split('.').pop() === 'mp4' || imagePath.split('.').pop() === 'webm' || imagePath.split('.').pop() === 'ogg');
                console.log(imagePath);
            })
            .catch(error => {
                console.log(error);
            });

        axios.get(baseurl + '/api/anyRejections/' + USERID)
            .then((res) => {
                if(res.data.length === 0) {
                    return;
                }
                setRej(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [baseurl, USERID]);

    return (
        <>
            <Header onSkin={setSkin} />
            <Sidebar />
            <div className="main main-app p-3 p-lg-4">
                {(banner?.length > 0 || video?.length > 0) && 
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='mb-5'>
                    <div>
                        {video ? (
                            banner.length > 0 && (
                                <iframe
                                    width="800"
                                    height="400"
                                    src={`${baseurl}${banner}?autoplay=1&mute=1&loop=1&playlist=${banner}`}
                                    title="Company Announcements"
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                />
                            )
                        ) : (
                            <div className='d-flex justify-content-center align-items-center'>
                                <img src={`${baseurl}${banner}`} alt='Company Announcements' className='col-8' />
                            </div>

                        )}
                    </div>
                </div>}
                <div className='all_title'>
                    <h1>Welcome to Twitter24 | Admin</h1>
                </div>
                {isEmployee?.success != true && <div className='d-flex justify-content-center align-items-center mt-5 flex-column'>
                    {rej.length > 0 ? rej.map((item, index) => (
                        <Alert key={index} variant='danger' className='col-md-6 col-12'>
                            <p>{item.StoreId} has been Rejected Due to {item.RejectionReason}</p>
                        </Alert>
                    )) : <div className='datanotavailable'>No Store Has Been Rejected <span>😍</span></div>}
                </div>}
                {isEmployee?.success === true ? <ComapnyDashboard /> : <UserDashBoard />}
            </div>
        </>
    );
};

export default NewHome;