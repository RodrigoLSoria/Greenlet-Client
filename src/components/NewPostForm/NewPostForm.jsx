import { useContext, useEffect, useState } from "react"
import { Form, Button, Card } from "react-bootstrap"
import postsService from "../../services/posts.services"
import uploadServices from "../../services/upload.services"
import { AuthContext } from "../../contexts/auth.context"
import * as Constants from '../../consts/consts'
import setGeolocation from '../../utils/setGeolocation'


const NewPostForm = ({ setShowMainFormModal, setShowEditModal, previousPostData, onPostUpdate }) => {


    const emptyPostForm = {
        title: '',
        plantSpecies: '',
        description: '',
        image: '',
        location: {
            type: 'Point',
            coordinates: [null, null],
        },
        category: '',
        owner: '',
        careInstructions: {
            location: 'interior',
            light: 'medium',
            wateringFrequency: 7,
            temperature: {
                indoor: 'temperate',
                outdoor: 'temperate',
            },
            humidity: 'medium',
            soilType: 'loamy',
            potting: true,
            fertilizingFrequency: 4,
            pruning: false,
            repotting: false,
            pestManagement: '',
            dormancy: false,
            propagation: '',
            wateringMethod: 'top-watering',
            toxicity: 'non-toxic',
            specialNeeds: '',
            otherNotes: ''
        }
    }

    const { loggedUser } = useContext(AuthContext)
    const [postData, setPostData] = useState(emptyPostForm)
    const [loadingImage, setLoadingImage] = useState(false)
    const [showCareInstructions, setShowCareInstructions] = useState(false)
    const [descriptionPlaceholder, setDescriptionPlaceholder] = useState('')


    useEffect(() => {
        previousPostData ?
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
        setPostData({
            ...postData,
            [name]: value,
        })

        if (name === 'category' && value === 'found') {
            setDescriptionPlaceholder("Enter the specific location of the plant you found, including street, neighborhood, or metro stop details.")
        } else {
            setDescriptionPlaceholder('')
        }
    }

    const handlePostSubmit = e => {
        e.preventDefault()

        postsService
            .savePost(postData)
            .then(() => {
                setShowMainFormModal(false)
                checkForAlertMatches(postData)
            })
            .catch(err => console.log(err))

    }

    const checkForAlertMatches = (newPost) => {
        postsService
            .checkForAlertMatches(newPost)
            .then(matches => {
                if (matches.length > 0) {
                    console.log('Alert matches found:', matches)
                } else {
                    console.log('No alert matches found.')
                }
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

    const handleCareInstructionsChange = e => {
        const { name, value } = e.target
        setPostData({
            ...postData,
            careInstructions: {
                ...postData.careInstructions,
                [name]: value,
            }
        })
    }

    const postUpdating = () => {
        postsService
            .getPostDetails(previousPostData._id)
            .then(({ data }) => setPostData(previousPostData))
            .catch(err => console.log(err))

    }

    const handleEditPost = e => {
        e.preventDefault()

        postsService
            .editPost(postData._id, postData)
            .then(() => {
                onPostUpdate()
                setShowEditModal(false)
            })
            .catch(err => console.log(err))
    }



    return (
        <div className="NewPostForm">
            <Form onSubmit={previousPostData ? handleEditPost : handlePostSubmit}>

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

                <Form.Group className="mb-3" controlId="formBasicCategory">
                    <Form.Label>Category</Form.Label>
                    <Form.Control as="select" onChange={handleInputChange} name="category">
                        <option value="" disabled selected>Select a category</option>
                        {Constants.POST_CATEGORIES.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPlantType">
                    <Form.Label>Plant Type</Form.Label>
                    <Form.Control as="select" onChange={handleInputChange} name="plantType">
                        <option value="" disabled selected>Select a category</option>
                        {Constants.PLANT_TYPES.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={postData.description}
                        onChange={handleInputChange}
                        placeholder={descriptionPlaceholder}

                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addCareInstructions">
                    <Form.Check
                        type="checkbox"
                        label="Do you want to add caring instructions for the future owner?"
                        onChange={() => setShowCareInstructions(!showCareInstructions)}
                        checked={showCareInstructions}
                    />
                </Form.Group>

                {showCareInstructions && (
                    <div>
                        <Form.Group className="mb-3" controlId="careInstructionsLight">
                            <Form.Label>Light</Form.Label>
                            <Form.Control
                                as="select"
                                onChange={handleCareInstructionsChange}
                                name="light"
                                value={postData.careInstructions.light}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="direct sunlight">Direct Sunlight</option>
                            </Form.Control>
                        </Form.Group>
                    </div>
                )}


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

export default NewPostForm