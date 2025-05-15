import React, { useEffect } from 'react'
import { useState } from 'react';
import Header from '../layouts/Header';
import { Row, Button, Card, Carousel, Modal, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast, Flip, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../userContext';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import './style.css'

const MyProducts = () => {
    const currentSkin = (localStorage.getItem('skin-mode')) ? 'dark' : '';
    const [skin, setSkin] = useState(currentSkin);
    const [data, setData] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedproduct, setSelectedProduct] = useState(null);
    const [validated, setValidated] = useState(false);
    const [deleteProduct, setDeleteProduct] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const [dummyData, setDummyData] = useState([]);

    const handelCloseDeleteModal = () => setShowDeleteModal(false);

    const { USERID } = JSON.parse(localStorage.getItem('userData')) || {};

    const [formData, setFormData] = useState({
        productName: '',
        productCategory: '',
        productNetWeight: '',
        productPrice: '',
        productDescription: '',
        productId: '',
        _id: '',
        StoreId: '',
        StoreName: '',
    });


    const baseurl = process.env.REACT_APP_API;
    useEffect(() => {
        axios.get(baseurl + `/api/get-all-products/${USERID}`)
            .then((res) => {
                console.log(res.data)
                setData(res.data);
                setDummyData(res.data);
            })
            .catch((err) => [
                console.error(err)
            ])
    }, [refresh, USERID, baseurl]);

    const handleShowViewModal = (product) => {
        setSelectedProduct(product);
        setShowViewModal(true);
    }
    const handleShowEditModal = (product) => {
        setSelectedProduct(product);
        setFormData({
            productName: product.productName,
            productCategory: product.productCategory,
            productNetWeight: product.productNetWeight,
            productPrice: product.productPrice,
            productDescription: product.productDescription,
            productId: product.productId,
            _id: product._id,
            StoreId: product.StoreId,
            StoreName: product.StoreName
        });
        setShowEditModal(true);
    }
    const handleCloseEditModal = () => setShowEditModal(false);
    const handleCloseViewModal = () => setShowViewModal(false);

    const SaveData = async (event) => {
        event.preventDefault();
        setValidated(true);
        await axios.post(baseurl + '/api/update-product', formData)
            .then((res) => {
                console.log(res);
                toast.success('Prduct Details Updated', {
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
                    productName: '',
                    productCategory: '',
                    productNetWeight: '',
                    productPrice: '',
                    productDescription: '',
                    productId: '',
                    _id: ''
                })
            })
            .catch((err) => {
                console.error(err)
                toast.error('Error updating details', {
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
            })
        handleCloseEditModal();
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };


    const DeleteMyProduct = (item) => {
        setDeleteProduct(item);
        setShowDeleteModal(true);
    }

    const DeleteThisProduct = async () => {
        axios.post(baseurl + '/api/deleteThisProduct', { USERID: USERID, data: deleteProduct })
            .then((res) => {
                toast('Product Deleted Successfully', {
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
                setDeleteProduct();
                handelCloseDeleteModal();
                setRefresh((prev) => !prev);
            })
            .catch((err) => {
                console.error(err);
                toast.error('Error Delting Product!', {
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
    const pageCount = Math.ceil(data.length / itemsPerPage);
    const offset = currentPage * itemsPerPage;
    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };
    const currentItems = data.slice(offset, offset + itemsPerPage);

    const handleSearch = (e) => {
        if (e.target.value === '') {
            console.log(e.target.value);
            setData(dummyData);
            return;
        }
        // filter the data on search
        else {
            const filteredData = dummyData?.filter((item) => {
                return item.productName.toLowerCase().includes(e.target.value.toLowerCase());
            });
            setData(filteredData);
        }
    }

    return (
        <>
            <Header onSkin={setSkin} />
            <ToastContainer />
            <div className="main main-app p-3 p-lg-4">
                <div className='all_title'><h1>My Products</h1></div>
                <div className='search_area_box'>
                    <input type='text' placeholder='Search Your Products...' onChange={(e) => handleSearch(e)}/>

                </div>
                <div className='d-flex gap-5 flex-wrap'>
                    {data.length > 0 ? currentItems.map((item, index) => (
                        <Card key={index} className='col-lg-3 p-3'>
                            <Carousel fade>
                                {item.productImages && item.productImages.length > 0 ? (
                                    item.productImages.map((image, imgIndex) => (
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
                                {item.onDiscount == true ? <div className="marker-icon top-left"><i className="ri-star-line"></i></div> : ""}
                                <Card.Title className="text-dark">{item.productName}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{item.productId}</Card.Subtitle>
                                <Card.Subtitle className="mb-2 text-muted">{item.productCategory}</Card.Subtitle>
                                <Card.Text>
                                    {item.productDescription.length > 100 ? `${item.productDescription.substring(0, 100)}...` : item.productDescription}
                                </Card.Text>
                                <Row className='justify-content-evenly gap-3'>
                                    {/* View Button */}
                                    <Button variant="primary" onClick={() => handleShowViewModal(item)} className='col-lg-4 col-md-3 col-sm-3'>View</Button>
                                    {/* Edit Button */}
                                    <Button variant="primary" onClick={() => handleShowEditModal(item)} className='col-lg-4 col-md-3 col-sm-3'>Edit</Button>
                                    {/* Delete Button */}
                                    <Button variant="danger" onClick={() => DeleteMyProduct(item)} className='col-lg-4 col-md-3 col-sm-3'>Delete</Button>
                                </Row>
                            </Card.Body>
                        </Card>
                    )) : <div className='datanotavailable'>Add Your First Product By clicking <Link to='/admin/AddProduct'>here </Link> <span className='insidespan'>✌🏻</span></div>}
                </div>
                {data.length > 0 && <div className='mt-5'>
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
            </div>

            <Modal show={showViewModal} onHide={handleCloseViewModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Product Details - {selectedproduct?.productName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedproduct && (
                        <>
                            <p><strong>Product Id:</strong> {selectedproduct.productId}</p>
                            <p><strong>Product Category:</strong> {selectedproduct.productCategory}</p>
                            <p><strong>Product Net Weight:</strong> {selectedproduct.productNetWeight}</p>
                            <p><strong>Product Price:</strong> {selectedproduct.productPrice}</p>
                            <p><strong>Product Description:</strong> {selectedproduct.productDescription}</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseViewModal}>Close</Button>
                </Modal.Footer>
            </Modal>


            {/* Modal for editing Store details */}
            <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Store Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="edit-Store-form" noValidate validated={validated}>
                        <Row className='d-flex justify-content-center mb-3'>
                            <Col>
                                <Form.Group controlId="productName">
                                    <Form.Label>Product Name</Form.Label>
                                    <Form.Control required type="text" name="productName"
                                        placeholder="Store name" value={formData.productName} onChange={handleInputChange}
                                    />
                                    <Form.Control.Feedback type="invalid">product name is required.</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="productCategory">
                                    <Form.Label>Product Category</Form.Label>
                                    <Form.Control required type="text" name="productCategory" disabled={true}
                                        placeholder="Product Category" value={formData.productCategory} onChange={handleInputChange}
                                    />
                                    <Form.Control.Feedback type="invalid">Product Category is required.</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className='d-flex justify-content-center mb-3'>
                            <Col>
                                <Form.Group controlId="productNetWeight">
                                    <Form.Label>Product Net Weight</Form.Label>
                                    <Form.Control required type="text"
                                        name="productNetWeight" placeholder="Product Net Weight" value={formData.productNetWeight} onChange={handleInputChange}
                                    />
                                    <Form.Control.Feedback type="invalid">Product Net Weight is required.</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="productPrice">
                                    <Form.Label>Product Price</Form.Label>
                                    <Form.Control required
                                        type="text" name="productPrice" placeholder="Product Price"
                                        value={formData.productPrice} onChange={handleInputChange}
                                    />
                                    <Form.Control.Feedback type="invalid">Product Price is required.</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className='d-flex justify-content-center mb-3'>
                            <Col>
                                <Form.Group controlId="productDescription">
                                    <Form.Label>Product Description</Form.Label>
                                    <Form.Control as="textarea"
                                        required rows="5" name="productDescription"
                                        placeholder="Product Description" value={formData.productDescription}
                                        onChange={handleInputChange}
                                    />
                                    <Form.Control.Feedback type="invalid">Product Description is required.</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>Close</Button>
                    <Button variant="primary" onClick={SaveData}>Save Changes</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDeleteModal} onHide={handelCloseDeleteModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Store</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h3>Are You Sure ?</h3>
                    <h3>Deleteing The Product {deleteProduct?.productId}</h3>

                    <div className='d-flex justify-content-center align-items-center' onClick={DeleteThisProduct}><Button variant="danger" className='col-lg-3 col-md-3 col-sm-3'>DELETE</Button></div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default MyProducts