import React from 'react'
import { useState, useEffect } from 'react';
import Header from '../layouts/Header';
import { Form, Card, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import toast, { ToastBar, Toaster } from 'react-hot-toast';

const BroadCast = () => {
    const currentSkin = (localStorage.getItem('skin-mode')) ? 'dark' : '';
    const [skin, setSkin] = useState(currentSkin);
    const baseurl = process.env.REACT_APP_API;
    const [banner, setBanner] = useState('');
    const [video, setVideo] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Fetch current banner/video
    useEffect(() => {
        fetchBanner();
    }, []);

    const fetchBanner = () => {
        axios.get(baseurl + '/api/imagePath')
            .then(response => {
                const imagePath = response.data.company.image;
                setBanner(imagePath);
                setVideo(imagePath.split('.').pop() === 'mp4' || imagePath.split('.').pop() === 'webm' || imagePath.split('.').pop() === 'ogg');
            })
            .catch(error => {
                if (error.response === undefined) {
                    toast.error('No banner found', {
                        position: "top-center",
                        theme: "colored",
                        style: {
                            fontSize: '1.1rem',
                        },
                    });
                } else {
                    toast.error('Error fetching banner', {
                        position: "top-center",
                        theme: "colored"
                    });
                }
            });
    }

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const uploadBanner = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            toast.error('Please select a file to upload.', {
                position: "top-center",
                theme: "colored"
            });
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('banner', selectedFile);

        await axios.post(baseurl + '/api/uploadBanner', formData)
            .then((res) => {
                toast.success('Banner Uploaded Successfully', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                setSelectedFile(null);
                fetchBanner(); // Refresh banner after upload
            })
            .catch((err) => {
                console.log(err);
                toast.error('Upload Failed', {
                    position: "top-center",
                    theme: "colored",
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }

    // Delete banner function
    const deleteBanner = async (e) => {
        e.preventDefault();
        if (!banner) {
            toast.error('No banner to delete', {
                position: "top-center",
                theme: "colored",
            });
            return;
        }

        setDeleteLoading(true);

        await axios.delete(baseurl + '/api/deleteBanner')
            .then((res) => {
                toast.success('Banner Deleted Successfully', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                setBanner('');
                setVideo(false);
            })
            .catch((err) => {
                console.log(err);
                toast.error('Delete Failed', {
                    position: "top-center",
                    theme: "colored",
                });
            })
            .finally(() => {
                setDeleteLoading(false);
            });
    }

    return (
        <>
            <Header onSkin={setSkin} />
            <Toaster />
            <div className="main main-app p-3 p-lg-4">
                <Container>
                    <Row className="mb-4">
                        <Col>
                            <div className='all_title'>
                                <h1>Company Broadcasts</h1>
                                
                            </div>
                        </Col>
                    </Row>

                    {/* Current banner/video display section */}
                    {banner && (
                        <Row className="mb-5">
                            <Col>
                                <Card className="border-0 shadow-sm">
                                    <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                                        <h5 className="m-0">Current Announcement</h5>
                                        <Button
                                            variant="outline-light"
                                            size="sm"
                                            onClick={(e) => deleteBanner(e)}
                                            disabled={deleteLoading}
                                        >
                                            {deleteLoading ? 'Deleting...' : 'Delete'}
                                        </Button>
                                    </Card.Header>
                                    <Card.Body className="p-0">
                                        {video ? (
                                            <div className="ratio ratio-16x9">
                                                <iframe
                                                    src={`${baseurl}${banner}?autoplay=1&mute=1&loop=1&playlist=${banner}`}
                                                    title="Company Announcements"
                                                    allow="autoplay; encrypted-media"
                                                    allowFullScreen
                                                ></iframe>
                                            </div>
                                        ) : (
                                            <div className="text-center p-3">
                                                <img
                                                    src={`${baseurl}${banner}`}
                                                    alt='Company Announcements'
                                                    className='img-fluid'
                                                    style={{ maxHeight: '400px' }}
                                                />
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )}

                    {/* Upload new banner section */}
                    <Row className="mt-4">
                        <Col lg={8} className="mx-auto">
                            <Card className="border-0 shadow-sm">
                                <Card.Header className="bg-light">
                                    <h5 className="m-0">Upload New Announcement</h5>
                                </Card.Header>
                                <Card.Body className="p-4">
                                    <Form.Group controlId="formFile" className="mb-4">
                                        <Form.Label>Select Image or Video</Form.Label>
                                        <Form.Control
                                            type="file"
                                            onChange={handleFileChange}
                                            accept="image/*, video/*"
                                        />
                                        <Form.Text className="text-muted">
                                            Supported formats: Images (JPG, JPEG, PNG) and Videos (MP4, WEBM, OGG)
                                        </Form.Text>
                                    </Form.Group>
                                    <div className="d-flex justify-content-center">
                                        <Button
                                            variant="primary"
                                            onClick={(e) => uploadBanner(e)}
                                            disabled={loading || !selectedFile}
                                            className="px-4"
                                        >
                                            {loading ? 'Uploading...' : 'Upload'}
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default BroadCast