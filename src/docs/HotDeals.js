import React from 'react'
import Header from '../layouts/Header';
import { useState,useEffect } from 'react';
import { Row, Button, Card, Carousel, Modal, Col, Form } from 'react-bootstrap';
import axios from 'axios';

const ActiveHotDeals = () => {
    const currentSkin = localStorage.getItem("skin-mode") ? "dark" : "";
	const [skin, setSkin] = useState(currentSkin);
    const [dealsData, setDealsData] = useState([]);
    const baseurl = process.env.REACT_APP_API;

    const {USERID} = JSON.parse(localStorage.getItem('userData')) || {};

    useEffect(() => {
        axios.get(baseurl + '/api/get-all-deals/'+USERID)
            .then((res) => {
                console.log(res)
                setDealsData(res.data);
            })
            .catch((err) => [
                console.error(err)
            ])
    }, []);

    return (
        <>
            <Header onSkin={setSkin} />
			<div className="main main-app p-3 p-lg-4">
                <div className='all_title'><h1>Active Hot Deals</h1></div>
                <div className='d-flex gap-5 flex-wrap'>
                    {dealsData.length > 0 ? dealsData.map((item, index) => (
                        <Card key={index} className='col-lg-3 p-3'>
                            <Carousel fade>
                                {item.productImages && item.productImages.length > 0 ? (
                                    item.productImages.map((image, imgIndex) => (
                                        <Carousel.Item key={imgIndex}>
                                            <Card.Img
                                                variant="top"
                                                src={`${baseurl}${image}`}
                                                alt={`Product Image ${imgIndex + 1}`}
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />
                                        </Carousel.Item>
                                    ))
                                ) : (
                                    <Carousel.Item>
                                        <Card.Img
                                            variant="top"
                                            src="https://via.placeholder.com/200" // Placeholder image
                                            alt="No Image Available"
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                    </Carousel.Item>
                                )}
                            </Carousel>
                            <Card.Body>
                                {item.onDiscount == true ? <div className="marker-icon top-left"><i className="ri-star-line"></i></div> : ""}
                                <Card.Title className="text-dark">{item.productName}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{item.productId}</Card.Subtitle>
                                <Card.Subtitle className="mb-2 text-muted">{item.productCategory}</Card.Subtitle>
                                <Card.Text>{item.productDescription}</Card.Text>
                                <Row className='justify-content-evenly gap-3'>
                                    {/* View Button */}
                                    {/* <Button variant="primary" onClick={() => handleShowViewModal(item)} className='col-lg-4 col-md-3 col-sm-3'>View</Button> */}
                                    {/* Edit Button */}
                                    {/* <Button variant="primary" onClick={() => handleShowEditModal(item)} className='col-lg-4 col-md-3 col-sm-3'>Edit</Button> */}
                                </Row>
                            </Card.Body>
                        </Card>
                    )) : <div className='datanotavailable'>No Discounts Were Available</div>}
                </div>
            </div>
        </>
    )
}

export default ActiveHotDeals