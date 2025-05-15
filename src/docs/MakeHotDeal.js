import React from 'react'
import Header from '../layouts/Header';
import { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Form } from "react-bootstrap";
import Select from "react-select";
import axios, { all } from 'axios';
import { Toaster, toast } from 'react-hot-toast';


const MakeHotDeal = () => {
	const currentSkin = localStorage.getItem("skin-mode") ? "dark" : "";
	const [skin, setSkin] = useState(currentSkin);
	const [selectOptions, setOptions] = useState([]);
	const [selectProducts, setProductOptions] = useState([]);
	const [allProductsData, setAll] = useState([]);
	const [discountPer, setDiscountPer] = useState();
	const [afterPrice, setAfterPrice] = useState(0);
	const [reducedPrice, setPriceReduction] = useState(0);
	const [StoreData, setStoreData] = useState({
		StoreName: "",
		StoreId: "",
		productName: "",
		productId: "",
		productPrice: "",
		productDiscount: "",
	});

	const baseurl = process.env.REACT_APP_API;
	const {USERID} = JSON.parse(localStorage.getItem("userData"));

	useEffect(() => {
		const getData = async () => {
			await axios.post(baseurl + "/api/get-Store-names", { USERID: USERID })
				.then((res) => {
					const StoreNames = res.data[0]?.StoreName;
					const formattedOptions = StoreNames.map((item) => ({
						value: item.StoreName,
						label: item.StoreName,
						StoreId: item.StoreId,
					}));
					setOptions(formattedOptions);
				})
				.catch((err) => {
					console.error(err);
				});
		};
		getData();
	}, [baseurl, USERID]);

	const settingStoreName = (selectedOption) => {
		if (!selectedOption) {
			setStoreData({
				StoreName: "",
				StoreId: "",
				productName: "",
				productId: "",
				productPrice: "",
				productDiscount: "",
			});
			setProductOptions([]);
			return;
		}

		const selectedStoreName = selectedOption.value;

		// Find the StoreId from the selectOptions
		const selectedStore = selectOptions.find(
			(Store) => Store.value === selectedStoreName
		);

		setStoreData({
			StoreName: selectedStoreName,
			StoreId: selectedStore?.StoreId || "",
			productName: "", // Reset productName
			productId: "", // Reset productId
			productPrice: "", // Reset productPrice
			productDiscount: "", // Reset productDiscount
		});

		// Fetch products for the selected Store
		axios.post(baseurl + '/api/get-particular-Store-products', { USERID: USERID, StoreName: selectedStoreName })
			.then((res) => {
				const allProducts = res.data[0].products;
				setAll(allProducts);
				const formattedOptions = allProducts.map((item) => ({
					value: item.productName,
					label: item.productName,
				}));
				setProductOptions(formattedOptions);
			})
			.catch((err) => {
				console.error(err);
			});
	};

	const settingProductName = (selectedOption) => {
		if (!selectedOption) {
			// Clear product data if no product is selected
			setStoreData((prevStoreData) => ({
				...prevStoreData,
				productName: '',
				productId: '',
				productPrice: '',
			}));
			return;
		}

		// Find the product details from allProductsData
		const selectedProduct = allProductsData.find(
			(product) => product.productName === selectedOption.value
		);

		if (selectedProduct) {
			// Update StoreData with the selected product details
			setStoreData((prevStoreData) => ({
				...prevStoreData,
				productName: selectedProduct.productName,
				productId: selectedProduct.productId,
				productPrice: selectedProduct.productPrice > selectedProduct.productNewPrice ? selectedProduct.productNewPrice : selectedProduct.productPrice,

			}));
		}
	};

	const setDeal = (value) => {
		const discountValue = parseFloat(value);
		if (isNaN(discountValue)) {
			// window.alert("Please enter a valid numeric value for the discount.");
			setDiscountPer("");
			setPriceReduction(0);
			setAfterPrice(0);
			return;
		}
		if (discountValue < 0 || discountValue > 100) {
			toast.error('Enter A Valid Discount Value');
			return;
		}
		if (!StoreData.productPrice) {
			toast.error("Please select a specific product to apply the discount.");
			setDiscountPer(0);
			setAfterPrice(0);
			setPriceReduction(0);
			return;
		}

		const originalPrice = parseFloat(StoreData.productPrice);
		const discountedPrice = originalPrice - (originalPrice * discountValue / 100);

		setDiscountPer(discountValue);
		setAfterPrice(discountedPrice.toFixed(2));
		setPriceReduction((originalPrice - discountedPrice.toFixed(2)).toFixed(2));
	};

	const makingADeal = (event) => {
		event.preventDefault();
		if (!StoreData.StoreName) {
			toast.error('Select A Store Name');
			return;
		}
		if (!StoreData.productName) {
			toast.error('Select A Product Name');
			return;
		}
		if (!discountPer) {
			toast.error('Enter Discount Percentage');
			return;
		}
		const discountValue = parseFloat(discountPer);
		if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
			toast.error('Enter A Valid Discount Value')
			return;
		}
		if (!StoreData.productPrice) {
			toast.error("Product price is missing. Please ensure you have selected a valid product.");
			return;
		}
		console.log("Dealing...");
		//! Proceed with the deal-making logic (e.g., API call)
		const dealData = {
			StoreName: StoreData.StoreName,
			productName: StoreData.productName,
			productId: StoreData.productId,
			discount: discountPer,
			afterPrice: afterPrice,
			beforePrice: StoreData.productPrice,
		};

		toast.promise(
			axios.post(baseurl + '/api/make-a-deal', { USERID: USERID, dealData: dealData }),
			{
				loading: 'Creating deal...',
				success: 'Deal created successfully! 🎉',
				error: 'Error while creating deal',
			}
		).then((res) => {
			console.log("Deal created successfully:", res.data);
			setStoreData({
				StoreName: "",
				StoreId: "",
				productName: "",
				productId: "",
				productPrice: "",
				productDiscount: "",
			});
			setDiscountPer("");
			setAfterPrice(0);
			setPriceReduction(0);
		}).catch((err) => {
			console.error("Error creating deal:", err);
		});
	};

	return (
		<>
			<Header onSkin={setSkin} />
			<Toaster />
			<div className="main main-app p-3 p-lg-4">
				<div className="all_title">
					<h1>Make a Hot Deal</h1>
				</div>
				<div className="d-flex justify-content-center p-2">
					<Card className="col-sm-12 col-lg-8">
						<Card.Body>
							<Form onSubmit={makingADeal}>
								<Row className="d-flex justify-content-center mb-3">
									<Col>
										<Form.Group controlId="StoreName">
											<Form.Label>Store Name</Form.Label>
											<Select
												options={selectOptions} isSearchable={true} onChange={(e) => settingStoreName(e)}
												isInvalid={!StoreData.StoreName}
												value={selectOptions.find(option => option.value === StoreData.StoreName) || null}
											/>
											{!StoreData.StoreName && (
												<div className="invalid-feedback d-block">
													Store Name is required.
												</div>
											)}
										</Form.Group>
									</Col>
									<Col>
										<Form.Group controlId="StoreId">
											<Form.Label>Store Id</Form.Label>
											<Form.Control
												type="text"
												placeholder="Store ID"
												value={StoreData.StoreId}
												name="StoreId"
												disabled={true}
											/>
										</Form.Group>
									</Col>
								</Row>

								<Row className="d-flex justify-content-center mb-3">
									<Col>
										<Form.Group controlId="productName">
											<Form.Label>Product Name</Form.Label>
											<Select
												options={selectProducts}
												isSearchable={true}
												onChange={(e) => settingProductName(e)}
												value={selectProducts.find(option => option.value === StoreData.productName) || null}
											/>
											{!StoreData.productName && (
												<div className="invalid-feedback d-block">
													product Name is required.
												</div>
											)}
										</Form.Group>
									</Col>
									<Col>
										<Form.Group controlId="productId">
											<Form.Label>Product Id</Form.Label>
											<Form.Control type="text"
												placeholder="Product ID" value={StoreData.productId}
												name="productId" disabled={true}
											/>
										</Form.Group>
									</Col>
								</Row>

								<Row className='d-flex justify-content-center mb-3 align-items-center'>
									<Col>
										<Form.Group controlId="productId">
											<Form.Label>Discount or Deal (in %)</Form.Label>
											<Form.Control type="text" onChange={(e) => setDeal(e.target.value)}
												placeholder="Product ID"
												name="productId"
												value={discountPer}
											/>
										</Form.Group>
									</Col>
									<Col className='d-flex flex-column justify-content-evenly'>
										<Row>
											<center>
												<Form.Group>
													<Form.Label>Previous Price</Form.Label>
												</Form.Group>
												<div className='display-6'>{StoreData.productPrice ? StoreData.productPrice : 0}</div>
											</center>
										</Row>
										<Row>
											<Col>
												<Form.Group>
													<Form.Label>Price Reduced</Form.Label>
												</Form.Group>
												<div className='display-6' style={{ color: "orange" }}>{reducedPrice}</div>
											</Col>
											<Col>
												<Form.Group>
													<Form.Label>After Price</Form.Label>
												</Form.Group>
												<div className='display-6 fw-bold' style={{ color: "green" }}>{afterPrice}</div>
											</Col>
										</Row>
									</Col>
								</Row>
								<Row className='d-flex justify-content-center'>
									<Col className='mb-3 mt-3 d-flex justify-content-center'>
										<Button variant="outline-success" style={{ fontSize: 18 }} type='submit'>Deal</Button>
									</Col>
								</Row>
							</Form>
						</Card.Body>
					</Card>
				</div>
			</div>
		</>
	)
}

export default MakeHotDeal