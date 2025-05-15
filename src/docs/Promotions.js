import React, { useEffect, useState, useRef } from "react";
import Header from "../layouts/Header";
import axios from "axios";
import { useUser } from "../userContext";
import Select from "react-select";
import { Card, Row } from "react-bootstrap";
import { ToastContainer, toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../layouts/Footer";

function Promotions() {
    const currentSkin = localStorage.getItem("skin-mode") ? "dark" : "";
    const [skin, setSkin] = useState(currentSkin);
    const baseurl = process.env.REACT_APP_API;
    const {USERID} = JSON.parse(localStorage.getItem("userData")) || {};;

    const [options, setOptions] = useState([]);
    const [StoreName, setStoreName] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const fileInputRef = useRef(null);
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [StoreId, setStoreId] = useState("");
    const [completeData, setCompleteData] = useState([]);

    useEffect(() => {
        const getData = async () => {
            await axios.get(baseurl + "/api/getStoreForBanner/" + USERID)
                .then((res) => {
                    setCompleteData(res.data);
                    const formattedOptions = res.data.map((store) => ({
                        value: store.name,
                        label: store.name
                    }));
                    console.log(formattedOptions);
                    setOptions(formattedOptions);
                })
                .catch((err) => {
                    console.error(err);
                });
        };
        getData();
    }, [baseurl, USERID]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            setSelectedFiles(file);
        }
    };

    const sendData = async (event) => {
        event.preventDefault();
        if (!StoreName) {
            toast.warn('Please Select StoreName', {
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
            return;
        }
        if (!fileInputRef.current.files[0]) {
            toast.warn('Please Select Banner', {
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
            return;
        }
        const formData = new FormData();
        formData.append("bannerImage", fileInputRef.current.files[0]);
        formData.append("USERID", USERID);
        formData.append("StoreName", StoreName.value);
        formData.append("StoreId", StoreId);
        console.log("FormData Content:");
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        const response = await axios.post(`${baseurl}/api/upload-promotion-banner/`+USERID+'/'+StoreId+'/'+StoreName.value, formData)
            .then((res) => {
                console.log(res);
                toast.success('Banner Uploaded Successfully', {
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
                setImagePreview("");
                fileInputRef.current.value = "";
                setStoreName(null);
            })
            .catch((err) => {
                console.error(err);
                toast.error('Internal Server Error', {
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
            });
    }

    const handleStoreName = (selectedOption) => {
        setStoreName(selectedOption);
        console.log(selectedOption.value);
        // here find the store id using completeData using find method
        const store = completeData.find((store) => store.name === selectedOption.value);
        setStoreId(store.id);
    }

    return (
        <>
            <Header onSkin={setSkin} />
            <ToastContainer />
            <div className="main main-app p-3 p-lg-4">
                <div className="container">
                    <div className="row">
                        <div className="all_title">
                            <h1>Promotions</h1>
                        </div>
                    </div>
                    {/* show a drop down to select store name */}
                    <div className="row">
                        <Card className="d-flex p-3 gap-3 flex-wrap">
                            <Row>
                                <div className="col-12 col-lg-5">
                                    <label className="m-2"><h5>Select Store</h5></label>
                                    <Select options={options} isSearchable={true}
                                        onChange={handleStoreName} value={StoreName} />
                                </div>
                                <div className="col-12 col-lg-5">
                                    <label className="m-2"><h5>Image Banner ( Better to Upload 800 x 450 )</h5></label>
                                    <input type="file" className="form-control" onChange={handleImageChange} ref={fileInputRef} />
                                </div>
                            </Row>
                            <Row>
                                <div className="col-12 col-lg-8" style={{marginBottom: "70px"}}>
                                    <label className="m-2"><h5>Preview</h5></label><br />
                                    {imagePreview && <div style={{ width: "100%" }}>
                                        <img src={imagePreview} alt="preview" style={{ width: "100%" }} /></div>}
                                </div>
                            </Row>
                            <Row style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                                {/* take a button to upload */}
                                <div className="col-12 col-lg-8 d-flex justify-content-center">
                                    <button className="btn btn-outline-success" onClick={(e) => sendData(e)}>Upload</button>
                                </div>
                            </Row>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Promotions;