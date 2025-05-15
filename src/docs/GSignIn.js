import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Button, Col, Row } from 'react-bootstrap';

import { auth } from '../config/firebase';

import axios from 'axios';

import { useUser } from '../userContext';
import { toast, Flip } from 'react-toastify';
import getUserPlan from '../config/getUserPlan';


const GoogleSign = ({ setOpen }) => {
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
                handleSubmit(user.providerData[0].email);
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

    const handleSubmit = async (username) => {
        setOpen(true);
        await axios.post(baseurl + "/api/BUSS/auth/signin-google", {
            username: username
        }).then((res) => {
            toast.success("Signin successfully", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Flip
            })

            localStorage.setItem("userData", JSON.stringify(res.data.data));
            getUserPlan(res.data.data.USERID);

            login(res.data.data.Username);



            setTimeout(() => {
                window.location.href = "/admin/Home";
            }, 2000);
        }).catch((err) => {
            console.log(err);
            setOpen(false);
            toast.error("Invalid username or password", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Flip
            })
        })
    }

    return (
        <>
            <Row className="gx-2">
                <Col><Button variant="" className="btn-google" onClick={handleGoogleSignIn}><i className="ri-google-fill"></i> Google</Button></Col>
            </Row>
        </>
    );
};

export default GoogleSign;