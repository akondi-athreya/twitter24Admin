import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Col, Nav, Row } from "react-bootstrap";
import Footer from "../layouts/Footer";
import HeaderMobile from "../layouts/HeaderMobile";
import Avatar from "../components/Avatar";
import axios from "axios";


export default function Profile() {
    // User data from your inputs

    const userData = JSON.parse(localStorage.getItem("userData"));
    const baseurl = process.env.REACT_APP_API;
    // const userData = {
    //     Contact: "1234567890",
    //     Email: "gexivi6846@lassora.com",
    //     Fullname: "Sriram",
    //     USERID: "ifwjJu",
    //     Username: "Sriram",
    //     createdAt: "2025-03-05T19:15:01.246Z"
    // };
    const [userplan, setUserPlan] = useState('');
    const [followerscount, setFollowersCount] = useState(0);
    useEffect(() => {
        axios.get(baseurl+'/api/user/get_user_plan/'+userData.USERID)
        .then((res)=>{
            console.log(res.data);
            localStorage.setItem("userPlan",JSON.stringify(res.data));
            if(res.data[0].plan === 'none')  setUserPlan('Newbie');
            else if(res.data[0].plan === 'Base') setUserPlan('Base');
            else if(res.data[0].plan === 'Premium') setUserPlan('Premium');
            else if(res.data[0].plan === 'Premium Pro') setUserPlan('Premium Pro');
            else setUserPlan('Newbie');
        })
        .catch((err)=>{
            console.log(err);
        })

        axios.get(baseurl+'/api/follow/totalfollowers/'+userData.USERID)
        .then((res)=>{
            console.log(res.data.totalFollowers);
            setFollowersCount(res.data.totalFollowers);
        })
        .catch((err)=>{
            console.log(err);
        })
    },[userData])

    // Format the creation date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const memberSince = formatDate(userData.createdAt);
    const daysSinceMember = Math.floor((new Date() - new Date(userData.createdAt)) / (1000 * 60 * 60 * 24));

    return (
        <React.Fragment>
            <HeaderMobile />
            <div className="main p-4 p-lg-5">
                <Row className="g-5">
                    <Col xl>
                        <div className="media-profile mb-5">
                            {/* <div className="media-img mb-3 mb-sm-0">
                                <img src={img1} className="img-fluid" alt="Profile" />
                            </div> */}
                            <div className="media-body">
                                <h5 className="media-name">{userData.Fullname}</h5>
                                <p className="d-flex gap-2 mb-4">
                                    <i className="ri-user-follow-line"></i> @{userData.Username} • Member since {memberSince}
                                </p>
                                <p className="mb-0">
                                    Welcome to your profile! I'm excited to connect with others and share my journey here.
                                    {/* <Link to=""> Edit bio</Link> */}
                                </p>
                            </div>
                        </div>

                        <Row className="row-cols-sm-auto g-4 g-md-5 g-xl-4 g-xxl-5">
                            {[
                                {
                                    "icon": "ri-calendar-line",
                                    "text": `${daysSinceMember} days`,
                                    "label": "Member for"
                                }, {
                                    "icon": "ri-user-star-line",
                                    "text": userData.USERID,
                                    "label": "User ID"
                                }, {
                                    "icon": "ri-team-line",
                                    "text": followerscount,
                                    "label": "Followers"
                                },
                                {
                                    "icon": "ri-user-star-line",
                                    "text": userplan,
                                    "label": "Plan"
                                }
                            ].map((profileItem, index) => (
                                <Col key={index}>
                                    <div className="profile-item">
                                        <i className={profileItem.icon}></i>
                                        <div className="profile-item-body">
                                            <p>{profileItem.text}</p>
                                            <span>{profileItem.label}</span>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>

                        <Nav className="nav-line mt-5">
                            <Nav.Link href="" className="active">Posts &amp; Activity</Nav.Link>
                            {/* <Nav.Link href="">Personal Information</Nav.Link>
                            <Nav.Link href="">Connections</Nav.Link>
                            <Nav.Link href="">Profile Settings</Nav.Link> */}
                        </Nav>

                        {/* <div className="post-bar mt-4">
                            <div className="post-bar-item gap-2">
                                <i className="ri-edit-2-line"></i>
                                <Link to="">Share an update</Link>
                            </div>
                            <div className="post-bar-item">
                                <Link to=""><i className="ri-image-line"></i></Link>
                            </div>
                            <div className="post-bar-item">
                                <Link to=""><i className="ri-vidicon-line"></i></Link>
                            </div>
                            <div className="post-bar-item">
                                <Link to=""><i className="ri-article-line"></i></Link>
                            </div>
                        </div> */}

                        <Card className="card-post mt-4">
                            <Card.Header>
                                <Card.Title>Welcome Message</Card.Title>
                                <Link to="" className="link-more"><i className="ri-more-2-fill"></i></Link>
                            </Card.Header>
                            <Card.Body>
                                <div className="post-header mb-3">
                                    <Link to=""><Avatar initial={userData.Username.charAt(0)} status="online" /></Link>
                                    <div className="post-content">
                                        <h6>{userData.Fullname}</h6>
                                        <span>New Member</span>
                                    </div>
                                    <span className="post-date">Just joined</span>
                                </div>
                                <p className="post-text">
                                    Hello everyone! I'm {userData.Fullname} and I just joined this platform. Looking forward to connecting with all of you and sharing experiences. Feel free to reach out! <Link to="">#newmember</Link> <Link to="">#introduction</Link>
                                </p>
                            </Card.Body>
                            <Card.Footer>
                                <Nav>
                                    <Nav.Link href=""><i className="ri-thumb-up-line"></i> Like</Nav.Link>
                                    <Nav.Link href=""><i className="ri-chat-1-line"></i> Comment</Nav.Link>
                                    <Nav.Link href=""><i className="ri-share-forward-line"></i> Share</Nav.Link>
                                </Nav>
                            </Card.Footer>
                        </Card>

                        <Card className="card-post mt-4">
                            <Card.Header>
                                <Card.Title>About Me</Card.Title>
                                <Link to="" className="link-more"><i className="ri-more-2-fill"></i></Link>
                            </Card.Header>
                            <Card.Body>
                                <div className="experience-item">
                                    <div className="experience-icon"><i className="ri-user-line"></i></div>
                                    <div className="experience-body">
                                        <h5>Profile Status</h5>
                                        <p>New Member</p>
                                        <p>Joined on {memberSince}</p>
                                    </div>
                                </div>
                            </Card.Body>
                            <Card.Footer>
                                <Nav>
                                    <Nav.Link href="">Edit profile <i className="ri-edit-box-line"></i></Nav.Link>
                                </Nav>
                            </Card.Footer>
                        </Card>

                        {/* <Card className="card-post mt-4">
                            <Card.Header>
                                <Card.Title>Interests</Card.Title>
                                <Link to="" className="link-more"><i className="ri-more-2-fill"></i></Link>
                            </Card.Header>
                            <Card.Body>
                                <p className="text-center py-4">You haven't added any interests yet. Add some to connect with like-minded people.</p>
                                <div className="d-flex justify-content-center">
                                    <button className="btn btn-primary">
                                        <i className="ri-add-line me-2"></i>Add Interests
                                    </button>
                                </div>
                            </Card.Body>
                        </Card> */}
                    </Col>
                    {/* <Col xl="4" xxl="3" className="d-none d-xl-block">
                        <h5 className="section-title mb-4">Profile Completion</h5>
                        <div className="card p-3 mb-4">
                            <div className="progress mb-3">
                                <div className="progress-bar bg-primary" role="progressbar" style={{ width: "25%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>
                            </div>
                            <p>Complete your profile to connect with more people and opportunities.</p>
                            <button className="btn btn-sm btn-outline-primary">Update Profile</button>
                        </div>

                        <h5 className="section-title mb-4">Mutual Connections</h5>
                        <div className="profile-mutual">
                            <p className="text-muted">You don't have any mutual connections yet. Start connecting with people to grow your network.</p>
                            <button className="btn btn-sm btn-outline-primary mt-2">Find Connections</button>
                        </div>

                        <hr className="my-4 opacity-0" />

                        <h5 className="section-title mb-4">People You May Know</h5>
                        <ul className="people-group">
                            {[
                                {
                                    "avatar": img6,
                                    "name": "Allan Rey Palban",
                                    "position": "Senior Business Analyst"
                                }, {
                                    "avatar": img7,
                                    "name": "Adrian Moniño",
                                    "position": "Software Engineer"
                                }, {
                                    "avatar": img8,
                                    "name": "Charlene Plateros",
                                    "position": "Sales Representative"
                                }
                            ].map((people, index) => (
                                <li className="people-item" key={index}>
                                    <Avatar img={people.avatar} />
                                    <div className="people-body">
                                        <h6><Link to="">{people.name}</Link></h6>
                                        <span>{people.position}</span>
                                    </div>
                                    <button className="btn btn-sm btn-outline-primary">Connect</button>
                                </li>
                            ))}
                        </ul>

                        <hr className="my-4 opacity-0" />

                        <h5 className="section-title mb-4">Contact Information</h5>
                        <ul className="list-contact-info">
                            <li><i className="ri-smartphone-fill"></i><span>{userData.Contact}</span></li>
                            <li><i className="ri-mail-fill"></i><span>{userData.Email}</span></li>
                            <li><i className="ri-user-3-fill"></i><span>@{userData.Username}</span></li>
                            <li><i className="ri-time-fill"></i><span>Member since {memberSince}</span></li>
                        </ul>

                        <hr className="my-4 opacity-0" />

                        <div className="card p-3 mt-4">
                            <h5 className="section-title mb-3">Complete Your Profile</h5>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Add profile picture
                                    <i className="ri-add-circle-line text-primary"></i>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Add bio information
                                    <i className="ri-add-circle-line text-primary"></i>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Add social profiles
                                    <i className="ri-add-circle-line text-primary"></i>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Add work experience
                                    <i className="ri-add-circle-line text-primary"></i>
                                </li>
                            </ul>
                        </div>
                    </Col> */}
                </Row>
                <Footer />
            </div>
        </React.Fragment>
    );
}