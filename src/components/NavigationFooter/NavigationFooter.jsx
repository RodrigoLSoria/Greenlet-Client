import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EmailIcon from '@mui/icons-material/Email';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import './NavigationFooter.css';
import { AuthContext } from '../../contexts/auth.context'
import { useLoginModalContext } from '../../contexts/loginModal.context'
import { useSignupModalContext } from '../../contexts/signupModal.context'
import { Modal } from "react-bootstrap"
import SignupForm from '../SignupForm/SignupForm'
import LoginForm from '../LoginForm/LoginForm'
import MainForm from '../MainForm/MainForm'



const FooterNavbar = () => {

    const { loggedUser, logout } = useContext(AuthContext)
    const [showMainFormModal, setShowMainFormModal] = useState(false)
    const { showLoginModal, setShowLoginModal } = useLoginModalContext()
    const { showSignupModal, setShowSignupModal } = useSignupModalContext()


    return (
        <>
            <div className="navbar-items" id="navbarItems">
                {loggedUser ? (
                    <>
                        <div className="footer-navbar">
                            <Link to="/" className="footer-icon">
                                <HomeIcon />
                                <span>Home</span>
                            </Link>
                            <Link to={`/saved/${loggedUser?._id}`} className="footer-icon">
                                <FavoriteIcon />
                                <span>Favourites</span>
                            </Link>
                            <div className="footer-icon" onClick={() => setShowMainFormModal(true)}>
                                <AddCircleIcon />
                                <span>Upload</span>
                            </div>
                            <Link to={`/getAllForUser/${loggedUser?._id}`} className="footer-icon">
                                <EmailIcon />
                                <span>Inbox</span>
                            </Link>
                            <Link to={`/profile/${loggedUser?._id}`} className="footer-icon">
                                <SentimentSatisfiedAltIcon />
                                <span>You</span>
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="footer-navbar">
                            <Link to="/" className="footer-icon">
                                <HomeIcon />
                                <span>Home</span>
                            </Link>
                            <Link onClick={() => setShowLoginModal(true)} className="footer-icon">
                                <FavoriteIcon />
                                <span>Favourites</span>
                            </Link>
                            <div className="footer-icon" onClick={() => setShowLoginModal(true)}>
                                <AddCircleIcon />
                                <span>Upload</span>
                            </div>
                            <Link onClick={() => setShowLoginModal(true)} className="footer-icon">
                                <EmailIcon />
                                <span>Inbox</span>
                            </Link>
                            <Link onClick={() => setShowLoginModal(true)} className="footer-icon">
                                <SentimentSatisfiedAltIcon />
                                <span>You</span>
                            </Link>
                        </div>
                    </>

                )}
            </div>

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
};

export default FooterNavbar;
