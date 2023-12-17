import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EmailIcon from '@mui/icons-material/Email';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import './NavigationFooter.css';
import { AuthContext } from '../../contexts/auth.context'

const FooterNavbar = ({ setShowMainFormModal }) => {

    const { loggedUser, logout } = useContext(AuthContext)

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
        </>
    )
};

export default FooterNavbar;
