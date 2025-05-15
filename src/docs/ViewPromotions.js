import React, { useEffect, useState, useRef } from "react";
import Header from "../layouts/Header";
import axios from "axios";
import { useUser } from "../userContext";
import { figure, Image, Toast } from "react-bootstrap";
import img2 from "../assets/img/danist-soh-dqXiw7nCb9Q-unsplash.jpg";
import { ToastContainer, toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewPromotions = () => {
    const currentSkin = localStorage.getItem("skin-mode") ? "dark" : "";
    const [skin, setSkin] = useState(currentSkin);
    const baseurl = process.env.REACT_APP_API;
    const {USERID} = JSON.parse(localStorage.getItem("userData")) || {};;
    const [banners, setBanners] = useState([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        axios.get(baseurl + "/api/BUSS/get-store-banner/" + USERID)
            .then((res) => {
                setBanners(res.data.result);
                console.log(res.data.result);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Error in fetching data", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    transition: Flip,
                });
            });
    }, [refresh]);

    const deleteBanner = (id) => {
        axios.get(baseurl + "/api/BUSS/delete-store-banner/"+USERID+"/"+id)
            .then((res) => {
                toast.success("Banner Deleted Successfully", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    transition: Flip,
                });
                setRefresh(!refresh);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Error in deleting banner", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    transition: Flip,
                });
            });
    }

    return (
        <>
            <Header onSkin={setSkin} />
            <ToastContainer />
            <div className="main main-app p-3 p-lg-4">
                <div className="container">
                    <div className="row">
                        <div className="all_title">
                            <h1>View Display Banners</h1>
                        </div>
                    </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around", gap: "10px" }}>
                    {banners.length > 0 ? 
                    banners.map((item, index) => { 
                        return (
                            <div className="position-relative" key={index}>
                                <div className="marker-ribbon marker-info top-left shadow-sm" style={{ fontSize: 16 }}>{item.StoreName}</div>
                                <div className="marker-ribbon marker-danger top-right shadow-sm"
                                style={{ fontSize: 14, cursor: "pointer" }}
                                onClick={() => deleteBanner(item._id)}
                                >Delete</div>
                                <img src={`${baseurl}/${item.imagePath}`} className="img-fluid rounded" alt="" style={{ height: "300px" }} />
                            </div>
                        );
                    }) :
                        <div className="text-center">
                            <h4>No Banners Found</h4>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default ViewPromotions;