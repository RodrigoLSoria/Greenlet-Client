import { Container, Nav, Navbar } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useContext, useState } from "react"
import { Modal } from "react-bootstrap"
import SignupForm from "../../components/SignupForm/SignupForm"
import LoginForm from "../LoginForm/LoginForm"
import MainForm from "../MainForm/MainForm"
import { AuthContext } from '../../contexts/auth.context'
import { useNavigate } from "react-router-dom"
import { useLoginModalContext } from '../../contexts/loginModal.context'
import { useSignupModalContext } from '../../contexts/signupModal.context'

const Navigation = () => {

    const { showLoginModal, setShowLoginModal } = useLoginModalContext()
    const { showSignupModal, setShowSignupModal } = useSignupModalContext()

    const [showMainFormModal, setShowMainFormModal] = useState(false)

    const { loggedUser, logout } = useContext(AuthContext)

    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark" className="mb-5" expand="lg">
                <Container>
                    <Navbar.Brand>
                        <Link className="nav-link" to="/">{import.meta.env.VITE_APP_NAME}</Link>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">

                            <Link className="nav-link" to="#"
                                onClick={() => loggedUser ? setShowMainFormModal(true) : setShowLoginModal(true)}>Upload Plant</Link>



                            {loggedUser ?
                                <>
                                    <Link to={`/profile/${loggedUser._id}`} className='nav-link'>My profile</Link>
                                    <Link to={`/getAllForUser/${loggedUser._id}`} className='nav-link'>📥</Link>

                                    <span className='nav-link' onClick={handleLogout}>Logout</span>
                                </>
                                :
                                <>
                                    <Link className="nav-link" to="/signup" onClick={() => setShowSignupModal(true)}>Signup</Link>
                                    <Link className="nav-link" to="/login" onClick={() => setShowLoginModal(true)}>Login</Link>
                                </>
                            }
                        </Nav>
                    </Navbar.Collapse >

                </Container>
                <span className="navbar-text">Hi, {loggedUser ? loggedUser.username : 'user'}!</span>
            </Navbar>



            <div className="SignupModal">
                <Modal show={showSignupModal} onHide={() => setShowSignupModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Signup</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <SignupForm setShowSignupModal={setShowSignupModal} setShowLoginModal={setShowLoginModal} />
                    </Modal.Body>
                </Modal>
            </div>

            <div className="LoginModal">
                <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Login</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <LoginForm setShowSignupModal={setShowSignupModal} setShowLoginModal={setShowLoginModal} />
                    </Modal.Body>
                </Modal>
            </div>

            <div className="PostModal">
                <Modal show={showMainFormModal} onHide={() => setShowMainFormModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Post</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <MainForm showMainFormModal={showMainFormModal} setShowMainFormModal={setShowMainFormModal} />
                    </Modal.Body>
                </Modal>
            </div>
        </>
    )
}

export default Navigation