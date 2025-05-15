import React from 'react';
import Header from '../layouts/Header';
import { useState, useEffect } from 'react';
import { toast, ToastContainer, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Card, Container, Nav, Offcanvas, Button, Row, Col, Pagination, Carousel } from "react-bootstrap";
import { useLoadingBar } from "react-top-loading-bar";
import { Form } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import './style.css'


const ApproveStore = () => {
    const baseurl = process.env.REACT_APP_API;
    const currentSkin = (localStorage.getItem('skin-mode')) ? 'dark' : '';
    const [skin, setSkin] = useState(currentSkin);
    const [cardData, setCards] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedStore, setSelectedStore] = useState('');
    const [reason, setReason] = useState('');
    const [refresh, setRefresh] = useState(false);
    const [formData, setFormData] = useState({
        StoreName: '',
        StoreCategory: '',
        StoreAddress: '',
        StoreLatitude: '',
        StoreLongitude: '',
        StoreOwnerName: '',
        StoreOwnerNumber: '',
        StoreOwnerEmail: '',
        StoreDescription: '',
        StoreBusinessTech: '',
        StoreTags: [], // Updated for consistency
        StoreEstablishedYear: '', // Updated for consistency
        StoreId: '',
    });


    const { start, complete } = useLoadingBar({
        color: '#F01846',
        height: 5,
        // loaderSpeed: 200,
        start: "static",
    });

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = (Store) => {
        setSelectedStore(Store);
        setFormData({
            StoreName: Store.StoreName,
            StoreCategory: Store.StoreCategory,
            StoreAddress: Store.StoreAddress,
            StoreLatitude: Store.StoreLatitude,
            StoreLongitude: Store.StoreLongitude,
            StoreOwnerName: Store.StoreOwnerName,
            StoreOwnerNumber: Store.StoreOwnerNumber,
            StoreId: Store.StoreId,
            _id: Store._id
        });
        setShow(true);
    }

    const ApproveThisStore = async () => {
        start();
        await axios.post(baseurl + '/api/approveThisStore', { StoreId: selectedStore.StoreId })
            .then((res) => {
                toast.success('Store ' + selectedStore.StoreId + ' has been approved', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Flip,
                });
                setRefresh(!refresh);
                setSelectedStore([]);
                handleClose();
                complete();
            })
            .catch((err) => {
                toast.error('Internal server Error', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Flip,
                });
                complete();
            })
    }

    useEffect(() => {
        axios.get(baseurl + '/api/getApprovals')
            .then((res) => {
                // console.log(res.data)
                setCards(res.data);
                setFilteredData(res.data);
            })
            .catch((err) => {
                console.error(err);
            })
    }, [refresh])

    const RejectThisStore = async () => {
        start();
        await axios.post(baseurl + '/api/rejectThisStore', { StoreId: selectedStore.StoreId, message: reason })
            .then((res) => {
                toast.success('Store ' + selectedStore.StoreId + ' has been Rejected for a Reason', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Flip,
                });
                setSelectedStore([]);
                handleClose();
                complete();
            })
            .catch((err) => {
                toast.error('Internal server Error', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Flip,
                });
                complete();
            })
    }

    const searchSomething = (e) => {
        const search = e.target.value.toLowerCase();
        const filteredData = cardData.filter((item) => {
            return item.StoreId.toLowerCase().includes(search) ||
                item.StoreCategory.toLowerCase().includes(search) ||
                item.StoreName.toLowerCase().includes(search) ||
                item.StoreOwnerName.toLowerCase().includes(search) ||
                item.USERID.toLowerCase().includes(search);
        });
        setFilteredData(filteredData);
    }

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 9;
    const pageCount = Math.ceil(filteredData.length / itemsPerPage);
    const offset = currentPage * itemsPerPage;
    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };
    const currentItems = filteredData.slice(offset, offset + itemsPerPage);



    return (
        <>
            <Header onSkin={setSkin} />
            <ToastContainer />
            <div className="main main-app p-3 p-lg-4">

                <div className='all_title'><h1>Approvals</h1></div>
                <div className='d-flex mb-3'>
                    <Card className='d-flex col-12 p-3 justify-content-between align-items-center'>
                        <div className="mb-3 col-lg-8">
                            <Form.Label htmlFor="exampleFormControlInput1">Search</Form.Label>
                            <Form.Control type="email" id="exampleFormControlInput1" placeholder="Id, Category, Name...."
                                onChange={searchSomething}
                            />
                        </div>
                    </Card>
                </div>

                <div className='d-flex flex-wrap gap-5'>
                    {cardData.length > 0 ? currentItems.map((item, index) => {
                        // const extension = item.imageType.split('/')[1] === "jpeg" ? "jpg" : item.imageType.split('/')[1];
                        return (
                            <Card className='col-lg-3' key={index}>
                                {/* <Card.Img src={`${baseurl}/${item.StoreImages[0]}`} alt='Store Image' variant="top" loading='lazy' /> */}
                                <Carousel fade>
                                    {item.StoreImages && item.StoreImages.length > 0 ? (
                                        item.StoreImages.map((image, imgIndex) => (
                                            <Carousel.Item key={imgIndex}>
                                                <Card.Img
                                                    variant="top"
                                                    src={`${baseurl}/${image}`}
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
                                    <Card.Title className="text-dark">Store ID: {item.StoreId}</Card.Title>
                                    <Card.Text>Store Name : {item.StoreName}</Card.Text>
                                    <Card.Text>User Id : {item.USERID}</Card.Text>
                                    <Row className='justify-content-center gap-3'>
                                        <Col className='d-flex justify-content-center'>
                                            <Button variant="primary" onClick={() => handleShow(item)}>Approve/view</Button>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                        );
                    }) : <div className='datanotavailable'>No Stores are Waiting ! <span className='insidespan'>😊</span></div>}
                </div>

                <div className='mt-5'>
                    <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        breakLabel={"..."}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination justify-content-center"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        previousClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                        activeClassName={"active"}
                    />
                </div>



                <Offcanvas show={show} onHide={handleClose} style={{ textAlign: 'justify' }}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Approve Store - {selectedStore.StoreId}</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <p><strong>Store Name:</strong> {selectedStore.StoreName}</p>
                        <p><strong>Store Category:</strong> {selectedStore.StoreCategory}</p>
                        <p><strong>Store Address:</strong> {selectedStore.StoreAddress}</p>
                        <p><strong>Store Latitude:</strong> {selectedStore.StoreLatitude}</p>
                        <p><strong>Store Longitude:</strong> {selectedStore.StoreLongitude}</p>
                        <p><strong>Store Location: </strong>
                            <a target='_blank' href={`https://www.google.com/maps?q=${selectedStore.StoreLatitude},${selectedStore.StoreLongitude}`}>
                                Open in Google maps
                            </a>
                        </p>
                        <p><strong>Owner Name:</strong> {selectedStore.StoreOwnerName}</p>
                        <p><strong>Owner Contact:</strong> {selectedStore.StoreOwnerNumber}</p>
                        <p><strong>Owner Gmail:</strong> {selectedStore.StoreOwnerEmail}</p>
                        <p><strong>Store ID:</strong> {selectedStore.StoreId}</p>

                        <Button onClick={ApproveThisStore}>Approve</Button> <br />
                        <div>
                            <Form>
                                <div style={{ marginTop: '20px' }}>
                                    <Form.Label htmlFor="exampleFormControlTextarea1"><strong>Reason for Rejection</strong></Form.Label>
                                    <Form.Control as="textarea" id="exampleFormControlTextarea1"
                                        rows="5" placeholder="Rejection Comments or Remarks..."
                                        onChange={(e) => { setReason(e.target.value); console.log(reason) }}
                                    ></Form.Control>
                                </div>
                                <Button onClick={RejectThisStore} variant='danger' style={{ marginTop: '20px' }}>Reject</Button>
                            </Form>
                        </div>


                    </Offcanvas.Body>
                </Offcanvas>
            </div>
        </>
    )
}

export default ApproveStore