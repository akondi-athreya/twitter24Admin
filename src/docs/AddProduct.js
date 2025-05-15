import React, { useEffect, useState } from "react";
import Header from "../layouts/Header";
import { Card, Button, Row, Col, Form } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import Select from "react-select";
import axios from "axios";
import { useUser } from "../userContext";
import { Toaster, toast } from "react-hot-toast";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const AddProduct = () => {
	const {USERID} = JSON.parse(localStorage.getItem("userData")) || {};;
	const [formData, setFormData] = useState({
		StoreName: "",
		productCategory: "",
		StoreId: "",
		productName: "",
		productNetWeight: "",
		productPrice: "",
		productDescription: "",
		productId: "",
		onDiscount: false,
		productBrand: "",
		tags: "",
		size: "",
		productTimer: ""
	});

	const baseurl = process.env.REACT_APP_API;
	const currentSkin = localStorage.getItem("skin-mode") ? "dark" : "";
	const [skin, setSkin] = useState(currentSkin);
	const [selectOptions, setOptions] = useState([]);
	const [validated, setValidated] = useState(false);
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [isChecked, setIsChecked] = useState(false);
	const [loading, setLoading] = useState(false);
	const [storeLoading, setStoreLoading] = useState(false);

	const handleCheckboxChange = (e) => {
		setIsChecked(e.target.checked);
	};

	useEffect(() => {
		const getData = async () => {
			await axios.post(baseurl + "/api/get-Store-names", { USERID: USERID })
				.then((res) => {
					console.log(res);
					const StoreNames = res.data[0].StoreName;
					const formattedOptions = StoreNames.map((item) => ({
						value: item.StoreName,
						label: item.StoreName
					}));
					setOptions(formattedOptions);
				})
				.catch((err) => {
					console.error(err);
				});
		};
		getData();
	}, [baseurl, USERID, selectedFiles]);

	const settingStoreName = (selectedOption) => {
		setStoreLoading(true);
		const selectedStoreName = selectedOption ? selectedOption.value : '';
		setFormData((prevFormData) => ({
			...prevFormData,
			StoreName: selectedStoreName
		}));

		axios.post(baseurl + '/api/get-particular-Store-details', { USERID: USERID, StoreName: selectedStoreName })
			.then((res) => {
				console.log(res)
				const { StoreId, StoreCategory } = res.data.exist[0].data[0];
				const { productId } = res.data;
				setFormData((prevFormData) => ({
					...prevFormData,
					StoreId: StoreId,
					productCategory: StoreCategory,
					productId: productId
				}));
				setStoreLoading(false);
			})
			.catch((err) => {
				console.error(err);
				setStoreLoading(false);
			});
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value
		});
	};

	const handleFilesInput = (event) => {
		setSelectedFiles(event.target.files);
	};

	//below we are saving the no of days in number format, we should save in new Date() + no of days format , so that we can delete expired products
	const settingProductTimer = (selectedOption) => {
		const selectedProductTimer = selectedOption ? selectedOption.value : '';
		const currentDate = new Date();
		const expiryDate = new Date(currentDate.setDate(currentDate.getDate() + parseInt(selectedProductTimer)));
		setFormData((prevFormData) => ({
			...prevFormData,
			productTimer: expiryDate.toISOString()
		}));
	};

	const [disabledbtn, setBtnToDisable] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();
		setBtnToDisable(true);
		setLoading(true);
		setValidated(true);
		if (!isChecked) {
			toast.error('You must agree to add your product!');
			setBtnToDisable(false);
			setLoading(false);
			return;
		}
		const combinedFormData = new FormData();
		for (const key in formData) {
			combinedFormData.append(key, formData[key]);
		}
		if(selectedFiles.length <= 1){
			toast.warn('Please upload atleast 2 images of the product!');
			setBtnToDisable(false);
			setLoading(false);
			return;
		}
		for (let i = 0; i < selectedFiles.length; i++) {
			combinedFormData.append('images', selectedFiles[i]);
		}
		combinedFormData.append("USERID", USERID);

		try {
			await toast.promise(
				axios.post(baseurl + '/api/add-product', combinedFormData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
					onUploadProgress: (progressEvent) => {
						const progress = Math.round(
							(progressEvent.loaded * 100) / progressEvent.total
						);
						setUploadProgress(progress);
					},
				}),
				{
					loading: 'Uploading product...',
					success: 'Product added successfully!',
					error: 'Something went wrong, please try again!',
				}
			);

			setFormData({
				StoreName: "",
				productCategory: "",
				StoreId: "",
				productName: "",
				productNetWeight: "",
				productPrice: "",
				productDescription: "",
				productId: "",
				onDiscount: false,
				productBrand: "",
				tags: "",
				size: "",
				ProductTimer: ""
			});
			setSelectedFiles([]);
			setUploadProgress(0);
			setValidated(false);

		} catch (error) {
			console.error(error);
			toast.error('Something went wrong, Please try again!');
		}

		setBtnToDisable(false);
		setLoading(false);
	};


	const timerOptions = [
		{ value: "1", label: "1 Day" },
		{ value: "2", label: "2 Days" },
		{ value: "3", label: "3 Days" },
		{ value: "4", label: "4 Days" },
		{ value: "5", label: "5 Days" },
		{ value: "6", label: "6 Days" },
		{ value: "7", label: "7 Days" },
		{ value: "8", label: "8 Days" },
		{ value: "9", label: "9 Days" },
		{ value: "10", label: "10 Days" },
		{ value: "15", label: "15 Days" },
	];

	return (
		<>
			<Toaster />
			<Header onSkin={setSkin} />
			
			{/* Backdrop for store loading */}
			<Backdrop
				sx={{ color: '#fff', zIndex: 9999 }}
				open={storeLoading}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
			
			<div className="main main-app p-3 p-lg-4">
				<Row className="d-flex justify-content-center mb-3">
					<Col className="all_title">
						<h1>Add Product</h1>
					</Col>
				</Row>
				<Row className="d-flex justify-content-center mb-3">
					<Col className="col-12 col-lg-6">
						<Alert variant={'info'}>
							The Below Fields may Vary for the Products You Add
						</Alert>
						<Alert variant={'warning'}>
							You Can Up to 10 Products, It is not possible to add more than That!<br />
							We are very Sorry For it 🙁. We Think You add your most popular products to Highlight.
						</Alert>
					</Col>
					<Col className="col-12 col-lg-6">
						<Alert variant={'info'}>
							So Fill Up the required Fields and leave Reamiaing for Optional,<br />We will TakeCare of Them.
						</Alert>
						<Alert variant={'warning'}>
							Please select a timer for the product. After the selected time, the product will be deleted automatically.
						</Alert>
					</Col>
				</Row>

				<div className="d-flex justify-content-center">
					<Card className="col-sm-12 col-lg-8">
						<Card.Body>
							<Form noValidate validated={validated} onSubmit={handleSubmit}>
								<Row className="d-flex justify-content-center mb-3">
									<Col>
										<Form.Group controlId="StoreName">
											<Form.Label><strong>Store Name</strong></Form.Label>
											<Select
												options={selectOptions} isSearchable={true} onChange={(e) => settingStoreName(e)}
												isInvalid={!formData.StoreName && validated}
												value={selectOptions.find(option => option.value === formData.StoreName) || null}
												isDisabled={storeLoading}
											/>
											{!formData.StoreName && validated && (
												<div className="invalid-feedback d-block">
													Store Name is required.
												</div>
											)}
										</Form.Group>
									</Col>
									<Col>
										<Form.Group controlId="StoreId">
											<Form.Label><strong>Store Id</strong></Form.Label>
											<Form.Control type="text"
												placeholder="Store ID" value={formData.StoreId}
												disabled={true} name="StoreId"
											/>
										</Form.Group>
									</Col>
								</Row>
								<Row className="mb-3">
									<Col>
										<Form.Group controlId="StoreCategory">
											<Form.Label><strong>Store Category</strong></Form.Label>
											<Form.Control type="text" placeholder="Store Category"
												disabled={true} name="StoreCategory" value={formData.productCategory}
											/>
										</Form.Group>
									</Col>
									<Col>
										<Form.Group controlId="productId">
											<Form.Label><strong>product Id</strong></Form.Label>
											<Form.Control type="text" placeholder="product Id"
												disabled={true} name="productId" value={formData.productId}
											/>
										</Form.Group>
									</Col>
								</Row>
								<Row className="mb-3">
									<Col>
										<Form.Group controlId="productName">
											<Form.Label><strong>Product Name</strong></Form.Label>
											<Form.Control
												required type="text" name="productName" placeholder="Product name"
												value={formData.productName} onChange={handleInputChange}
												isInvalid={!formData.productName && validated}
											/>
											<Form.Control.Feedback type="invalid">
												Product name is required.
											</Form.Control.Feedback>
										</Form.Group>
									</Col>
									<Col>
										<Form.Group controlId="productBrand">
											<Form.Label><strong>Product Brand</strong></Form.Label>
											<Form.Control
												type="text" name="productBrand" placeholder="Product Brand"
												value={formData.productBrand} onChange={handleInputChange}
											/>
										</Form.Group>
									</Col>
								</Row>
								<Row className="mb-3">
									<Col>
										<Form.Group controlId="productNetWeight">
											<Form.Label><strong>Net Weight/Volume</strong></Form.Label>
											<Form.Control
												required type="text" name="productNetWeight" placeholder="Product Weight"
												value={formData.productNetWeight} onChange={handleInputChange}
												isInvalid={!formData.productNetWeight && validated}
											/>
											<Form.Control.Feedback type="invalid">
												Product Weight is required.
											</Form.Control.Feedback>
										</Form.Group>
									</Col>
									<Col>
										<Form.Group controlId="productPrice">
											<Form.Label><strong>Price</strong></Form.Label>
											<Form.Control
												required type="text" name="productPrice" placeholder="Product Price in Rupees"
												value={formData.productPrice} onChange={handleInputChange}
												isInvalid={!formData.productPrice && validated}
											/>
											<Form.Control.Feedback type="invalid">
												Product price is required.
											</Form.Control.Feedback>
										</Form.Group>
									</Col>
								</Row>
								<Row className="mb-3">
									<Col>
										<Form.Group controlId="productDescription">
											<Form.Label><strong>Product Description</strong></Form.Label>
											<Form.Control as="textarea" name="productDescription" rows="5"
												placeholder="Enter product description here..."
												value={formData.productDescription} onChange={handleInputChange} isInvalid={!formData.productPrice && validated}
											/>
										</Form.Group>
									</Col>
								</Row>
								<Row className="mb-3">
									<Col>
										<Form.Group controlId="tags">
											<Form.Label><strong>Tags for Searching</strong></Form.Label>
											<Form.Control
												type="text" name="tags" placeholder="Tags ( seaprate using ',' ) Ex:- Men's Fashion, dress, shirt"
												value={formData.tags} onChange={handleInputChange}
											/>
										</Form.Group>
									</Col>
								</Row>
								<Row className="mb-3">
									<Col>
										<Form.Group controlId="size">
											<Form.Label><strong>Product Size</strong></Form.Label>
											<Form.Control
												type="text" name="size" placeholder="XS, S, M, L, XL, XXl, XXXL"
												value={formData.size} onChange={handleInputChange}
											/>
										</Form.Group>
									</Col>
									<Col className="col-md-6">
										<Form.Group controlId="ProductTimer">
											<Form.Label><strong>Product Timer</strong></Form.Label>
											<Select
												options={timerOptions}
												isSearchable={true}
												onChange={(e) => settingProductTimer(e)}
												isInvalid={!formData.productTimer && validated}
												value={timerOptions.find(option => option.value === (new Date(formData.productTimer).getDate() - new Date().getDate()).toString()) || null}
											/>
											{!formData.productTimer && validated && (
												<div className="invalid-feedback d-block">
													Product Timer is required.
												</div>
											)}
										</Form.Group>
									</Col>
								</Row>
								<Row className="mb-3">
									<Col>
										<Form.Group controlId="formFileMultiple" className="mb-3">
											<Form.Label><strong>Product Images - upload 4 images of product ( 1400 x 500 )</strong></Form.Label>
											<Form.Control type="file" multiple onChange={handleFilesInput} />
										</Form.Group>
									</Col>
								</Row>
								<Row className="d-flex justify-content-start align-items-center text-justify">
									<Col className="col-md-12">
										<Form.Check type="checkbox" label="By checking this box, I confirm that I have agree to the Terms for Adding a product." onChange={handleCheckboxChange} />
									</Col>
								</Row>
								<Row className="d-flex justify-content-center mb-3">
									<Col className="col-lg-1">
										{loading ? (
											<div className="d-flex justify-content-center mt-4">
												<CircularProgress size={24} />
											</div>
										) : (
											<Button variant="outline-success" className='mt-4' type="submit" disabled={disabledbtn}>
												Submit
											</Button>
										)}
									</Col>
								</Row>
							</Form>
						</Card.Body>
					</Card>
				</div>
			</div>
			
			{/* Backdrop for form submission */}
			<Backdrop
				sx={{ color: '#fff', zIndex: 9999 }}
				open={loading}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
		</>
	);
};

export default AddProduct;