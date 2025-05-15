// filepath: /Users/athreya/Documents/React Native/official_projects/twitter24/admin/React/src/docs/Upgrade.js
import React from 'react'
import { useState, useEffect } from 'react';
import Header from '../layouts/Header';
import axios from 'axios';
import PaymentCard from '../components/PaymentCard';
import plans from '../data/Plans.json';
import './style.css';
import { Toaster, toast } from 'react-hot-toast';
import { Alert, Button } from 'react-bootstrap';
import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
import getUserPlan from '../config/getUserPlan';

const Upgrade = () => {
    const currentSkin = (localStorage.getItem('skin-mode')) ? 'dark' : '';
    const [skin, setSkin] = useState(currentSkin);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const userData = JSON.parse(localStorage.getItem('userData'));
    const baseurl = process.env.REACT_APP_API;
    const [refresh, setRefresh] = useState(false);
    const [boughtPlan, setBoughtPlan] = useState("");
    const [boughtAmount, setBoughtAmount] = useState(0);

    useEffect(() => {
        getUserPlan(userData.USERID);
        axios.get(baseurl + '/api/get_payment_history/' + userData.USERID)
            .then((res) => {
                console.log(res.data);
                if (res?.data?.length > 0) {
                    res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    setBoughtPlan(res.data[0].plan);
                    setBoughtAmount(res.data[0].amount / 100);
                }
                setPaymentHistory(res.data);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Failed to fetch payment history.")
            })
    }, [refresh]);

    const generateInvoice = (payment) => {
        const date1 = payment.createdAt.split('T')[0].split('-').reverse().join("-");
        const time1 = payment.createdAt.split('T')[1].split('.')[0];
        const hours = parseInt(time1.split(':')[0]);
        const minutes = time1.split(':')[1];
        const seconds = time1.split(':')[2];
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedTime = `${hours % 12 || 12}:${minutes}:${seconds} ${ampm}`;
        var dd = {
            content: [
            {
                text: "twitter24.",
                bold: true,
                style: 'subheader'
            },
            {
                text: 'INVOICE',
                style: 'header'
            },
            {
                text: [
                'Invoice Number: ',
                { text: payment.InvoiceId || '', bold: true }
                ]
            },
            {
                text: [
                'Date: ',
                { text: date1 + " " + formattedTime || '', bold: true }
                ]
            },
            {
                text: ' ' // Spacer
                },
                {
                    columns: [
                        {
                            width: '*',
                            text: [
                                { text: 'From:\n', style: 'subheader' },
                                'twitter24,\n',
                                'Sudha Colony Street no 520,\n',
                                'Peddapuram, 533437,\n',
                                'India.\n',
                                'Email: twitter24offical@gmail.com\n',
                            ]
                        },
                        {
                            width: '*',
                            text: [
                                { text: 'To:\n', style: 'subheader' },
                                `${userData.Fullname+',' || ''}\n`,
                                `${userData.Email+',' || ''}\n`,
                                `${userData.Contact+'.' || ''}\n`,
                            ]
                        }
                    ]
                },
                {
                    text: ' ' // Spacer
                },
                {
                    table: {
                        widths: ['*', 'auto', 'auto'],
                        body: [
                            [
                                { text: 'Plan', style: 'tableHeader', alignment: 'center' },
                                { text: 'Quantity', style: 'tableHeader', alignment: 'center' },
                                { text: 'Total', style: 'tableHeader', alignment: 'center' }
                            ],
                            [payment.plan || '', '1', '₹' + (payment.price / 100 || 0)],

                            [
                                { text: 'Total', colSpan: 2, alignment: 'center', bold: true },
                                {},
                                { text: '₹' + (payment.price || 0), bold: true }
                            ]
                        ]
                    }
                },
                {
                    text: ' ' // Spacer
                },
                {
                    text: 'Thank you for Subscribing to twitter24.',
                    style: 'quote'
                },
                {
                    text: 'CONTROL - CONNECT - COLLABORATE',
                    style: 'quote'
                },
                {
                    text: 'Have a Nice Day.',
                    style: 'quote'
                }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'center',
                    margin: [0, 0, 0, 10]
                },
                subheader: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 10, 0, 5]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 12,
                    color: 'black'
                },
                quote: {
                    italics: true,
                    alignment: 'center',
                    margin: [0, 10, 0, 0]
                }
            }
        };
        pdfMake.createPdf(dd).open();
        // pdfMake.createPdf(dd).download('invoice.pdf');
    }

    return (
        <>
            <Header onSkin={setSkin} />
            <Toaster />
            <div className="main main-app p-3 p-lg-4">
                <div className='all_title'>
                    <h1>Upgrade your account to access more features</h1>
                </div>
                <div className='card_parent'>
                    {plans.map((item, index) => (
                        <PaymentCard key={index} plan={item} setRefresh={setRefresh}
                            boughtPlan={boughtPlan} boughtAmount={boughtAmount} />
                    ))}
                </div>

                <hr style={{ marginTop: "50px", marginBottom: "30px" }} />

                <div>
                    <div className='all_title'>
                        <h1>
                            Payment History</h1>
                    </div>

                    <div className='cardsparent'>
                        {paymentHistory?.length > 0 ? paymentHistory.map((item, index) => (
                            <div className='col-12 col-md-5' key={index}
                                style={{ cursor: 'pointer', marginBottom: '20px' }}
                                onClick={() => generateInvoice(item)}
                            >
                                <Alert variant="success" style={{ padding: "15px" }}>
                                    <Alert.Heading className="fs-20" style={{ fontWeight: '900' }}>{item.createdAt.split('T')[0].split('-').reverse().join("-")}</Alert.Heading>
                                    <p>
                                        <b>{item.plan}</b> plan was subscribed on <b>{item.createdAt.split('T')[0].split('-').reverse().join("-")}</b>
                                        &nbsp;<b>{item.createdAt.split('T')[1].split('.')[0]}</b>
                                    </p>
                                    <p>
                                        Payment of <b>₹{item.amount / 100}</b> was made successfully.
                                    </p>
                                    <p>
                                        Payment Status: <b>{item.status}</b>
                                    </p>
                                    <p>
                                        Here is the InvoiceId: <b>{item.invoiceId}</b>
                                    </p>
                                    <hr />
                                    <p className="mb-0">
                                        Payment Id: <b>{item?.razorpay_payment_id}</b>
                                    </p>
                                    <p style={{ textDecoration: 'underline', textAlign: 'right' }}>
                                        Click to generate invoice
                                    </p>
                                </Alert>
                            </div>
                        )) : <p>No payment history found.</p>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Upgrade