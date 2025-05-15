import React from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Backdrop } from "@mui/material";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { ToastContainer, toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoogleSign from "../docs/GSignIn.js";
import { useUser } from "../userContext";
import getUserPlan from "../config/getUserPlan.js";

export default function Signin() {
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const baseurl = process.env.REACT_APP_API;
    const { login } = useUser();

    const handleSubmit = async () => {
        setOpen(true);
        await axios.post(baseurl+"/api/BUSS/auth/signin", {
            username: username,
            password: password
        }).then((res) => {
            // user already exists
            if(res.status === 400) {
                toast.warn("User already exists", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Flip
                });
                setOpen(false);
                return;
            }
            console.log(res.data);
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
            });
            console.log(res.data.data);
            localStorage.setItem("userData", JSON.stringify(res.data.data));
            getUserPlan(res.data.data.USERID);
        
            setTimeout(() => {
                setOpen(false);
                login(res.data.data.USERID);
                window.location.href = "/admin/Home";
            }, 5000);
        
        }).catch((err) => {
            console.log(err);
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
            });
            setOpen(false);
        })
    }

    return (
        <> 
            <ToastContainer />
            <div className="page-sign">
                <Backdrop
                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                    open={open}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Card className="card-sign">
                    <Card.Header>
                        <Link to="#" className="header-logo mb-4">Twitter24</Link>
                        <Card.Title>Sign In</Card.Title>
                        <Card.Text>Welcome back! Please signin to continue.</Card.Text>
                    </Card.Header>
                    <Card.Body>
                        <div className="mb-4">
                            <Form.Label >Username / Email</Form.Label>
                            <Form.Control type="text" placeholder="Enter your Username"
                                value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <Form.Label className="d-flex justify-content-between">Password <Link to="">Forgot password?</Link></Form.Label>
                            <Form.Control type="password" placeholder="Enter your password"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button type="submit" variant="primary" className="btn-sign"
                            onClick={handleSubmit}
                        >Sign In</Button>
                        <div className="divider"><span>or sign in with</span></div>
                        <Row className="gx-2">
                            <Col>
                                <GoogleSign setOpen={setOpen}/>
                            </Col>
                        </Row>
                    </Card.Body>
                    <Card.Footer>
                        Don't have an account? <Link to="/admin/pages/signup2">Create an Account</Link>
                    </Card.Footer>
                </Card>
            </div>
        </>
    )
}