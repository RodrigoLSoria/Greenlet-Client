import { useContext, useEffect, useState } from "react"
import { Button, Form } from "react-bootstrap"
import authService from "../../services/auth.services"
import uploadServices from "../../services/upload.services"
import { AuthContext } from "../../contexts/auth.context"
import userService from "../../services/user.services"


const signupform = ({ loadUserDetails, setShowModal, setShowSignupModal, setShowLoginModal }) => {

    const [loadingImage, setLoadingImage] = useState(false)
    const { loggedUser } = useContext(AuthContext)


    const emptySignupForm = {
        username: '',
        email: '',
        password: '',
        bio: '',
        avatar: ''
    }
    const [signupData, setSignupData] = useState(emptySignupForm)


    useEffect(() => {
        loggedUser && editingUser()
    }, [])


    const handleInputChange = e => {
        const { value, name } = e.target
        setSignupData({ ...signupData, [name]: value })
    }


    const handleFormSubmit = e => {
        e.preventDefault()

        authService
            .signup(signupData)
            .then(() => {
                setShowSignupModal(false);
                setShowLoginModal(true)
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
                setSignupData({ ...signupData, avatar: data.cloudinary_url })
                setLoadingImage(false)
            })
            .catch(err => {
                console.log(err)
                setLoadingImage(false)
            })
    }

    const editingUser = () => {
        userService
            .getUserDetails(loggedUser._id)
            .then(({ data }) => setSignupData(data))
            .catch(err => console.log(err))
    }

    const handleEditUser = e => {
        e.preventDefault()

        userService
            .editProfile(loggedUser._id, signupData)
            .then(() => {
                loadUserDetails();
                setShowModal(false)
            })
            .catch(err => console.log(err))
    }

    return (
        <Form onSubmit={loggedUser ? handleEditUser : handleFormSubmit}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    value={signupData.username}
                    onChange={handleInputChange}
                    name="username" />
            </Form.Group>

            {signupData.avatar && <Card.Img variant="top" src={signupData.avatar} />}

            <Form.Group className="mb-3" controlId="avatar">
                <Form.Label>Avatar</Form.Label>
                <Form.Control type="file" onChange={handleFileUpload} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="bio">
                <Form.Label>Bio</Form.Label>
                <Form.Control as="textarea" rows={5} value={signupData.bio}
                    onChange={handleInputChange} name="bio" />
            </Form.Group>


            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type="email"
                    value={signupData.email}
                    onChange={handleInputChange}
                    name="email" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    value={signupData.password}
                    onChange={handleInputChange}
                    name="password" />
            </Form.Group>

            {loggedUser ?
                <div className="d-grid">
                    <Button variant="dark" type="submit" disabled={loadingImage}>
                        {loadingImage ? 'Loading Image' : 'Edit'}</Button>
                </div>
                :
                <div className="d-grid">
                    <Button variant="dark" type="submit" disabled={loadingImage}>
                        {loadingImage ? 'Loading Image' : 'Register'}</Button>
                </div>}
        </Form>
    )
}

export default signupform
