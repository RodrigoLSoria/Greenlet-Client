import React, { useEffect, useState } from 'react'
import { Form, Button, Card } from 'react-bootstrap'
import * as Constants from '../../consts/consts'
import postsService from '../../services/posts.services'
import uploadServices from '../../services/upload.services'

const NewToolPostForm = ({ previousToolsPostData, setShowMainFormModal }) => {

    const emptyToolsPostFrom = {
        image: '',
        title: '',
        location: {},
        equipmentType: '',
        condition: '',
        otherNotes: '',
        decorativeAndMiscellaneous: '',
        potsAndContainers: '',
        wateringEquipment: '',
        gardeningTools: '',
        plantCare: '',
        propagationAndSupport: '',
        monitoringTools: ''

    }

    const [postData, setPostData] = useState(emptyToolsPostFrom)
    const [loadingImage, setLoadingImage] = useState(false)


    useEffect(() => {
        previousToolsPostData ?
            postUpdating()
            :
            navigator.geolocation &&
            navigator.geolocation.getCurrentPosition((position) => {
                const latitude = position.coords.latitude
                const longitude = position.coords.longitude
                setPostData(prevData => ({
                    ...prevData, location: {
                        type: "Point",
                        coordinates: [longitude, latitude],
                    }
                }))
            }, (error) => {
                console.log("Error occurred.", error)
            })
    }, [])

    const handleInputChange = e => {
        const { name, value } = e.currentTarget
        if (name in postData.equipment) {
            setPostData({
                ...postData,
                equipment: {
                    ...postData.equipment,
                    [name]: value,
                },
            })
        } else {
            setPostData({
                ...postData,
                [name]: value,
            })
        }
    }

    const handlePostSubmit = e => {
        e.preventDefault()

        postsService
            .savePost(postData)
            .then(() => {
                setShowMainFormModal(false)
            })
            .catch(err => console.log(err))

    }

    const handleFileUpload = e => {

        setLoadingImage(true)

        const formData = new FormData()
        formData.append('imageData', e.target.files[0])

        uploadServices
            .uploadimage(formData)
            .then(({ data }) => {
                setPostData(prevData => ({ ...prevData, image: data.cloudinary_url }))
                setLoadingImage(false)
            })
            .catch(err => {
                console.log(err)
                setLoadingImage(false)
            })
    }


    const postUpdating = () => {
        postsService
            .getPostDetails(previousToolsPostData._id)
            .then(({ data }) => setPostData(previousToolsPostData))
            .catch(err => console.log(err))

    }

    const handleEditPost = e => {
        e.preventDefault()

        postsService
            .editPost(postData._id, postData)
            .then(() => {
                setShowEditModal(false)
            })
            .catch(err => console.log(err))
    }


    return (
        <div className="NewPostForm">
            <Form onSubmit={previousToolsPostData ? handleEditPost : handlePostSubmit}>

                {postData.image && <Card.Img variant="top" src={postData.image} />}

                <Form.Group className="mb-3" controlId="image">
                    <Form.Label>Picture</Form.Label>
                    <Form.Control type="file" onChange={handleFileUpload} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={postData.title}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        name="otherNotes"
                        value={postData.otherNotes}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPlantType">
                    <Form.Label>Condition</Form.Label>
                    <Form.Control as="select" onChange={handleInputChange} name="condition">
                        <option value="" disabled selected> </option>
                        {Constants.EQUIPMENT_CONDITION.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPlantType">
                    <Form.Label>Decorative And Miscellaneous</Form.Label>
                    <Form.Control as="select" onChange={handleInputChange} name="DecorativeAndMiscellaneous">
                        <option value="" disabled selected> </option>
                        {Constants.EQUIPMENT_TYPES.DecorativeAndMiscellaneous.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPlantType">
                    <Form.Label>Pot Type</Form.Label>
                    <Form.Control as="select" onChange={handleInputChange} name="PotsAndContainers">
                        <option value="" disabled selected> </option>
                        {Constants.EQUIPMENT_TYPES.PotsAndContainers.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPlantType">
                    <Form.Label>Watering</Form.Label>
                    <Form.Control as="select" onChange={handleInputChange} name="WateringEquipment">
                        <option value="" disabled selected> </option>
                        {Constants.EQUIPMENT_TYPES.WateringEquipment.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPlantType">
                    <Form.Label>Gardening Tools</Form.Label>
                    <Form.Control as="select" onChange={handleInputChange} name="GardeningTools">
                        <option value="" disabled selected> </option>
                        {Constants.EQUIPMENT_TYPES.GardeningTools.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPlantType">
                    <Form.Label>Plant Care</Form.Label>
                    <Form.Control as="select" onChange={handleInputChange} name="PlantCare">
                        <option value="" disabled selected> </option>
                        {Constants.EQUIPMENT_TYPES.PlantCare.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPlantType">
                    <Form.Label>Propagation and Support</Form.Label>
                    <Form.Control as="select" onChange={handleInputChange} name="PropagationAndSupport">
                        <option value="" disabled selected> </option>
                        {Constants.EQUIPMENT_TYPES.PropagationAndSupport.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPlantType">
                    <Form.Label>Monitoring Tools</Form.Label>
                    <Form.Control as="select" onChange={handleInputChange} name="MonitoringTools">
                        <option value="" disabled selected> </option>
                        {Constants.EQUIPMENT_TYPES.MonitoringTools.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <div className="d-grid">
                    <Button variant="primary" type="submit">
                        Post
                    </Button>
                    <button onClick={() => setShowMainFormModal(false)}>Close Modal</button>
                </div>
            </Form>
        </div>
    )
}
export default NewToolPostForm
