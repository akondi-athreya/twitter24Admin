import React, { use, useEffect, useState } from 'react';
import Header from '../layouts/Header';
import { Card } from 'react-bootstrap';
import { Button, Row, Col, Form } from 'react-bootstrap';
import Select from "react-select";
import { ToastContainer, toast, Flip } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../userContext';
import './style.css'
import Footer from '../layouts/Footer';
import Loading from './loading.js';


const StoreRegister = () => {
    const navigate = useNavigate();
    const currentSkin = (localStorage.getItem('skin-mode')) ? 'dark' : '';
    const [skin, setSkin] = useState(currentSkin);
    const { USERID } = JSON.parse(localStorage.getItem("userData")) || {};;
    const [lati, setLatitude] = useState("17.0720472"); // default location should be company location
    const [longi, setLongitude] = useState("82.1514766"); // default location should be company location
    const [pincode, setPincode] = useState(""); // default location should be company location
    const [newCategoryModal, setNewCategoryModal] = useState(false);
    const [latestCategory, setLatestCategory] = useState('');
    const [refersh, setRefresh] = useState(false);
    const [wrongNumber, setWrongNumber] = useState(false);

    const [loading, setLoading] = useState(false);


    const [formData, setFormData] = useState({
        StoreName: '',
        StoreCategory: '',
        StoreAddress: '',
        StorePincode: '',
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

    const [validated, setValidated] = useState(false);

    const [storenamefordup, setStorenamefordup] = useState('');
    const [storeNameError, setStoreNameError] = useState(false);

    useEffect(() => {
        axios.get(baseurl + '/api/isStoreNameDuplicate/' + storenamefordup)
            .then((res) => {
                if (res.data?.isDuplicate === true) {
                    setStoreNameError(true);
                }
                else {
                    setStoreNameError(false);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [storenamefordup]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value)
        setFormData({
            ...formData,
            [name]: value
        });
        if (name === "StoreName") setStorenamefordup(value);
        // console.log(formData);
    };

    const handleownerMobileChange = (e) => {
        const { name, value } = e.target;
        console.log(value);
        if (value.length !== 10) {
            setWrongNumber(true);
            setFormData({
                ...formData,
                [name]: value
            });
            return;
        }
        setFormData({
            ...formData,
            [name]: value
        });
        setWrongNumber(false);
    }

    const handleCategoryChange = (selectedOption) => {
        if (selectedOption.value === "other") {
            setNewCategoryModal(true);
            return;
        }
        else {
            setNewCategoryModal(false);
            setFormData({
                ...formData,
                StoreCategory: selectedOption.value
            });
        }
    };

    const handleTagsChange = (selectedOptions) => {
        setFormData({
            ...formData,
            StoreTags: selectedOptions.map(option => option.value)
        });
    };

    const baseurl = process.env.REACT_APP_API;
    const dumpData = async (formDataWithFile) => {
        formDataWithFile.append("StoreLongitude", longi);
        formDataWithFile.append("StoreLatitude", lati);
        formDataWithFile.append("StorePincode", pincode);
        console.log(formDataWithFile);
        await axios.post(baseurl + '/api/approveStore', formDataWithFile, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    toast.success('Store Submitted', {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        transition: Flip,
                    });
                    toast.info('Your Store will Approved by The Company', {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        transition: Flip,
                    });
                    setFormData({
                        StoreName: '',
                        StoreCategory: '',
                        StorePincode: '',
                        StoreAddress: '',
                        StoreLatitude: '',
                        StoreLongitude: '',
                        StoreOwnerName: '',
                        StoreOwnerNumber: '',
                        StoreOwnerEmail: '',
                        StoreDescription: '',
                        businessTechnology: '',
                        StoreTags: [],
                        establishedSince: '',
                        StoreImages: [],
                        StoreId: ''
                    });
                    document.querySelector('input[type="file"]').value = '';
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
            })
            .catch((err) => {
                if (err.status === 409) {
                    toast.error("Store Name Alredy been Registered", {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        transition: Flip,
                    });
                    toast.info('Please Use Another Name', {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        transition: Flip,
                    });
                }
                else {
                    console.error(err);
                    toast.error('Internal Server Error', {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        transition: Flip,
                    });
                }
            });
        setLoading(false);
    };


    const handleSubmit = (e) => {
        // console.log(formData);
        e.preventDefault();

        setLoading(true);

        if (!document.querySelector('input[type="file"]').files.length) {
            toast.warn('Please upload at least one image', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Flip,
            });
            setLoading(false);
            return;
        }

        const form = e.currentTarget;

        setValidated(true);

        if (form.checkValidity() === false) {
            toast.warn('Fill the data correctly', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Flip,
            });
            e.stopPropagation();
            setLoading(false);
            return;
        } else {
            // Create a FormData object to send data including the image
            const formDataWithFile = new FormData();



            // Append regular form fields
            Object.keys(formData).forEach((key) => {
                if (formData[key] && key !== "StoreImages") {
                    formDataWithFile.append(key, formData[key]);
                }
            });

            const StoreImages = document.querySelector('input[type="file"]').files;
            if (StoreImages?.length <= 1) {
                toast.warn('Please upload more than one image', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Flip,
                });
                setLoading(false);
                return;
            }
            Array.from(StoreImages).forEach((file) => {
                formDataWithFile.append("StoreImages", file);
            });

            formDataWithFile.append("USERID", USERID);
            if (newCategoryModal === true) {
                formDataWithFile.delete("StoreCategory");
                formDataWithFile.append("StoreCategory", latestCategory);
            }

            // Post data to server
            dumpData(formDataWithFile)
        }
        setValidated(false);
    };

    let selectOptions = [
        { value: 'other', label: 'Other' }
    ];
    const [selectiong, setSelection] = useState([{ value: 'other', label: 'Other' }]);


    useEffect(() => {
        axios.get(baseurl + '/api/getUniqueCategories')
            .then((res) => {
                res.data.forEach(category => {
                    selectOptions.push({ value: category, label: category });
                });
                setSelection(selectOptions);
            })
            .catch((err) => {
                console.error(err);
            });

        axios.get(baseurl + '/api/getGenerateUniqueCode')
            .then((res) => {
                setFormData({
                    ...formData,
                    StoreId: res.data.code
                })
            })
            .catch((err) => {
                console.error(err);
            })
        const getLocation = () => {
            const successCallback = (position) => {
                const { latitude, longitude } = position.coords;
                console.log(latitude, longitude)
                if (latitude !== undefined && longitude !== undefined) {
                    setLatitude(latitude);
                    setLongitude(longitude);
                }
                const apiKey = process.env.REACT_APP_OPENCAGE_API_KEY;
                const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;
                fetch(url)
                    .then((response) => response.json())
                    .then((data) => {
                        if (data && data.results && data.results.length > 0) {
                            if (data.results[0].components) {
                                console.log(data.results[0])
                                setPincode(data.results[0].components.postcode);
                            } else {
                                console.error("Pincode not found in the response.");
                            }
                        } else {
                            console.error("No results found.");
                        }
                    })
                    .catch((error) => console.error("Error with OpenCage API:", error));
            };
            const errorCallback = (error) => {
                console.error('Error fetching location:', error);
            };
            navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
        };
        getLocation();
    }, [refersh]);





    const tagOptions = [
        { value: 'affordable', label: 'Affordable' },
        { value: 'premium', label: 'Premium' },
        { value: 'handmade', label: 'Handmade' },
        // Add more options...
    ];


    return (
        <>
            <Header onSkin={setSkin} />
            <ToastContainer />
            <div className="main main-app p-3 p-lg-4">
                <div className='all_title'>
                    <h1>Register Your Store</h1>
                </div>

                <div className='d-flex justify-content-center'>
                    <Card className='col-sm-12 col-lg-8'>
                        <Card.Body>
                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                <Row className='d-flex justify-content-center mb-3'>
                                    <Col>
                                        <Form.Group controlId="StoreName">
                                            <Form.Label>Store Name</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                name="StoreName"
                                                placeholder="Store name"
                                                value={formData.StoreName}
                                                onChange={handleInputChange}
                                                isInvalid={!formData.StoreName && validated}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Store name is required.
                                            </Form.Control.Feedback>
                                            {storeNameError && <div className="invalid-feedback d-block">Store name already exists.</div>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className='d-flex justify-content-center mb-3'>
                                    <Col>
                                        <Form.Group controlId="StoreCategory">
                                            <Form.Label>Store Category</Form.Label>
                                            <Select
                                                options={selectiong}
                                                isSearchable={true}
                                                onChange={handleCategoryChange}
                                                isInvalid={!formData.StoreCategory && validated}
                                            />
                                            {!formData.StoreCategory && validated && (
                                                <div className="invalid-feedback d-block">Store category is required.</div>
                                            )}
                                        </Form.Group>
                                    </Col>

                                    <Col>
                                        <Form.Group controlId="StorePincode">
                                            <Form.Label>Store Pincode</Form.Label>
                                            <Form.Control
                                                required
                                                type="number"
                                                name="StorePincode"
                                                placeholder="Store Pincode"
                                                // value={formData.StorePincode}
                                                value={pincode}
                                                onChange={(e) => setPincode(e.target.value.toString())}
                                                isInvalid={!formData.StorePincode && validated}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Store Pincode is required.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                {newCategoryModal && <Row className='d-flex justify-content-center mb-3'>
                                    <Col>
                                        <Form.Group controlId="StoreCategory">
                                            <Form.Label>Store Category</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                name="StoreCategory"
                                                placeholder="Store category"
                                                value={latestCategory}
                                                onChange={(e) => setLatestCategory(e.target.value)}
                                                isInvalid={!formData.StoreCategory && validated}
                                            />
                                            {!formData.StoreCategory && validated && (
                                                <div className="invalid-feedback d-block">Store category is required.</div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>}
                                <Row className='d-flex justify-content-center mb-3'>
                                    <Col>
                                        <Form.Group controlId="StoreAddress">
                                            <Form.Label>Store Address</Form.Label>
                                            <Form.Control
                                                required
                                                as="textarea"
                                                name="StoreAddress"
                                                rows="3"
                                                placeholder="Enter Store address here..."
                                                value={formData.StoreAddress}
                                                onChange={handleInputChange}
                                                isInvalid={!formData.StoreAddress && validated}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Store address is required.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className='d-flex justify-content-center mb-3'>
                                    <Col>
                                        <Form.Group controlId="StoreLatitude">
                                            <Form.Label>Store Latitude</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                name="StoreLatitude"
                                                // placeholder="Store Latitude"
                                                // value={formData.StoreLatitude}
                                                value={lati}
                                                onChange={handleInputChange}
                                                isInvalid={!formData.StoreLatitude && validated}
                                                disabled={true}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Store latitude is required.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId="StoreLongitude">
                                            <Form.Label>Store Longitude</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                name="StoreLongitude"
                                                // placeholder="Store Longitude"
                                                // value={formData.StoreLongitude}
                                                value={longi}
                                                onChange={handleInputChange}
                                                isInvalid={!formData.StoreLongitude && validated}
                                                disabled={true}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Store longitude is required.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className='d-flex justify-content-center mb-3'>
                                    <Col>
                                        <Form.Group controlId="ownerName">
                                            <Form.Label>Owner Name</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                name="StoreOwnerName"
                                                placeholder="Owner name"
                                                value={formData.StoreOwnerName}
                                                onChange={handleInputChange}
                                                isInvalid={!formData.StoreOwnerName && validated} />
                                            <Form.Control.Feedback type="invalid">
                                                Owner name is required.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId="ownerMobile">
                                            <Form.Label>Owner Mobile Number</Form.Label>
                                            <Form.Control
                                                required
                                                type="number"
                                                name="StoreOwnerNumber"
                                                placeholder="Owner mobile number"
                                                value={formData.StoreOwnerNumber}
                                                length={10}
                                                onChange={handleownerMobileChange}
                                                isInvalid={(!formData.StoreOwnerNumber || formData.StoreOwnerNumber.length !== 10) && validated}  // Changed from formData.ownerMobile
                                            />
                                            {wrongNumber && <div className="invalid-feedback d-block">Owner mobile number must be exactly 10 digits.</div>}
                                            <Form.Control.Feedback type="invalid">
                                                Owner mobile number must be exactly 10 digits.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className='d-flex justify-content-center mb-3'>
                                    <Col>
                                        <Form.Group controlId="StoreOwnerEmail">
                                            <Form.Label>Owner Email</Form.Label>
                                            <Form.Control
                                                required
                                                type="email"
                                                name="StoreOwnerEmail"
                                                placeholder="Owner email"
                                                value={formData.StoreOwnerEmail}
                                                onChange={handleInputChange}
                                                isInvalid={!formData.StoreOwnerEmail && validated}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                A valid email is required.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className='d-flex justify-content-center mb-3'>
                                    <Col>
                                        <Form.Group controlId="StoreId">
                                            <Form.Label>Store Id</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Store ID"
                                                value={formData.StoreId}
                                                disabled={true}
                                                name="StoreId"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId="StoreEstablishedYear">
                                            <Form.Label>Established Since</Form.Label>
                                            <Form.Control
                                                required
                                                type="month"
                                                name="StoreEstablishedYear"
                                                value={formData.StoreEstablishedYear}
                                                onChange={handleInputChange}
                                                isInvalid={!formData.StoreEstablishedYear && validated}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a valid date.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className='d-flex justify-content-center mb-3'>
                                    <Col>
                                        <Form.Group controlId="StoreDescription">
                                            <Form.Label>Store Description</Form.Label>
                                            <Form.Control
                                                required
                                                as="textarea"
                                                name="StoreDescription"
                                                rows="3"
                                                placeholder="Provide a brief description of your Store (5-10 lines)"
                                                value={formData.StoreDescription}
                                                onChange={handleInputChange}
                                                isInvalid={!formData.StoreDescription && validated}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Description is required.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className='d-flex justify-content-center mb-3'>
                                    <Col>
                                        <Form.Group controlId="businessTechnology">
                                            <Form.Label>Business Technology</Form.Label>
                                            <Form.Control
                                                required
                                                as="textarea"
                                                name="businessTechnology"
                                                rows="3"
                                                placeholder="Describe your business technology (5-10 lines)"
                                                value={formData.businessTechnology}
                                                onChange={handleInputChange}
                                                isInvalid={!formData.businessTechnology && validated}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                A detailed blueprint is required.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className='d-flex justify-content-center mb-3'>
                                    <Col>
                                        <Form.Group controlId="StoreTags">
                                            <Form.Label>Store Tags</Form.Label>
                                            <Select
                                                options={tagOptions}
                                                isMulti
                                                onChange={handleTagsChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className='d-flex justify-content-center mb-3'>
                                    <Col>
                                        <Form.Group controlId="formFile">
                                            <Form.Label>Store Images (1400 x 500)</Form.Label>
                                            <Form.Control type="file" multiple />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className='d-flex justify-content-center'>
                                    <Col className='col-lg-2'>
                                        {loading===false && <Button variant="outline-success" className='mt-4' type="submit" disabled={loading ? true : false}>Submit</Button>}
                                        {loading===true && <Loading />}
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>

                        <Card.Footer className='text-muted'>
                            <div className='d-flex justify-content-center'>
                                <p><b>Note:</b> Please make sure to fill all the fields correctly and wait until the data is uploading, until then don't click anything or close the window</p>
                            </div>
                        </Card.Footer>
                    </Card>
                </div>
                <Footer />
            </div >
        </>
    );
}

export default StoreRegister;
