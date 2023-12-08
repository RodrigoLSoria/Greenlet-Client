import { Nav, Navbar } from "react-bootstrap"
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
import { useSearchContext } from '../../contexts/search.Context'
import { useFilterContext } from '../../contexts/filter.context'
import Feed from "../../components/Feed/Feed"
import * as Constants from "../../consts/consts"
import Offcanvas from 'react-bootstrap/Offcanvas'
import Carousel from 'react-bootstrap/Carousel'
import { Button, Container, Dropdown, Form } from "react-bootstrap"
import "./Navigation.css"
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MailOutlineIcon from '@mui/icons-material/MailOutline';





const Navigation = () => {

    const { showLoginModal, setShowLoginModal } = useLoginModalContext()
    const { showSignupModal, setShowSignupModal } = useSignupModalContext()
    const { searchQuery, setSearchQuery } = useSearchContext()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const {
        selectedCategories,
        setSelectedCategories,
        selectedPlantTypes,
        setSelectedPlantTypes,
        dateFilter,
        setDateFilter
    } = useFilterContext();

    const [showMainFormModal, setShowMainFormModal] = useState(false)

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const { loggedUser, logout } = useContext(AuthContext)

    const navigate = useNavigate()

    const handleClose = () => setShowOffCanvas(false);
    const handleShow = () => setShowOffCanvas(true);

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value)
    }

    const handleCategoryToggle = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const handlePlantTypeToggle = (type) => {
        if (selectedPlantTypes.includes(type)) {
            setSelectedPlantTypes(selectedPlantTypes.filter(c => c !== type));
        } else {
            setSelectedPlantTypes([...selectedPlantTypes, type]);
        }
    };

    const handleDateFilterChange = (newDateFilter) => {
        setDateFilter(newDateFilter);
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">

                    <Link className="nav-link" to="/">{import.meta.env.VITE_APP_NAME}</Link>

                    <div className="searchBar">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleInputChange}
                            placeholder='Search in all categories...'
                            className="form-control search-input"
                        />
                    </div>

                    <div className="navbar-actions">
                        <FavoriteBorderIcon /> {/* Favorite Icon */}
                        {/* aqui meter enlace a favoritos del perfil  */}
                        <MailOutlineIcon /> {/* Mail Icon */}
                        {/* More actions here */}
                    </div>
                    {loggedUser ? (
                        <div className="user-logged-in">
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    ) : (
                        <div className="user-logged-out">
                            <Link to={`/profile/${loggedUser?._id}`} className='nav-link'>My profile</Link>
                            <Link to={`/getAllForUser/${loggedUser?._id}`} className='nav-link'>📥</Link>
                        </div>
                    )}
                    <Link className="nav-link upload-plant-button" to="#"
                        onClick={() => loggedUser ? setShowMainFormModal(true) : setShowLoginModal(true)}>Upload Plant</Link>
                </div>
                {isDropdownOpen && (
                    <div className="dropdown-menu">
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-category">
                                Category
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {Constants.POST_CATEGORIES.map((category) => (
                                    <Dropdown.Item
                                        key={category}
                                        onClick={() => handleCategoryToggle(category)}
                                        active={selectedCategories.includes(category)}
                                    >
                                        {category}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>

                        {/* Dropdown for plant type filters */}
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-plant-type">
                                Plant Type
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {Constants.PLANT_TYPES.map((type) => (
                                    <Dropdown.Item
                                        key={type}
                                        onClick={() => handlePlantTypeToggle(type)}
                                        active={selectedPlantTypes.includes(type)}
                                    >
                                        {type}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>

                        {/* Dropdown for date filters */}
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-date-filter">
                                Posted
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleDateFilterChange('24h')}>Last 24 Hours</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleDateFilterChange('7d')}>Last Week</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleDateFilterChange('30d')}>Last Month</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleDateFilterChange('all')}>All</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                    </div>
                )}
            </nav>

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