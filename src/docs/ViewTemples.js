"use client"

import { useState, useEffect } from "react"
import Header from "../layouts/Header"
import "./viewtemple.css"
import axios from "axios"
import { Toaster, toast } from "react-hot-toast"
import { Modal, Button, Form } from "react-bootstrap"
import { Pagination } from "react-bootstrap"

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar, A11y } from "swiper/modules";

import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/scrollbar"

const ViewTemples = () => {
    const currentSkin = localStorage.getItem("skin-mode") ? "dark" : ""
    const [skin, setSkin] = useState(currentSkin)
    const baseurl = process.env.REACT_APP_API
    const { USERID } = JSON.parse(localStorage.getItem("userData"))
    const [temples, setTemples] = useState([])

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [templesPerPage] = useState(3)
    const [totalPages, setTotalPages] = useState(0)

    // State for edit modal
    const [showEditModal, setShowEditModal] = useState(false)
    const [currentTemple, setCurrentTemple] = useState(null)
    const [editFormData, setEditFormData] = useState({
        name: "",
        description: "",
        location: "",
        photos: [],
        audio: [],
    })

    // State for delete confirmation modal
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [templeToDelete, setTempleToDelete] = useState(null)

    // State for tracking files to keep
    const [keepPhotos, setKeepPhotos] = useState([])
    const [keepAudio, setKeepAudio] = useState([])

    // State for new files
    const [newPhotos, setNewPhotos] = useState([])
    const [newAudio, setNewAudio] = useState([])
    const [loading, setLoading] = useState(true)

    // Preview states
    const [photoPreviewUrls, setPhotoPreviewUrls] = useState([])
    const [audioPreviewUrls, setAudioPreviewUrls] = useState([])

    useEffect(() => {
        fetchTemples()
    }, [baseurl, USERID])

    useEffect(() => {
        if (temples.length > 0) {
            setTotalPages(Math.ceil(temples.length / templesPerPage))
        }
    }, [temples, templesPerPage])

    const fetchTemples = () => {
        setLoading(true)
        axios
            .get(`${baseurl}/api/get/temples/${USERID}`)
            .then((res) => {
                const updatedTemples = res.data.temples.map((temple) => {
                    temple.photos = temple.photos.map((photo) => photo.replace("public", ""))
                    temple.audio = temple.audio.map((aa) => aa.replace("public", ""))
                    return temple
                })
                setTemples(updatedTemples)
                setLoading(false)
            })
            .catch((err) => {
                console.error(err)
                setLoading(false)
                toast.error("Failed to fetch temples")
            })
    }

    // Get current temples for pagination
    const indexOfLastTemple = currentPage * templesPerPage
    const indexOfFirstTemple = indexOfLastTemple - templesPerPage
    const currentTemples = temples.slice(indexOfFirstTemple, indexOfLastTemple)

    // Change page
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    // Handle opening edit modal
    const handleEdit = (temple) => {
        setCurrentTemple(temple)
        setEditFormData({
            name: temple.name,
            description: temple.description,
            location: temple.location,
        })

        // Set photos and audio to keep
        setKeepPhotos(temple.photos.map((photo) => `public${photo}`))
        setKeepAudio(temple.audio.map((audio) => `public${audio}`))

        // Reset new files
        setNewPhotos([])
        setNewAudio([])
        setPhotoPreviewUrls([])
        setAudioPreviewUrls([])

        setShowEditModal(true)
    }

    // Handle opening delete confirmation modal
    const handleDeleteConfirm = (temple) => {
        setTempleToDelete(temple)
        setShowDeleteModal(true)
    }

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setEditFormData({ ...editFormData, [name]: value })
    }

    // Handle photo selection
    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files)
        setNewPhotos(files)

        // Create preview URLs
        const urls = files.map((file) => URL.createObjectURL(file))
        setPhotoPreviewUrls(urls)
    }

    // Handle audio selection
    const handleAudioChange = (e) => {
        const files = Array.from(e.target.files)
        setNewAudio(files)

        // Create preview URLs
        const urls = files.map((file) => URL.createObjectURL(file))
        setAudioPreviewUrls(urls)
    }

    // Handle removing a photo from keep list
    const handleRemovePhoto = (photoPath) => {
        setKeepPhotos(keepPhotos.filter((photo) => photo !== photoPath))
    }

    // Handle removing an audio from keep list
    const handleRemoveAudio = (audioPath) => {
        setKeepAudio(keepAudio.filter((audio) => audio !== audioPath))
    }

    // Handle form submission for update
    const handleUpdate = (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append("name", editFormData.name)
        formData.append("description", editFormData.description)
        formData.append("location", editFormData.location)
        formData.append("keepPhotos", JSON.stringify(keepPhotos))
        formData.append("keepAudio", JSON.stringify(keepAudio))

        // Append new photos
        newPhotos.forEach((photo) => {
            formData.append("photos", photo)
        })

        // Append new audio files
        newAudio.forEach((audio) => {
            formData.append("audio", audio)
        })

        toast.promise(
            axios
                .put(`${baseurl}/api/update/temple/${currentTemple._id}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then(() => {
                    setShowEditModal(false)
                    fetchTemples()
                }),
            {
                loading: "Updating temple...",
                success: "Temple updated successfully!",
                error: "Failed to update temple",
            },
        )
    }

    // Handle temple deletion
    const handleDelete = () => {
        toast.promise(
            axios.delete(`${baseurl}/api/delete/temple/${templeToDelete._id}`).then(() => {
                setShowDeleteModal(false)
                fetchTemples()
            }),
            {
                loading: "Deleting temple...",
                success: "Temple deleted successfully!",
                error: "Failed to delete temple",
            },
        )
    }

    return (
        <>
            <Header onSkin={setSkin} />
            <Toaster />
            <Backdrop
                sx={{ color: '#fff', zIndex: 9999 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className="main main-app p-3 p-lg-4">
                <div className="temple_title">
                    <h1>View Temples</h1>
                </div>
                <div className="temple_list">
                    {currentTemples.length > 0 ? (
                        currentTemples.map((temple, index) => (
                            <div className="temple_view_card" key={index}>
                                <div className="temple_card_details">
                                    <h3>{temple.name}</h3>
                                    <p>{temple.description}</p>
                                    <a href={temple.location} target="_blank" rel="noreferrer">
                                        location on map
                                    </a>
                                    <div className="temple_card_audio">
                                        {temple.audio.length > 0 &&
                                            temple.audio.map((item, index) => (
                                                <div key={index}>
                                                    <audio controls>
                                                        <source src={`${baseurl}/${item}`} type="audio/mpeg" />
                                                    </audio>
                                                </div>
                                            ))}
                                    </div>
                                    <div className="temple_card_actions">
                                        <button className="btn btn-primary btn-sm" onClick={() => handleEdit(temple)}>
                                            Edit
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteConfirm(temple)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <div className="temple_card_media">
                                    <Swiper
                                        modules={[Navigation, Scrollbar, A11y]}
                                        spaceBetween={0}
                                        slidesPerView={1}
                                        navigation
                                    >
                                        {temple.photos.length > 0 &&
                                            temple.photos.map((photo, index) => (
                                                <SwiperSlide key={index}>
                                                    <img src={`${baseurl}/${photo}`} alt={temple.name} height={200} />
                                                </SwiperSlide>
                                            ))}
                                    </Swiper>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no_temples">
                            <h3>Please Until we fecth the temple data.</h3>
                        </div>
                    )}
                </div>

                {/* Pagination at the bottom */}
                {temples.length > templesPerPage && (
                    <div className="pagination_container d-flex justify-content-center mt-4">
                        <Pagination>
                            <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />

                            {[...Array(totalPages).keys()].map(number => (
                                <Pagination.Item
                                    key={number + 1}
                                    active={number + 1 === currentPage}
                                    onClick={() => handlePageChange(number + 1)}
                                >
                                    {number + 1}
                                </Pagination.Item>
                            ))}

                            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                            <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                        </Pagination>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Temple</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdate}>
                        <Form.Group className="mb-3">
                            <Form.Label>Temple Name</Form.Label>
                            <Form.Control type="text" name="name" value={editFormData.name} onChange={handleInputChange} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={editFormData.description}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Location (Link)</Form.Label>
                            <Form.Control
                                type="url"
                                name="location"
                                value={editFormData.location}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Current Photos</Form.Label>
                            <div className="current_photos">
                                {keepPhotos.length > 0 ? (
                                    <div className="photo_grid">
                                        {keepPhotos.map((photo, index) => (
                                            <div key={index} className="photo_item">
                                                <img
                                                    src={`${baseurl}/${photo.replace("public", "")}`}
                                                    alt={`Temple photo ${index}`}
                                                    className="thumbnail"
                                                />
                                                <button type="button" className="remove_btn" onClick={() => handleRemovePhoto(photo)}>
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No photos to display</p>
                                )}
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Add New Photos</Form.Label>
                            <Form.Control type="file" accept="image/*" multiple onChange={handlePhotoChange} />
                            {photoPreviewUrls.length > 0 && (
                                <div className="photo_preview mt-2">
                                    {photoPreviewUrls.map((url, index) => (
                                        <img key={index} src={url || "/placeholder.svg"} alt={`New photo ${index}`} className="thumbnail" />
                                    ))}
                                </div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Current Audio Files</Form.Label>
                            <div className="current_audio">
                                {keepAudio.length > 0 ? (
                                    <div className="audio_list">
                                        {keepAudio.map((audio, index) => (
                                            <div key={index} className="audio_item">
                                                <audio controls>
                                                    <source src={`${baseurl}/${audio.replace("public", "")}`} type="audio/mpeg" />
                                                </audio>
                                                <button type="button" className="remove_btn" onClick={() => handleRemoveAudio(audio)}>
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No audio files to display</p>
                                )}
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Add New Audio Files</Form.Label>
                            <Form.Control type="file" accept="audio/*" multiple onChange={handleAudioChange} />
                            {audioPreviewUrls.length > 0 && (
                                <div className="audio_preview mt-2">
                                    {audioPreviewUrls.map((url, index) => (
                                        <div key={index} className="audio_item">
                                            <audio controls>
                                                <source src={url} type="audio/mpeg" />
                                            </audio>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the temple "{templeToDelete?.name}"? This action cannot be undone and all
                    associated files will be permanently deleted.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ViewTemples