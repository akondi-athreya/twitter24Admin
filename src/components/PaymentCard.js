// filepath: /Users/athreya/Documents/React Native/official_projects/twitter24/admin/React/src/components/PaymentCard.js
import React from 'react'
import { Card } from 'react-bootstrap'
import { Button } from '@mui/material';
import './style.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useUser } from '../userContext';
import toast, { Toaster } from 'react-hot-toast';
import { FaCheck } from "react-icons/fa6";
import { FaXmark } from "react-icons/fa6";

const PaymentCard = ({ plan, setRefresh, boughtPlan, boughtAmount }) => {
    const baseurl = process.env.REACT_APP_API;
    const [orderDetails, setOrderDetails] = useState([]);
    const {USERID} = JSON.parse(localStorage.getItem("userData")) || {};;

    const GetOrderDeatils = async (amount) => {
        toast.promise(
            axios.post(baseurl + '/api/generate-payment-order', { "amount": amount })
                .then((res) => {
                    console.log(res.data);
                    setOrderDetails(res.data);
                    MakePayment(res.data);
                })
                .catch((err) => {
                    console.error(err);
                    throw err;
                }),
            {
                loading: 'Creating order...',
                success: 'Order created successfully!',
                error: 'Failed to create order. Please try again.',
            }
        );
    }

    const dumpData = async (amount, razorpay_payment_id, orderId, USERID) => {
        await axios.post(baseurl + '/api/make_payment', {
            "amount": amount,
            "razorpay_payment_id": razorpay_payment_id,
            "orderId": orderId,
            "USERID": USERID,
            "status": "Success",
            "plan": plan.name
        })
            .then((res) => {
                console.log(res.data);
                setRefresh(prev => !prev);
            })
            .catch((err) => {
                console.error(err);
                toast.error("This didn't work.")
            })
    }

    const MakePayment = async (data) => {
        const options = {
            key: process.env.RAZORPAY_KEY_ID,
            amount: data.amount,
            currency: "INR",
            name: "twitter24",
            order_id: data.order_id,
            description: "Test Transaction",
            handler: (response) => {
                toast.promise(
                    new Promise((resolve, reject) => {
                        if (response.razorpay_payment_id) {
                            resolve(response);
                        } else {
                            reject(new Error('Payment failed'));
                        }
                    }),
                    {
                        loading: 'Processing payment...',
                        success: 'Payment successful!',
                        error: 'Payment failed. Please try again.',
                    }
                );
                console.log(response);
                dumpData(data.amount, response.razorpay_payment_id, data.order_id, USERID);
            },
            prefill: {
                name: "Athreya",
                email: "akondiathreya@gmail.com",
                contact: "9491728563"
            },
            notes: {
                address: "Razorpay Corporate Office",
            },
            theme: {
                color: "#3399cc",
            },
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    }

    return (
        <>
            <Toaster
                toastOptions={{
                    className: '',
                    style: {
                        padding: '16px',
                        color: '#713200',
                        fontSize: '16px',
                    },
                }}
            />
            {boughtPlan?.length > 0 ?
                <Card className='col-md-4 col-lg-4 col-xl-3' style={plan?.style}>
                    <Card.Body style={{ display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
                        <Card.Title className="text-dark" style={{ textAlign: 'center', fontSize: '30px' }}>{plan?.name}</Card.Title>
                        <Card.Text>
                            <ul>
                                {plan?.features.length > 0 ?
                                    plan?.features.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    )) : <></>}
                            </ul>
                        </Card.Text>
                        <Card.Text style={{ textAlign: 'end' }}>
                            <h4>₹{plan?.price}</h4>
                        </Card.Text>
                        <div style={{ display: 'flex', justifyContent: 'center', width: "100%" }}>
                            {plan?.name !== boughtPlan ? (
                                plan?.price < boughtAmount ?
                                    <Button variant='outlined' className='subscribe_btn noDownGrande'
                                        disabled >
                                        <FaXmark style={{ color: 'red', marginRight: '5px' }} />
                                        No DownGrade</Button>
                                    :
                                    <Button variant='outlined' className='subscribe_btn'
                                        onClick={() => GetOrderDeatils(plan.price)}>
                                        Upgrade</Button>
                            ) : (
                                <Button variant='contained' className='subscribe_btn_already' disabled
                                >
                                    <FaCheck style={{ color: 'green', marginRight: '5px' }} />
                                    Subscribed</Button>
                            )}
                        </div>
                    </Card.Body>
                </Card>

                : <Card className='col-md-4 col-lg-4 col-xl-3' style={plan?.style}>
                    <Card.Body style={{ display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
                        <Card.Title className="text-dark" style={{ textAlign: 'center', fontSize: '30px' }}>{plan?.name}</Card.Title>
                        <Card.Text>
                            <ul>
                                {plan?.features.length > 0 ?
                                    plan?.features.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    )) : <></>}
                            </ul>
                        </Card.Text>
                        <Card.Text style={{ textAlign: 'end' }}>
                            <h4>₹{plan?.price}</h4>
                        </Card.Text>
                        <div style={{ display: 'flex', justifyContent: 'center', width: "100%" }}>
                            <Button variant='outlined' className='subscribe_btn'
                                onClick={() => GetOrderDeatils(plan.price)}
                            >Subscribe</Button>
                        </div>
                    </Card.Body>
                </Card>}
        </>
    )
}

export default PaymentCard