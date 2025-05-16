import React, { useState, useEffect } from 'react';
import Header from '../layouts/Header';
import './style.css';
import { Card, FormGroup } from 'react-bootstrap';
import { Toaster, toast } from 'react-hot-toast';

import axios from 'axios';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';


const Temples = () => {
    const currentSkin = (localStorage.getItem('skin-mode')) ? 'dark' : '';
    const [skin, setSkin] = useState(currentSkin);
    const baseurl = process.env.REACT_APP_API;
    const {USERID} = JSON.parse(localStorage.getItem('userData'));

    const [images, setImages] = useState([]);

    const [audios, setAudios] = useState([]);

    const [templeData, setTempleData] = useState({
        name: '',
        description: '',
        location: '',
        photos: [],
        audio: []
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTempleData({ ...templeData, [name]: value });
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const imageUrls = files.map(file => URL.createObjectURL(file));
        setImages(imageUrls);
        setTempleData({ ...templeData, photos: files });
    };

    const handleAudioChange = (e) => {
        const files = Array.from(e.target.files);
        const audioUrls = files.map(file => URL.createObjectURL(file));
        setAudios(audioUrls);
        setTempleData({ ...templeData, audio: files });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(templeData);
        if(templeData.name === '' || templeData.description === '' || templeData.location === '') {
            toast.error('Please fill all the fields', {
                duration: 5000
            });
            return;
        }
        if(templeData.photos.length === 0) {
            toast.error('Please upload at least one image', {
                duration: 5000
            });
            return;
        }
        const formData = new FormData();
        formData.append('name', templeData.name);
        formData.append('description', templeData.description);
        formData.append('location', templeData.location);
        formData.append('USERID', USERID);
        templeData.photos.forEach(photo => {
            formData.append('photos', photo);
        });
        if(templeData.audio.length > 0) {
            templeData.audio.forEach(audio => {
                formData.append('audio', audio);
            });
        }
        toast.promise(
            axios.post(baseurl + '/api/temple-register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((res) => {
                console.log(res.data);
                setTempleData({
                    name: '',
                    description: '',
                    location: '',
                    photos: [],
                    audio: []
                });
                setImages([]);
                setAudios([]);
            })
            .catch((err) => {
                console.error(err);
            }),
            {
                loading: 'Creating temple...',
                success: 'Temple created successfully!',
                error: 'Failed to create temple. Please try again.'
            }
        )
    }



    return (
        <>
            <Header onSkin={setSkin} />
            <Toaster />
            <div className="main main-app p-3 p-lg-4">
                <div className='temple_title'>
                    <h1>Temples</h1>
                </div>
                <div className='temple_title'>
                    <h3>यदा यदा हि धर्मस्य ग्लानिर्भवति भारत ।<br /> अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ।।<br/> परित्राणाय साधूनाम् विनाशाय च दुष्कृताम् ।<br /> धर्मसंस्थापनार्थाय सम्भवामि युगे युगे ।।</h3>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '1rem' }}>
                    {/* card and inside form */}
                    <Card className='temple_card'>
                        <Card.Body className='temple_card_body'>
                            <FormGroup>
                                <label htmlFor="templeName">Name of Temple<span style={{color: 'red'}}>*</span></label>
                                <input type="text" id="templeName" className="form-control" value={templeData.name}
                                placeholder="Enter temple name" name='name' onChange={(e) => handleInputChange(e)}/>
                            </FormGroup>
                            <FormGroup>
                                <label htmlFor="description">Temple Description<span style={{color: 'red'}}>*</span></label>
                                <textarea id="description" className="form-control" value={templeData.description} style={{height: '250px'}}
                                placeholder="Enter temple description" name='description' onChange={(e) => handleInputChange(e)}/>
                            </FormGroup>
                            <FormGroup>
                                <label htmlFor="location">Location (Link)<span style={{color: 'red'}}>*</span></label>
                                <input type="url" id="location" className="form-control" value={templeData.location}
                                placeholder="Enter location link" name='location' onChange={(e) => handleInputChange(e)}/>
                            </FormGroup>
                            <FormGroup>
                                <label htmlFor="photos">Photos<span style={{color: 'red'}}>*</span></label>
                                <input type="file" id="photos" className="form-control" multiple onChange={(e) => handleImageChange(e)} name='photos'/>
                            </FormGroup>
                            <FormGroup>
                                <label htmlFor="audio">Audio</label>
                                <input type="file" id="audio" className="form-control" accept="audio/*" multiple name='audio' onChange={(e) => handleAudioChange(e)}/>
                            </FormGroup>
                            <FormGroup>
                                <div className='temple_btn'>
                                    <button type="submit" className="btn btn-outline-primary" onClick={(e) => handleSubmit(e)}>Submit</button>
                                </div>
                            </FormGroup>
                        </Card.Body>
                    </Card>
                    <div>
                        <div className='temple_images' style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', width: '600px' }}>
                            <Swiper
                                modules={[Navigation, Pagination, Scrollbar, A11y]}
                                spaceBetween={50}
                                slidesPerView={1}
                                navigation
                                pagination={{ clickable: true }}
                                onSwiper={(swiper) => console.log(swiper)}
                                onSlideChange={() => console.log('slide change')}
                            >
                                {images.map((image, index) => (
                                    <SwiperSlide key={index}>
                                        <div style={{display: 'flex', justifyContent: 'center'}}>
                                            <img src={image} alt={`temple_image_${index}`} height={300} width={500} /></div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Temples