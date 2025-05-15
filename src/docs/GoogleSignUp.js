import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Button, Col, Row } from 'react-bootstrap';

import { auth } from '../config/firebase';

import axios from 'axios';

import { useUser } from '../userContext';
import { toast, ToastContainer, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getUserPlan from '../config/getUserPlan';


const GoogleSignIn = ({ navigating }) => {
    const baseurl = process.env.REACT_APP_API;
    const { setUserId } = useUser();
    const { login } = useUser();
    const handleGoogleSignIn = () => {
        const provider = new GoogleAuthProvider();
        // const auth = getAuth();

        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;

                const user = result.user;
                console.log(user);
                handleDumpData(user.providerData[0]);
                // localStorage.setItem("user", JSON.stringify(user));
                // window.location.href = "/";
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.error(errorMessage);
            });
    };

    const handleDumpData = async (user) => {
        await axios.post(baseurl + "/api/BUSS/create-new-BO-account-google", {
            Username: user?.displayName,
            Email: user?.email,
            Fullname: user?.displayName,
            Contact: user?.phoneNumber,
        })
            .then((response) => {
                if (response.status === 400) {
                    toast.warn("User Already Exists ! Please SignIn", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        transition: Flip
                    });
                    return;
                }
                console.log(response.data);
                localStorage.setItem("userData", JSON.stringify(response.data)); // Fix the typo here
                getUserPlan(response.data.USERID);
                login(response.data.Username); // Call the login function with the username


                setUserId(response.data);
                navigating();
            })
            .catch((error) => {
                console.error(error);
            })
    }

    return (
        <>
            <ToastContainer />
            <Row className="gx-2">
                <Col><Button variant="" className="btn-google" onClick={handleGoogleSignIn}><i className="ri-google-fill"></i> Google</Button></Col>
            </Row>
        </>
    );
};

export default GoogleSignIn;