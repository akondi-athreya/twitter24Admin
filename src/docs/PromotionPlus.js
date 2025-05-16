import React from 'react'
import { useState } from 'react'
import Header from '../layouts/Header';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

const PromotionPlus = () => {
    const currentSkin = localStorage.getItem("skin-mode") ? "dark" : "";
    const [skin, setSkin] = useState(currentSkin);
    const baseurl = process.env.REACT_APP_API;
    const [storeId, setStoreId] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!storeId) {
            toast.error('Store ID is required');
            return;
        }
        const formData = new FormData();
        const fileField = document.querySelector('input[type="file"]');
        if (!fileField.files.length) {
            toast.error('Banner image is required');
            return;
        }
        formData.append('StoreId', storeId);
        formData.append('bannerImage', fileField.files[0]);
        for(var pair of formData.entries()) {
            console.log(pair[0]+ ', '+ pair[1]);
        }
        await axios.post(baseurl + '/api/upload-premium-plus-banner', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((res) => {
                console.log(res);
                if(res.data.message === 'Banner image uploaded successfully') {
                    toast.success("Banner Uploaded");
                    setStoreId('');
                    fileField.value = '';
                }
                else {
                    toast.error(res.data.message);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }


    return (
        <>
            <Header onSkin={setSkin} />
            <Toaster />
            <div className="main main-app p-3 p-lg-4">
                <div className='all_title'><h1>Premium +</h1></div>
                <div className="row d-flex justify-content-center">
                    <div className="col-12 col-lg-6">
                        <div className="card">
                            <div className="card-body mb-2">
                                <div className='mb-3'>
                                    <label>StoreId</label>
                                    <input
                                        type="text"
                                        className="form-control mt-2"
                                        placeholder="Enter Store ID"
                                        value={storeId}
                                        onChange={(e) => setStoreId(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="card-title">Upload Banner (Better to Upload 460 x 500)</label>
                                    <input type="file" className="form-control" accept="image/*" />
                                </div>
                            </div>
                            <div className="card-footer text-center p-3">
                                <button className="btn btn-primary" type="submit"
                                    onClick={(e) => handleSubmit(e)}
                                >Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PromotionPlus