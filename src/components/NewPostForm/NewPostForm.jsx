import { useContext, useEffect, useState } from "react"
import { Form, Button, Card } from "react-bootstrap"
import postsService from "../../services/posts.services"
import uploadServices from "../../services/upload.services"
import { AuthContext } from "../../contexts/auth.context"
import * as Constants from '../../consts/consts'
import setGeolocation from '../../utils/setGeolocation';
import { useFeedRefresh } from '../../contexts/postsRefresh.context'


const NewPostForm = ({ refreshPosts, setShowPostModal, setShowEditModal, previousPostData }) => {
    const { setRefreshFeed } = useFeedRefresh()

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
        owner: ''
    }

    const { loggedUser } = useContext(AuthContext)
    const [postData, setPostData] = useState(emptyPostForm)
    const [loadingImage, setLoadingImage] = useState(false)

    useEffect(() => {
        previousPostData ?
            postUpdating()
            :
            navigator.geolocation &&
            navigator.geolocation.getCurrentPosition((position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                setPostData(prevData => ({
                    ...prevData, location: {
                        type: "Point",
                        coordinates: [longitude, latitude],
                    }
                }));
            }, (error) => {
                console.log("Error occurred.", error);
            });
    }, []);

    const handleInputChange = e => {
        const { name, value } = e.currentTarget
        setPostData({
            ...postData,
            [name]: value,
        })
    }

    const handlePostSubmit = e => {
        e.preventDefault()

        postsService
            .savePost(postData)
            .then(() => {
                setShowPostModal(false);
                setRefreshFeed(true);
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
            .getPostDetails(previousPostData._id)
            .then(({ data }) => setPostData(previousPostData))
            .catch(err => console.log(err))

    }

    const handleEditPost = e => {
        e.preventDefault()

        postsService
            .editPost(postData._id, postData)
            .then(() => {
                refreshPosts()
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
                        type="text"
                        name="description"
                        value={postData.description}
                        onChange={handleInputChange}
                    />
                </Form.Group>



                <div className="d-grid">
                    <Button variant="primary" type="submit">
                        Post
                    </Button>
                    <button onClick={() => setShowPostModal(false)}>Close Modal</button>
                </div>
            </Form>
        </div>
    )
}

export default NewPostForm