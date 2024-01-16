import { useContext, useEffect, useState } from "react"
import { Form, Button, Card } from "react-bootstrap"
import postsService from "../../services/posts.services"
import uploadServices from "../../services/upload.services"
import { AuthContext } from "../../contexts/auth.context"
import * as Constants from '../../consts/consts'
import setGeolocation from '../../utils/setGeolocation'
import "./NewPostForm.css"
import { usePosts } from '../../contexts/posts.context'
import FormError from "../FormError/FormError"


const NewPostForm = ({ setShowNewPostFormModal, setShowEditModal, previousPostData, onPostUpdate }) => {


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
    const { setPosts } = usePosts()
    const [loadingImage, setLoadingImage] = useState(false)
    const [errors, setErrors] = useState([])
    console.log("the errorrrrrrrs", errors)
    const [showCareInstructions, setShowCareInstructions] = useState(false)
    const [descriptionPlaceholder, setDescriptionPlaceholder] = useState('')
    const [instructionVisibility, setInstructionVisibility] = useState({
        location: false,
        light: false,
        wateringFrequency: false,
        temperature: false,
        humidity: false,
        soilType: false,
        potting: false,
        fertilizingFrequency: false,
        pruning: false,
        repotting: false,
        pestManagement: false,
        dormancy: false,
        propagation: false,
        wateringMethod: false,
        toxicity: false,
        specialNeeds: false,
        otherNotes: false
    })


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
            .then((response) => {
                setPosts(prevPosts => [...prevPosts, response.data])
                setShowNewPostFormModal(false)
                checkForAlertMatches(postData)

            })
            .catch(err => {
                console.log("the errors", err.response.data.errorMessages)
                setErrors(err.response.data.errorMessages)
            })

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

    const handleCareInstructionsChange = (e) => {
        const { name, checked, type } = e.target;
        if (type === 'checkbox') {
            setPostData(prevData => ({
                ...prevData,
                careInstructions: {
                    ...prevData.careInstructions,
                    [name]: checked,
                }
            }));
        } else {
            const { value } = e.target;
            setPostData(prevData => ({
                ...prevData,
                careInstructions: {
                    ...prevData.careInstructions,
                    [name]: value,
                }
            }));
        }
    };

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

    const toggleInstructionVisibility = (key) => {
        setInstructionVisibility(prevState => ({
            ...prevState,
            [key]: !prevState[key]
        }));
    };

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

                {errors.length > 0 && (
                    <FormError>
                        {errors.map((elm, index) => <p key={index}>{elm}</p>)}
                    </FormError>
                )}

                <Form.Group className="mb-3" controlId="addCareInstructions">
                    <Form.Check
                        type="checkbox"
                        label="Want to add caring instructions for the future owner?"
                        onChange={() => setShowCareInstructions(!showCareInstructions)}
                        checked={showCareInstructions}
                    />
                </Form.Group>

                {showCareInstructions && (
                    <div className="care-instrucctions-container">
                        <hr />
                        <h4>Care Instrucctions</h4>
                        <p>You can choose from the below list:</p>
                        <div className="d-flex flex-wrap">
                            {Object.keys(instructionVisibility).map((key) => (
                                <div key={key} className="checkbox-button">
                                    <button
                                        id={`toggle-${key}`}
                                        type="button"
                                        className={`btn ${instructionVisibility[key] ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => toggleInstructionVisibility(key)}
                                        aria-pressed={instructionVisibility[key]}
                                    >
                                        {`${key.charAt(0).toUpperCase() + key.slice(1)}`}
                                    </button>
                                </div>
                            ))}
                        </div>
                        <hr />

                        {instructionVisibility.location && (
                            <Form.Group className="mb-3" controlId="careInstructionsLocation">
                                <Form.Label>Location</Form.Label>
                                <Form.Control as="select" onChange={handleCareInstructionsChange} name="location" value={postData.careInstructions.location}>
                                    <option value="interior">Interior</option>
                                    <option value="exterior">Exterior</option>
                                    <option value="both">Both</option>
                                </Form.Control>
                            </Form.Group>
                        )}

                        {instructionVisibility.light && (
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
                        )}

                        {instructionVisibility.wateringFrequency && (
                            <Form.Group className="mb-3" controlId="careInstructionsWateringFrequency">
                                <Form.Label>Watering Frequency (days)</Form.Label>
                                <Form.Control type="number" onChange={handleCareInstructionsChange} name="wateringFrequency" value={postData.careInstructions.wateringFrequency} />
                            </Form.Group>
                        )}

                        {instructionVisibility.temperature && (
                            <Form.Group className="mb-3">
                                <Form.Group className="mb-3" controlId="careInstructionsIndoorTemperature">
                                    <Form.Label>Indoor Temperature</Form.Label>
                                    <Form.Control as="select" onChange={handleCareInstructionsChange} name="temperature[indoor]" value={postData.careInstructions.temperature.indoor}>
                                        <option value="cold">Cold</option>
                                        <option value="temperate">Temperate</option>
                                        <option value="warm">Warm</option>
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="careInstructionsOutdoorTemperature">
                                    <Form.Label>Outdoor Temperature</Form.Label>
                                    <Form.Control as="select" onChange={handleCareInstructionsChange} name="temperature[outdoor]" value={postData.careInstructions.temperature.outdoor}>
                                        <option value="cold">Cold</option>
                                        <option value="temperate">Temperate</option>
                                        <option value="warm">Warm</option>
                                        <option value="hardiness zones">Hardiness Zones</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form.Group>
                        )}


                        {instructionVisibility.humidity && (
                            <Form.Group className="mb-3">
                                <Form.Label>Humidity</Form.Label>
                                <Form.Control as="select" onChange={handleCareInstructionsChange} name="humidity" value={postData.careInstructions.humidity}>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </Form.Control>
                            </Form.Group>
                        )}

                        {instructionVisibility.soilType && (
                            <Form.Group className="mb-3">
                                <Form.Label>Soil Type</Form.Label>
                                <Form.Control as="select" onChange={handleCareInstructionsChange} name="soilType" value={postData.careInstructions.soilType}>
                                    <option value="sandy">Sandy</option>
                                    <option value="loamy">Loamy</option>
                                    <option value="clayey">Clayey</option>
                                    <option value="peaty">Peaty</option>
                                    <option value="chalky">Chalky</option>
                                    <option value="silty">Silty</option>
                                </Form.Control>
                            </Form.Group>
                        )}

                        {instructionVisibility.potting && (
                            <Form.Group className="mb-3">
                                <Form.Label>Potting</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    label="Potting needed"
                                    onChange={handleCareInstructionsChange}
                                    name="potting"
                                    checked={postData.careInstructions.potting}
                                />
                            </Form.Group>
                        )}

                        {instructionVisibility.fertilizingFrequency && (
                            <Form.Group className="mb-3">
                                <Form.Label>Fertilizing Frequency (times per year)</Form.Label>
                                <Form.Control type="number" onChange={handleCareInstructionsChange} name="fertilizingFrequency" value={postData.careInstructions.fertilizingFrequency} />
                            </Form.Group>
                        )}

                        {instructionVisibility.pruning && (
                            <Form.Group className="mb-3">
                                <Form.Label>Pruning</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    label="Pruning needed"
                                    onChange={handleCareInstructionsChange}
                                    name="pruning"
                                    checked={postData.careInstructions.pruning}
                                />
                            </Form.Group>
                        )}

                        {instructionVisibility.repotting && (
                            <Form.Group className="mb-3">
                                <Form.Label>Repotting</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    label="Repotting needed"
                                    onChange={handleCareInstructionsChange}
                                    name="repotting"
                                    checked={postData.careInstructions.repotting}
                                />
                            </Form.Group>
                        )}

                        {instructionVisibility.pestManagement && (
                            <Form.Group className="mb-3">
                                <Form.Label>Pest Management</Form.Label>
                                <Form.Control type="text" onChange={handleCareInstructionsChange} name="pestManagement" value={postData.careInstructions.pestManagement} />
                            </Form.Group>
                        )}

                        {instructionVisibility.dormancy && (
                            <Form.Group className="mb-3">
                                <Form.Label>Dormancy</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    label="Dormancy period observed"
                                    onChange={handleCareInstructionsChange}
                                    name="dormancy"
                                    checked={postData.careInstructions.dormancy}
                                />
                            </Form.Group>
                        )}

                        {instructionVisibility.propagation && (
                            <Form.Group className="mb-3">
                                <Form.Label>Propagation</Form.Label>
                                <Form.Control type="text" onChange={handleCareInstructionsChange} name="propagation" value={postData.careInstructions.propagation} />
                            </Form.Group>
                        )}

                        {instructionVisibility.wateringMethod && (
                            <Form.Group className="mb-3">
                                <Form.Label>Watering Method</Form.Label>
                                <Form.Control as="select" onChange={handleCareInstructionsChange} name="wateringMethod" value={postData.careInstructions.wateringMethod}>
                                    <option value="top-watering">Top-Watering</option>
                                    <option value="bottom-watering">Bottom-Watering</option>
                                    <option value="misting">Misting</option>
                                    <option value="soak and dry">Soak and Dry</option>
                                </Form.Control>
                            </Form.Group>
                        )}

                        {instructionVisibility.toxicity && (
                            <Form.Group className="mb-3">
                                <Form.Label>Toxicity</Form.Label>
                                <Form.Control as="select" onChange={handleCareInstructionsChange} name="toxicity" value={postData.careInstructions.toxicity}>
                                    <option value="non-toxic">Non-Toxic</option>
                                    <option value="toxic">Toxic</option>
                                </Form.Control>
                            </Form.Group>
                        )}

                        {instructionVisibility.specialNeeds && (
                            <Form.Group className="mb-3">
                                <Form.Label>Special Needs</Form.Label>
                                <Form.Control type="text" onChange={handleCareInstructionsChange} name="specialNeeds" value={postData.careInstructions.specialNeeds} />
                            </Form.Group>
                        )}

                        {instructionVisibility.otherNotes && (
                            <Form.Group className="mb-3">
                                <Form.Label>Other Notes</Form.Label>
                                <Form.Control type="text" onChange={handleCareInstructionsChange} name="otherNotes" value={postData.careInstructions.otherNotes} />
                            </Form.Group>
                        )}
                    </div >
                )}

                <div className="d-grid">
                    <Button variant="primary" type="submit">
                        Post
                    </Button>
                </div>
            </Form >
        </div >
    )
}

export default NewPostForm