import { useContext, useState } from "react"
import { Button, Form } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import authService from "../../services/auth.services"
import { AuthContext } from "../../contexts/auth.context"
import './LoginForm.css'
import FormError from "../FormError/FormError"


const LoginForm = ({ setShowLoginModal, setShowSignupModal }) => {

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState([])
    const navigate = useNavigate()

    const { authenticateUser, storeToken } = useContext(AuthContext)

    const handleInputChange = e => {
        const { value, name } = e.target
        setLoginData({ ...loginData, [name]: value })
    }

    const handleFormSubmit = e => {

        e.preventDefault()

        authService
            .login(loginData)
            .then(({ data }) => {
                storeToken(data.authToken)
                authenticateUser()
                setShowLoginModal(false)
                navigate('/')
            })
            .catch(err => setErrors([err.response.data.message]))


    }

    return (
        <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type="email"
                    value={loginData.email}
                    onChange={handleInputChange}
                    name="email" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    value={loginData.password}
                    onChange={handleInputChange}
                    name="password" />
            </Form.Group>

            {
                errors.length > 0 && (
                    <FormError>
                        {errors.map((elm, index) => <p key={index}>{elm}</p>)}
                    </FormError>
                )}

            <div className="text-center">
                <Button variant="dark" type="submit" className="my-1">
                    Enter
                </Button>
                <div>
                    <Link onClick={() => setShowSignupModal(true)} className="signup-link">
                        Sign up if you don't have an account yet.
                    </Link>
                </div>
            </div>
        </Form>
    )
}

export default LoginForm