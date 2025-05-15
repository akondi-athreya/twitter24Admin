import React from 'react';
import Header from '../layouts/Header';
import { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import axios from 'axios';
import { useUser } from '../userContext';
import Footer from '../layouts/Footer';

const Reviews = () => {
    const currentSkin = (localStorage.getItem('skin-mode')) ? 'dark' : '';
    const [skin, setSkin] = useState(currentSkin);
    const baseurl = process.env.REACT_APP_API;
    const { USERID } = JSON.parse(localStorage.getItem("userData")) || {};;
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get(baseurl + '/api/get-reviews-owner/' + USERID)
            .then((res) => {
                setData(res.data.reviews);
                console.log(res.data.reviews);
            })
            .catch((err) => {
                console.error(err);
            })
    }, [baseurl, USERID]);

    return (
        <>
            <Header onSkin={setSkin} />
            <div className="main main-app p-3 p-lg-4">
                <div className='all_title'>
                    <h1>Reviews</h1>
                </div>
                <div className='d-flex flex-wrap gap-3'>
                    {data.length > 0 ? data.map((item, index) => {
                        let cardClass = 'card-secondary';
                        if (item.rating < 2) {
                            cardClass = 'card-danger';
                        } else if (item.rating >= 3.5) {
                            cardClass = 'card-success';
                        }

                        return (
                            <Card className={`col-md-2 col-12 col-sm-6 ${cardClass}`} key={index}>
                                <Card.Header>{item.Username}</Card.Header>
                                <Card.Body>
                                    <Card.Text><strong>StoreId : </strong>{item.StoreId}</Card.Text>
                                    <Card.Text><strong>Rating : </strong>{item.rating}</Card.Text>
                                    <Card.Text><strong>Review : </strong>{item.review}</Card.Text>
                                </Card.Body>
                            </Card>
                        )
                    }) : <div className='datanotavailable'><span className='insidespan'>🗒️</span> Waiting For Your First Review to be Noted !</div>}
                </div>

            </div>
        </>
    )
}

export default Reviews;