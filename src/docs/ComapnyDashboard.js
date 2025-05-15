import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Nav, ProgressBar, Table } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import Avatar from "../components/Avatar";
import { Link } from "react-router-dom";
import axios from 'axios';

import CountUp from 'react-countup';

import img6 from "../assets/img/img6.jpg";
import img7 from "../assets/img/img7.jpg";
import img8 from "../assets/img/img8.jpg";
import img9 from "../assets/img/img9.jpg";
import img10 from "../assets/img/img10.jpg";
import { get } from 'jquery';

const CompanyDashboard = () => {
    const baseurl = process.env.REACT_APP_API;
    const [cardDataCount, setCardDataCount] = useState({
        "storeCount": 0,
        "userCount": 0,
        "productCount": 0,
        "hotdealCount": 0
    });
    const [cardDataFiles, setCardDataFiles] = useState({
        "bannerCount": 0, "totalStoreImages": 0, "totalProductImages": 0, "totalImages": 0
    });
    const [revregchart, setRevRegChart] = useState({
        "dataBar": {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                backgroundColor: '#506fd9',
                barPercentage: 0.5,
                label: 'Revenue'
            }]
        }
    });
    const optionBar = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                display: true,  // Changed from false to true
                position: 'top',
                align: 'center',
                labels: {
                    color: '#313c47',
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 14
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 80,
                ticks: {
                    color: '#a1aab3',
                    font: {
                        size: 10
                    }
                },
                grid: {
                    borderColor: '#e2e5ec',
                    borderWidth: 1.5,
                    color: 'rgba(65,80,95,.08)'
                }
            },
            x: {
                ticks: {
                    color: '#313c47'
                },
                grid: {
                    color: 'rgba(65,80,95,.08)'
                }
            }
        }
    };
    const [ratingBar, setRatingBar] = useState([
        {
            "rate": "5.0",
            "star": ["fill", "fill", "fill", "fill", "fill"],
            "count": "4,230",
        },
        {
            "rate": "4.5",
            "star": ["fill", "fill", "fill", "fill", "half-fill"],
            "count": "4,230",
        },
        {
            "rate": "4.0",
            "star": ["fill", "fill", "fill", "fill", "line"],
            "count": "1,416",
        },
        {
            "rate": "3.5",
            "star": ["fill", "fill", "fill", "half-fill", "line"],
            "count": "4,230",
        },
        {
            "rate": "3.0",
            "star": ["fill", "fill", "fill", "line", "line"],
            "count": "980",
        },
        {
            "rate": "2.5",
            "star": ["fill", "fill", "half-fill", "line", "line"],
            "count": "4,230",
        },
        {
            "rate": "2.0",
            "star": ["fill", "fill", "line", "line", "line"],
            "count": "798",
        },
        {
            "rate": "1.5",
            "star": ["fill", "half-fill", "line", "line", "line"],
            "count": "4,230",
        },
        {
            "rate": "1.0",
            "star": ["fill", "line", "line", "line", "line"],
            "count": "401",
        }
    ]);
    const [averageRating, setAverageRating] = useState({
        "averageRating": 0,
        "star": ["line", "line", "line", "line", "line"]
    });



    const getCardData = async () => {
        await axios.get(baseurl + '/api/dash/AllCount')
            .then((res) => {
                setCardDataCount(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    const getFiles = async () => {
        await axios.get(baseurl + '/api/dash/getTotalImages')
            .then((res) => {
                setCardDataFiles(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    const getChartData = async () => {
        await axios.get(baseurl + '/api/dash/getRevReg')
            .then((res) => {
                let arr = [];
                res.data.revenue?.map((item, index) => {
                    arr.push(item.totalAmount / 100);
                })
                setRevRegChart({
                    "dataBar": {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                        datasets: [{
                            data: arr,
                            backgroundColor: '#506fd9',
                            barPercentage: 0.5,
                            label: 'Revenue'
                        }]
                    }
                });
            })
            .catch((err) => {
                console.error(err);
            });
    }

    const getRatings = async () => {
        axios.get(baseurl + '/api/dash/getRatings')
            .then((res) => {
                const updatedRatings = res.data.ratings.map((item, index) => {
                    // Create the base object
                    const ratingObj = {
                        ...ratingBar[10 - index - 2],
                        "count": item.count,
                    };
                    return ratingObj;
                });
                ratingBar.map((item, index) => {
                    if(item.rate === ''+res.data.averageRating) {
                        console.log(item.star);
                        setAverageRating({
                            'averageRating': res.data.averageRating,
                            'star': item.star
                        });
                    }
                })

                // setAverageRating({'averageRating':res.data.averageRating});

                updatedRatings.sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate));
                setRatingBar(updatedRatings);
            })
            .catch((err) => {
                console.error(err);
            });
    }


    useEffect(() => {
        getCardData();
        getFiles();
        getChartData();
        getRatings();
    }, [baseurl]);





    return (
        <>
            <Row className="g-3 mb-3">
                {/* Left side - 4 metric cards */}
                <Col xs="12" xl="6">
                    <Row className="g-3">
                        {[
                            {
                                "icon": "ri-shopping-bag-fill",
                                "value": `${cardDataCount?.storeCount}`,
                                "label": "Total Stores",
                            }, {
                                "icon": "ri-user-follow-fill",
                                "value": `${cardDataCount?.userCount}`,
                                "label": "Users Registered",
                            }, {
                                "icon": "ri-shopping-basket-fill",
                                "value": `${cardDataCount?.productCount}`,
                                "label": "Total Products",
                            }, {
                                "icon": "ri-fire-fill",
                                "value": `${cardDataCount?.hotdealCount}`,
                                "label": "Products On Deal",
                            }
                        ].map((item, index) => (
                            <Col xs="6" key={index}>
                                <Card className="card-one card-product">
                                    <Card.Body className="p-3">
                                        <div className="d-flex justify-content-between mb-3" style={{ paddingInline: '10px' }}>
                                            <div className="card-icon"><i className={item.icon}></i></div>
                                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                {/* <h2 className="card-value ls--1">{item.value}</h2> */}
                                                <h2 className="card-value ls--1">
                                                    <CountUp end={item.value} duration={3} />
                                                </h2>
                                            </div>
                                        </div>
                                        <div className='d-flex justify-content-center'>
                                            <label className="card-label fw-medium text-dark" style={{ fontSize: '18px' }}>{item.label}</label>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>

                {/* Right side - Two application cards */}
                <Col xs="12" xl="6">
                    <Row className="g-3">
                        {[
                            {
                                "icon": "ri-file-list-3-fill",
                                "value": `${cardDataFiles?.totalStoreImages}`,
                                "label": "Store Files",
                            }, {
                                "icon": "ri-file-text-fill",
                                "value": `${cardDataFiles?.totalProductImages}`,
                                "label": "Product Files",

                            }, {
                                "icon": "ri-article-fill",
                                "value": `${cardDataFiles?.totalImages}`,
                                "label": "Banner Files",
                            }, {
                                "icon": "ri-folder-fill",
                                "value": `${cardDataFiles?.totalImages}`,
                                "label": "Total Files",
                            }
                        ].map((item, index) => (
                            <Col xs="6" key={index}>
                                <Card className="card-one card-product">
                                    <Card.Body className="p-3">
                                        <div className="d-flex justify-content-between mb-3" style={{ paddingInline: '10px' }}>
                                            <div className="card-icon"><i className={item.icon}></i></div>
                                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                {/* <h2 className="card-value ls--1">{item.value}</h2> */}
                                                <h2 className="card-value ls--1">
                                                    <CountUp end={item.value} duration={3} />
                                                </h2>
                                            </div>
                                        </div>
                                        <div className='d-flex justify-content-center'>
                                            <label className="card-label fw-medium text-dark" style={{ fontSize: '18px' }}>{item.label}</label>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
            <Row className='g-3 mb-3'>
                <Col md="12" xl="12" sm="12">
                    <Card className="card-one">
                        <Card.Header>
                            <Card.Title as="h6">Revenue</Card.Title>
                            <Nav className="nav-icon nav-icon-sm ms-auto">
                                {/* <Nav.Link href=""><i className="ri-refresh-line"></i></Nav.Link> */}
                                {/* <Nav.Link href=""><i className="ri-more-2-fill"></i></Nav.Link> */}
                            </Nav>
                        </Card.Header>
                        <Card.Body>
                            <div className="chartjs-one">
                                <Bar data={revregchart?.dataBar} options={optionBar} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md="6" xl="4">
                    <Card className="card-one">
                        <Card.Header>
                            <Card.Title as="h6">Rating</Card.Title>
                            {/* <Nav className="nav-icon nav-icon-sm ms-auto">
                                <Nav.Link href=""><i className="ri-refresh-line"></i></Nav.Link>
                                <Nav.Link href=""><i className="ri-more-2-fill"></i></Nav.Link>
                            </Nav> */}
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex align-items-baseline gap-2 mb-0">
                                <h1 className="card-value fs-32 mb-0">{averageRating?.averageRating}</h1>
                                <div className="d-flex gap-1 text-primary fs-20">
                                    {averageRating?.star.map((star, i) => (
                                        <i key={i} className={"ri-star-" + star}></i>
                                    ))}
                                </div>
                            </div>
                            <p className="fs-sm">Measures the quality of your Store and User performance.</p>

                            <Table className="table table-ratings mb-0">
                                <tbody>
                                    {ratingBar?.map((item, index) => (
                                        <tr key={index}>
                                            <td><strong>{item.rate}</strong></td>
                                            <td>
                                                <div className="d-flex gap-1 text-primary fs-16">
                                                    {item.star.map((star, i) => (
                                                        <i key={i} className={"ri-star-" + star}></i>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>{item.count}</td>
                                            {/* <td>{item.percent}</td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md="6" xl="4">
                    <Card className="card-one">
                        <Card.Header>
                            <Card.Title as="h6">Recent Sellers</Card.Title>
                            <Nav className="nav-icon nav-icon-sm ms-auto">
                                <Nav.Link href="" className="nav-link"><i className="ri-refresh-line"></i></Nav.Link>
                                <Nav.Link href="" className="nav-link"><i className="ri-more-2-fill"></i></Nav.Link>
                            </Nav>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <ul className="people-group">
                                {[
                                    {
                                        "avatar": img6,
                                        "name": "Allan Rey Palban",
                                        "id": "00222"
                                    }, {
                                        "avatar": img7,
                                        "name": "Adrian Moniño",
                                        "id": "00221"
                                    }, {
                                        "avatar": img8,
                                        "name": "Charlene Plateros",
                                        "id": "00220"
                                    }, {
                                        "avatar": img9,
                                        "name": "Analyn Mercado",
                                        "id": "00219"
                                    }, {
                                        "avatar": img10,
                                        "name": "Rolando Paloso",
                                        "id": "00218"
                                    }
                                ].map((user, index) => (
                                    <li className="people-item" key={index}>
                                        <Avatar img={user.avatar} />
                                        <div className="people-body">
                                            <h6><Link to="">{user.name}</Link></h6>
                                            <span>Customer ID#{user.id}</span>
                                        </div>
                                        <Nav as="nav" className="nav-icon">
                                            <Nav.Link href=""><i className="ri-user-star-line"></i></Nav.Link>
                                            <Nav.Link href=""><i className="ri-contacts-line"></i></Nav.Link>
                                        </Nav>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                        <Card.Footer className="d-flex justify-content-center">
                            <Link href="" className="fs-sm">Manage Customers</Link>
                        </Card.Footer>
                    </Card>
                </Col>
                <Col md="6" xl="4">
                    <Card className="card-one">
                        <Card.Header>
                            <Card.Title as="h6">Transaction History</Card.Title>
                            <Nav className="nav-icon nav-icon-sm ms-auto">
                                <Nav.Link href=""><i className="ri-refresh-line"></i></Nav.Link>
                                <Nav.Link href=""><i className="ri-more-2-fill"></i></Nav.Link>
                            </Nav>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <ul className="people-group">
                                {[
                                    {
                                        "bg": "teal",
                                        "icon": "ri-shopping-cart-line",
                                        "label": "Purchase from #10322",
                                        "date": "Oct 21, 2023, 3:30pm",
                                        "value": "+ $250.00",
                                        "status": "Completed",
                                        "color": "success"
                                    }, {
                                        "bg": "info",
                                        "icon": "ri-coins-line",
                                        "label": "Process refund to #00910",
                                        "date": "Oct 19, 2023, 3:30pm",
                                        "value": "- $16.50",
                                        "status": "Processing",
                                        "color": "warning"
                                    }, {
                                        "bg": "primary",
                                        "icon": "ri-truck-line",
                                        "label": "Process delivery to #44333",
                                        "date": "Oct 18, 2023, 6:18pm",
                                        "value": "3 Items",
                                        "status": "For pickup",
                                        "color": "info"
                                    }, {
                                        "bg": "pink",
                                        "icon": "ri-truck-line",
                                        "label": "Payment from #023328",
                                        "date": "Oct 18, 2023, 12:40pm",
                                        "value": "+ $129.50",
                                        "status": "Completed",
                                        "color": "success"
                                    }, {
                                        "bg": "secondary",
                                        "icon": "ri-secure-payment-line",
                                        "label": "Payment failed #087651",
                                        "date": "Oct 15, 2023, 08:09am",
                                        "value": "$150.20",
                                        "status": "Declined",
                                        "color": "danger"
                                    }
                                ].map((item, index) => (
                                    <li className="people-item" key={index}>
                                        <div className="avatar">
                                            <span className={"avatar-initial fs-20 bg-" + item.bg}>
                                                <i className={item.icon}></i>
                                            </span>
                                        </div>
                                        <div className="people-body">
                                            <h6><Link to="">{item.label}</Link></h6>
                                            <span>{item.date}</span>
                                        </div>
                                        <div className="text-end">
                                            <div className="fs-sm">{item.value}</div>
                                            <span className={"d-block fs-xs text-" + item.color}>{item.status}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                        <Card.Footer className="d-flex justify-content-center">
                            <Link to="" className="fs-sm">Manage Transactions</Link>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default CompanyDashboard;