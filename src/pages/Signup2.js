import React, { useEffect } from "react";
import { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
// import bg1 from "../assets/img/bg1.jpg";
import bg2 from "../assets/img/danist-soh-dqXiw7nCb9Q-unsplash.jpg"
import GoogleSignIn from "../docs/GoogleSignUp";
import { FaCheck } from "react-icons/fa6";
import { FaXmark } from "react-icons/fa6";
import axios from "axios";
import { useLoadingBar } from "react-top-loading-bar";
import OtpInput from 'react-otp-input';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useUser } from "../userContext";
import { Toaster, toast } from "react-hot-toast";
import getUserPlan from "../config/getUserPlan";

export default function Signup2() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [strength, setStrength] = useState("");
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);
  const [emailStrength, setEmailStrength] = useState(false);
  const [emailFound, setEmailFound] = useState(false);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [cansend, setCanSend] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [showBtnLoading, setShowBtnLoading] = useState(false);
  const [blockBtn, setBlockBtn] = useState(false);
  const [disableSome, setDisableSome] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [AllUsers, setAllUsers] = useState([]);

  const { setUserId } = useUser();

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };


  const baseurl = process.env.REACT_APP_API;

  const handleMailChange = (e) => {
    const mail = e.target.value;
    if (mail.length === 0 || mail === "" || mail === null) {
      setEmail("");
      setEmailStrength(false);
      return;
    }
    setEmail(mail);
    const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (mailRegex.test(mail)) {
      if (isThere(mail)) {
        setCanSend(false);
        setShowButton(false);
        setEmailTaken(true);
      } else {
        setCanSend(true);
        setShowButton(true);
        setEmailTaken(false);
      }
      setEmailStrength(false);
    }
    else {
      setEmailStrength(true);
    }
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    switch (strength) {
      case 1:
      case 2:
        return "Weak";
      case 3:
      case 4:
        return "Moderate";
      case 5:
      case 6:
        return "Strong";
      default:
        return "Very Weak";
    }
  }

  const { start, complete } = useLoadingBar({
    color: '#F01846',
    height: 5,
    start: "static",
  });

  const handlePasswordChange = (e) => {
    const pass = e.target.value;
    if (pass.length === 0 || pass === "" || pass === null) {
      setStrength("");
      return;
    }
    const strength = getPasswordStrength(pass);
    setStrength(strength);
    setPassword(pass);
  }

  const handleUsernameChange = (e) => {
    const user = e.target.value;
    // console.log(user);
    if (user.length === 0 || user === "" || user === null) {
      setUsername("");
      return;
    }
    setUsername(user);
    // Check if username is taken setUsernameTaken(true);
    isThere(user) ? setUsernameTaken(true) : setUsernameTaken(false);
    if(isThere(user)) {
      toast.error("Username already taken. Please try another one");
    }
  }

  const sendMail = async () => {
    start();
    if (email === "" || email === null || email.length === 0 || !email.includes("@") || username === "" || username === null || username.length === 0) {
      complete();
      return;
    }
    setShowBtnLoading(true);
    setShowOtpField(true);
    setBlockBtn(true);
    console.log("Sending mail to ", email);
    console.log(baseurl + "/api/BUSS/send-creation-mail");
    await axios.post(baseurl + "/api/BUSS/send-creation-mail", { username: username, email: email })
      .then((response) => {
        toast.success("Mail sent successfully");
        complete();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Mail not sent. Please try again later");
        setBlockBtn(false);
        complete();
      })

    // setCanSend(false);
    // setShowBtnLoading(false);
  }

  useEffect(() => {
    if (otp.length === 6) {
      setShowOtpField(false);
      setShowBtnLoading(true);
      axios.get(baseurl + "/api/BUSS/account-creation-verify-otp/" + otp + '/' + email)
        .then((res) => {
          if (res.status === 200) {
            toast.success("OTP Verified Successfully");
            setIsEmailVerified(true);
            setCanSend(false);
            setShowButton(false);
            setDisableSome(true);
          } else if (res.status === 401) {
            toast.error("OTP Expired. Please try again")
            setShowOtpField(true);
          } else if (res.status === 400) {
            toast.error("Invalid OTP. Please try again");
            setShowOtpField(true);
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error("OTP Verification Failed. Please try again");
          setShowOtpField(true);
        })
        .finally(() => {
          setShowBtnLoading(false);
        });
    }
  }, [otp]);


  const CreateAccount = (e) => {
    e.preventDefault();
    // validate the password, full name and contact number and dump data to the server
    if (username === "" || username === null || username.length === 0) {
      toast.error("Username is invalid");
      return;
    }
    if (!isEmailVerified) {
      toast.error("Please verify your email before creating an account");
      return;
    }
    if (name === "" || name === null || name.length === 0) {
      toast.error("Full Name is invalid");
      return;
    }
    if (number === "" || number === null || number.length === 0 || number.length < 10) {
      toast.error("Contact Number is invalid");
      return;
    }
    if (strength === "Weak" || strength === "Very Weak") {
      toast.error("Password is too weak");
      return;
    }
    // console.log(password);
    handleDumpData();
  }

  const { login } = useUser();

  const handleDumpData = async () => {
    start();
    await axios.post(baseurl + "/api/BUSS/create-new-BO-account", {
      Username: username,
      Email: email,
      Password: password,
      Fullname: name,
      Contact: number
    })
      .then((response) => {

        console.log(response.data);
        localStorage.setItem("userData", JSON.stringify(response.data));
        getUserPlan(response.data.USERID);

        login(response.data.Username);
        setUserId(response.data);
        complete();
        navigating();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Account Creation Failed. Please try again");
        complete();
      })
  }

  const navigating = () => {
    toast.success("Account Created");
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
      window.location.href = '/admin/Home';
    }, 5000);
  }



  useEffect(() => {
    axios.get(baseurl + '/api/BUSS/isNameThere')
      .then((res) => {
        // console.log(res.data);
        setAllUsers(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
  }, []);

  const isThere = (value) => {
    if (Array.isArray(AllUsers)) return AllUsers.some(user => user.Email === value || user.Username === value);
    return false;
  }

  return (
    <>
      <Toaster toastOptions={{ style: { fontSize: '16px' } }} />
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="page-sign d-block py-0">
        <Row className="g-0">
          <Col md="7" lg="5" xl="6" className="col-wrapper">
            <Card className="card-sign" style={{ width: "60%" }}>
              <Card.Header>
                <Link to="#" className="header-logo mb-4">twitter24</Link>
                <Card.Title>Sign Up</Card.Title>
                <Card.Text>It's free and only takes a minute to signup.</Card.Text>
              </Card.Header>
              <Card.Body>
                <div className="mb-2" style={{ position: 'relative' }}>
                  <Form.Label>Username*</Form.Label>
                  <Form.Control
                    type="text"
                    disabled={disableSome}
                    placeholder="Enter your Username"
                    onChange={(e) => handleUsernameChange(e)}
                  />
                  {username && <span style={{ position: 'absolute', right: '10px', top: '70%', transform: 'translateY(-50%)' }}>
                    {usernameTaken ? <FaXmark size={20} color="red" /> : <FaCheck size={20} color="green" />}
                  </span>}
                </div>
                <div className="mb-2">
                  <Form.Label>Email*</Form.Label>
                  <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
                    <Form.Control type="text" placeholder="Enter your email address" onChange={handleMailChange} value={email} disabled={disableSome} />
                    {email && <span style={{ position: 'absolute', right: '5%', top: "50%", transform: 'translateY(-50%)' }}>
                      {emailTaken ? <FaXmark size={20} color="red" /> : <FaCheck size={20} color="green" />}
                    </span>}
                  </div>
                  <div style={{ height: '20px' }}>
                    {emailStrength && <p style={{ color: 'red', fontSize: 10 }}>Enter a Valid Mail</p>}
                  </div>
                  {cansend &&
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      {showOtpField ?
                        <OtpInput
                          value={otp}
                          placeholder="_CODE_"
                          onChange={setOtp}
                          numInputs={6}
                          renderSeparator={<span style={{ paddingInline: "2px" }}></span>}
                          renderInput={(props) => props ? <input {...props} style={{ width: "40px", height: "40px", display: "flex", justifyContent: "center", textAlign: "center" }} /> : null}
                        /> : <div></div>
                      }
                      {showButton && <Button style={{ width: "fit-content", margin: "10px" }}
                        onClick={() => sendMail()}
                        disabled={blockBtn}
                      >Verify</Button>}
                    </div>}
                  {emailFound && <p style={{ color: "red", fontSize: 10 }}>
                    An account already exists with this email address. Please try logging in or use a different email to sign up.
                  </p>}
                </div>
                <div className="mb-2">
                  <Form.Label>Password* (&gt;6, &lt;20)</Form.Label>
                  <Form.Control type="password" placeholder="Enter your password" onChange={handlePasswordChange} />
                  <div style={{ minHeight: '10px' }}>
                    <p style={{ color: strength === "Strong" ? "green" : strength === "Moderate" ? "orange" : "red", fontSize: 10 }}>{strength}</p>
                  </div>
                </div>
                <div className="mb-2">
                  <Form.Label>Full Name*</Form.Label>
                  <Form.Control type="text" placeholder="Enter your name" onChange={(e) => setName(e.target.value)} value={name} />
                </div>
                <div className="mb-2">
                  <Form.Label>Contact Number*</Form.Label>
                  <Form.Control type="text" placeholder="Enter your number" onChange={(e) => setNumber(e.target.value)} value={number} />
                </div>

                <div className="mb-3">
                  <small>By clicking <strong>Create Account</strong> below, you agree to our terms of service and privacy statement.</small>
                </div>
                <Button variant="primary" className="btn-sign" onClick={(e) => CreateAccount(e)}>Create Account</Button>

                <div className="divider"><span>or sign up using</span></div>

                <GoogleSignIn navigating={navigating} />
              </Card.Body>
              <Card.Footer>
                Already have an account? <Link to="/pages/signin">Sign In</Link>
              </Card.Footer>
            </Card>
          </Col>
          <Col className="d-none d-md-block">
            <img src={bg2} className="auth-img" alt="" />
          </Col>
        </Row>
      </div>
    </>
  );
}