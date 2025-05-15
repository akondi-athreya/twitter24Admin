/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect } from 'react';
import Header from '../layouts/Header';
import { useState } from 'react';
import { Card, Button, Row, Modal, Carousel, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Col, Form } from 'react-bootstrap';
import Select from "react-select";
import { toast, ToastContainer, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useUser } from '../userContext';
import ReactPaginate from 'react-paginate';
import { ReactComponent as Logo } from "../assets/svg/allow.svg";
import { CiLocationOn } from "react-icons/ci";
import { Link } from 'react-router-dom';
import Footer from '../layouts/Footer';

const MyStores = () => {
    const currentSkin = (localStorage.getItem('skin-mode')) ? 'dark' : '';
    const [skin, setSkin] = useState(currentSkin);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [validated, setValidated] = useState(false);
    const [StoreData, setStoreData] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null);
    const { USERID } = JSON.parse(localStorage.getItem("userData")) || {};;
    const [deleteStore, setDeleteStore] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
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
        StorePincode: ''
    });

    const selectOptions = [
        { value: 'grocery', label: 'Grocery' },
        { value: 'medical', label: 'Medical' },
        { value: 'fruits', label: 'Fruits' },
        { value: 'vegetables', label: 'Vegetables' },
        { value: 'clothes', label: 'Clothes' },
        { value: 'electronics', label: 'Electronics' },
        { value: 'books', label: 'Books' },
        { value: 'stationery', label: 'Stationery' },
        { value: 'furniture', label: 'Furniture' },
        { value: 'footwear', label: 'Footwear' },
        { value: 'cosmetics', label: 'Cosmetics' },
        { value: 'jewelry', label: 'Jewelry' },
        { value: 'sports', label: 'Sports' },
        { value: 'toys', label: 'Toys' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleCategoryChange = (selectedOption) => {
        setFormData({
            ...formData,
            StoreCategory: selectedOption.value ? selectedOption.value : ''
        });
    };

    const baseurl = process.env.REACT_APP_API;
    useEffect(() => {
        axios.get(`${baseurl}/api/get-Stores/${USERID}`)
            .then((res) => {
                setStoreData(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.error(err);
                toast.error('Error Getting Details!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                    transition: Flip,
                });
            });
    }, [refresh]);

    const handleShowViewModal = (Store) => {
        setSelectedStore(Store);
        setShowViewModal(true);
    };

    const handleShowEditModal = (Store) => {
        setSelectedStore(Store);
        setFormData({
            StoreName: Store.StoreName,
            StoreCategory: Store.StoreCategory,
            StoreAddress: Store.StoreAddress,
            StoreLatitude: Store.StoreLatitude,
            StoreLongitude: Store.StoreLongitude,
            StoreOwnerName: Store.StoreOwnerName,
            StoreOwnerNumber: Store.StoreOwnerNumber,
            StoreOwnerEmail: Store.StoreOwnerEmail,
            StoreId: Store.StoreId,
            StoreEstablishedYear: Store.StoreEstablishedYear,
            _id: Store._id,
            StorePincode: Store.StorePincode
        });
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => setShowEditModal(false);
    const handleCloseViewModal = () => setShowViewModal(false);
    const handelCloseDeleteModal = () => setShowDeleteModal(false);


    const SaveData = async () => {
        try {
            const images = document.getElementById('newImagesInModel')?.files;

            // Validate if images are provided
            if (images && images.length > 0) {
                toast.error("Please select images to upload!", { /* Toast options */ });
                return;
            }

            // Create a FormData object
            const formDataToSend = new FormData();
            formDataToSend.append('USERID', USERID);
            formDataToSend.append('data', JSON.stringify(formData)); // Append form data as JSON

            // Append images
            Array.from(images).forEach((image) => {
                formDataToSend.append('images', image);
            });

            console.log("FormData Content:");
            for (let [key, value] of formDataToSend.entries()) {
                console.log(`${key}:`, value);
            }

            // Axios POST request
            const response = await axios.post(`${baseurl}/api/edit-Store-data`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Store Updated Successfully', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
                transition: Flip,
            });
            handleCloseEditModal();
            setRefresh((prev) => !prev);

        } catch (err) {
            console.error("Error saving data:", err);
            toast.error('Error Updating Store!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
                transition: Flip,
            });
        }
    };

    const DeleteMyStore = (item) => {
        setDeleteStore(item);
        setShowDeleteModal(true);
    }

    const DelteThisStore = async () => {
        axios.post(baseurl + '/api/deleteThisStore', { USERID: USERID, data: deleteStore })
            .then((res) => {
                toast('Store Deleted Successfully', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Flip,
                });
                setDeleteStore();
                handelCloseDeleteModal();
                setRefresh((prev) => !prev);
            })
            .catch((err) => {
                console.error(err);
                toast.error('Error Delting Store!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                    transition: Flip,
                });
            })
    }

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 9;
    const pageCount = Math.ceil(StoreData.length / itemsPerPage);
    const offset = currentPage * itemsPerPage;
    const handlePageClick = (event) => {
        setCurrentPage(event.selected); // Updates currentPage based on the selected page
    };
    const currentItems = StoreData.slice(offset, offset + itemsPerPage);

    const handleDeleteImage = async (name) => {
        console.log(name);
        await axios.post(`${baseurl}/api/deleteStoreImage`, { USERID: USERID, StoreId: formData.StoreId, image: name })
            .then((res) => {
                toast.success('Image Deleted Successfully', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                    transition: Flip,
                });
                setRefresh((prev) => !prev);
                // handleCloseEditModal();
                window.location.reload();
            })
            .catch((err) => {
                console.error(err);
                toast.error('Error Deleting Image!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                    transition: Flip,
                });
            });
    }

    // const getLocation = () => {
    //     const successCallback = (position) => {
    //         console.log('User Position:', position);
    //     };
    //     const errorCallback = (error) => {
    //         console.error('Error fetching location:', error);
    //     };
    //     navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    // };

    return (
        <>
            <Header onSkin={setSkin} />
            <ToastContainer />
            <div className="main main-app p-3 p-lg-4">
                {/* <div>
                    <button onClick={getLocation}>Get Location</button>
                </div> */}
                <div className='all_title'>
                    <h1>My Stores</h1>
                </div>

                <div className='d-flex flex-wrap gap-5'>
                    {/* Card for displaying Stores */}
                    {StoreData.length > 0 ? currentItems.map((item, index) => {
                        // const extension = item.imageType.split('/')[1] === "jpeg" ? "jpg" : item.imageType.split('/')[1];
                        return (
                            <Card className='col-lg-3 col-12 col-md-8' key={index}>
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
                                    <Card.Text>Store Name: {item.StoreName}</Card.Text>
                                    <Row className='justify-content-evenly gap-3'>
                                        {/* View Button */}
                                        <Button variant="primary" onClick={() => handleShowViewModal(item)} className='col-lg-4 col-md-3 col-sm-3'>View</Button>
                                        {/* Edit Button */}
                                        <Button variant="info" onClick={() => handleShowEditModal(item)} className='col-lg-4 col-md-3 col-sm-3'>Edit</Button>
                                        {/* Delete Button */}
                                        <Button variant="danger" onClick={() => DeleteMyStore(item)} className='col-lg-4 col-md-3 col-sm-3'>Delete</Button>
                                    </Row>
                                </Card.Body>
                            </Card>
                        );
                    }) : <div className='datanotavailable'>Please Register Your First Store by clicking <Link to='/admin/StoreRegister'>here</Link> ! <span className='insidespan'>✌🏻</span></div>}
                </div>

                {StoreData.length > 0 && <div className='mt-5'>
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
                </div>}
                <Footer />

            </div>

            {/* Modal for viewing Store details */}
            <Modal show={showViewModal} onHide={handleCloseViewModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Store Details - {selectedStore?.StoreId}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedStore && (
                        <>
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
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseViewModal}>Close</Button>
                </Modal.Footer>
            </Modal>



            <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Store</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="edit-Store-form">
                        <Row>
                            <Col className='col-md-6'>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Store Name</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Enter Store Name"
                                        name="StoreName"
                                        value={formData.StoreName}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col className='col-md-6'>
                                <Form.Group className="mb-3" controlId="formBasicCategory">
                                    <Form.Label>Category</Form.Label>
                                    <Select
                                        defaultValue={formData.StoreCategory ? selectOptions.find(option => option.value === formData.StoreCategory) : null}
                                        options={selectOptions}
                                        onChange={handleCategoryChange}
                                        placeholder="Select Store Category"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row >
                            <Col className='col-md-12'>
                                <Form.Group className="mb-3" controlId="formBasicAddress">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Enter Store Address"
                                        name="StoreAddress"
                                        value={formData.StoreAddress}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row style={{ display: "flex", justifyContent: "space-between" }}>
                            <Col className='col-md-5'>
                                <Form.Group className="mb-3" controlId="formBasicLatitude">
                                    <Form.Label>Latitude</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Enter Store Latitude"
                                        name="StoreLatitude" disabled
                                        value={formData.StoreLatitude}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col className='col-md-1'>
                                <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip id="button-tooltip">Click to update the store location</Tooltip>}
                                >
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            navigator.geolocation.getCurrentPosition((position) => {
                                                setFormData({
                                                    ...formData,
                                                    StoreLatitude: position.coords.latitude,
                                                    StoreLongitude: position.coords.longitude
                                                });
                                            });
                                        }}
                                        style={{ marginTop: '30px', padding: '5px' }}
                                    >
                                        <CiLocationOn size={25} />
                                    </Button>
                                </OverlayTrigger>
                            </Col>
                            <Col className='col-md-5'>
                                <Form.Group className="mb-3" controlId="formBasicLongitude">
                                    <Form.Label>Longitude</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Enter Store Longitude"
                                        name="StoreLongitude" disabled
                                        value={formData.StoreLongitude}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='col-md-6'>
                                <Form.Group className="mb-3" controlId="formBasicOwnerName">
                                    <Form.Label>Owner Name</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Enter Owner Name"
                                        name="StoreOwnerName"
                                        value={formData.StoreOwnerName}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>

                            <Col className='col-md-6'>
                                <Form.Group className="mb-3" controlId="formBasicOwnerNumber">
                                    <Form.Label>Owner Contact</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Enter Owner Contact"
                                        name="StoreOwnerNumber"
                                        value={formData.StoreOwnerNumber}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='col-md-6'>
                                <Form.Group className="mb-3" controlId="formBasicOwnerEmail">
                                    <Form.Label>Owner Email</Form.Label>
                                    <Form.Control
                                        required
                                        type="email"
                                        placeholder="Enter Owner Email"
                                        name="StoreOwnerEmail"
                                        value={formData.StoreOwnerEmail}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col className='col-md-6'>
                                <Form.Group className="mb-3" controlId="formBasicEstablishedYear">
                                    <Form.Label>Established Year</Form.Label>
                                    <Form.Control
                                        required
                                        type="month"
                                        placeholder="Enter Store Established Year"
                                        name="StoreEstablishedYear"
                                        value={formData.StoreEstablishedYear}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col className='col-md-6'>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3" controlId="formBasicStoreId">
                            <Form.Label>Store ID</Form.Label>
                            <Form.Control
                                type="text" disabled
                                readOnly
                                value={formData.StoreId}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicStoreId">
                            <Form.Label>Pincode</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={formData.StorePincode}
                                onChange={handleInputChange}
                                placeholder="Enter Store Pincode"
                                name="StorePincode"
                            />
                        </Form.Group>

                        <p><strong>Store Location: </strong>
                            <a target='_blank' href={`https://www.google.com/maps?q=${formData.StoreLatitude},${formData.StoreLongitude}`}>
                                Open in Google maps
                            </a>
                        </p>

                        <Form.Group className="mb-5" controlId="formBasicImages" style={{ display: 'flex', overflowY: 'scroll', height: '200px' }} >
                            {/* <Form.Label>Store Images</Form.Label> */}
                            {selectedStore?.StoreImages && selectedStore.StoreImages.length > 0 ? (
                                selectedStore.StoreImages.map((image, index) => (
                                    <div key={index} className="position-relative" style={{ marginRight: '10px' }}>
                                        <img
                                            src={`${baseurl}/${image}`}
                                            alt={`Store Image ${index + 1}`}
                                            style={{ width: '200px', height: '150px', objectFit: 'cover' }}
                                        />
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="position-absolute start-50 translate-middle-x" style={{ bottom: '0px' }}
                                            onClick={() => handleDeleteImage(image)}>
                                            Delete
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <p>No images available</p>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicImages">
                            <Form.Label>Upload New Image ( adds to existing Images )</Form.Label>
                            <Form.Control type="file" name="StoreImage" multiple id='newImagesInModel' />
                        </Form.Group>


                        <Button variant="primary" type="button" onClick={SaveData}>
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showDeleteModal} onHide={handelCloseDeleteModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Store</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h3>Are You Sure ?</h3>
                    <h3>Deleteing The Store {deleteStore.StoreId}</h3>
                    <div className='d-flex justify-content-center align-items-center' onClick={DelteThisStore}><Button variant="danger" className='col-lg-3 col-md-3 col-sm-3'>DELETE</Button></div>
                </Modal.Body>
            </Modal>


        </>
    );
};

export default MyStores;
