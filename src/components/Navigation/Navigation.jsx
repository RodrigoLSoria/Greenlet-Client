import { Alert, Nav, Navbar, Modal } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useContext, useState, useEffect } from "react"
import SignupForm from "../SignupForm/SignupForm"
import LoginForm from "../LoginForm/LoginForm"
import MainForm from "../MainForm/MainForm"
import { AuthContext } from '../../contexts/auth.context'
import { useNavigate } from "react-router-dom"
import { useLoginModalContext } from '../../contexts/loginModal.context'
import { useSignupModalContext } from '../../contexts/signupModal.context'
import { usePosts } from "../../contexts/posts.context"
import * as Constants from "../../consts/consts"
import Offcanvas from 'react-bootstrap/Offcanvas'
import Carousel from 'react-bootstrap/Carousel'
import { Button, Container, Dropdown, Form } from "react-bootstrap"
import "./Navigation.css"
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import setGeolocation from '../../utils/setGeolocation'
import mapsService from "../../services/maps.services"
import postsService from "../../services/posts.services"
import EmailIcon from '@mui/icons-material/Email'
import FooterNavbar from "../NavigationFooter/NavigationFooter"
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt'

const Navigation = () => {

    const [showOffCanvas, setShowOffCanvas] = useState(false)
    const { setPosts } = usePosts()
    const [filteredPosts, setFilteredPosts] = useState([])
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [location, setLocation] = useState('')
    const [showMainFormModal, setShowMainFormModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedPlantTypes, setSelectedPlantTypes] = useState([])
    const [dateFilter, setDateFilter] = useState('all')
    const [isNavExpanded, setIsNavExpanded] = useState(false)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const { showLoginModal, setShowLoginModal } = useLoginModalContext()
    const { showSignupModal, setShowSignupModal } = useSignupModalContext()
    const { loggedUser, logout } = useContext(AuthContext)
    const navigate = useNavigate()
    const shouldShowFooterNavbar = windowWidth < 1000


    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    const handleClose = () => setShowOffCanvas(false)
    const handleShow = () => setShowOffCanvas(true)

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    useEffect(() => {
        loadFeed()

    }, [searchQuery, selectedCategories, selectedPlantTypes, dateFilter])

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])


    const loadFeed = () => {
        setGeolocation(
            async ({ latitude, longitude }) => {

                try {
                    // Use mapsService to get the reverse geocode data
                    const locationData = await mapsService.reverseGeocode(latitude, longitude)

                    setLocation(`${locationData.data.city}, ${locationData.data.country}`)

                    const isFoundCategorySelected = selectedCategories.includes('found')

                    const queryParams = {
                        searchQuery,
                        category: selectedCategories,
                        userLatitude: latitude,
                        userLongitude: longitude,
                        plantType: selectedPlantTypes,
                        dateFilter: isFoundCategorySelected ? '24h' : dateFilter
                    }

                    postsService
                        .getFilteredPosts(queryParams)
                        .then(({ data }) => {
                            setPosts(data)
                        })
                        .catch((err) => console.log(err))
                } catch (error) {
                    console.error('Error fetching location:', error)
                }
            })
    }

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value)
    }

    const handleCategoryToggle = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category))
        } else {
            setSelectedCategories([...selectedCategories, category])
        }
    }

    const handlePlantTypeToggle = (type) => {
        if (selectedPlantTypes.includes(type)) {
            setSelectedPlantTypes(selectedPlantTypes.filter(c => c !== type))
        } else {
            setSelectedPlantTypes([...selectedPlantTypes, type])
        }
    }

    const handleDateFilterChange = (newDateFilter) => {
        setDateFilter(newDateFilter)
    }

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">

                    <Link className="nav-link" to="/"><img src="../../../public/Greenlet-TwoColours.jpg" alt="Greenlet Icon" className="greenlet-icon" /></Link>

                    <div className="searchBar">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleInputChange}
                            placeholder='Search in all categories...'
                            className="form-control search-input"
                        />
                    </div>
                    <div className="topRightItems">
                        <div className="location">
                            <LocationOnIcon /> <span>{location}</span>
                        </div>

                        {!shouldShowFooterNavbar && (
                            <div className="navbar-items" id="navbarItems">
                                {loggedUser ? (
                                    <>
                                        <Link to={`/profile/${loggedUser?._id}`} className="footer-icon">
                                            <SentimentSatisfiedAltIcon />
                                        </Link>
                                        <Link to={`/getAllForUser/${loggedUser?._id}`} className="footer-icon">
                                            <EmailIcon />
                                        </Link>
                                        <Link to={`/UserFavourites/${loggedUser._id}`} className='nav-link'><FavoriteBorderIcon /></Link>
                                        <Link className="nav-link upload-plant-button" to="#"
                                            onClick={() => setShowMainFormModal(true)}>Upload Plant</Link>
                                        <span className='nav-link' onClick={handleLogout}>Logout</span>
                                    </>
                                ) : (
                                    <>
                                        <Link onClick={() => setShowLoginModal(true)} className='nav-link'> <SentimentSatisfiedAltIcon /></Link>
                                        <EmailIcon onClick={() => setShowLoginModal(true)} />
                                        <Link onClick={() => setShowLoginModal(true)} className='nav-link'><FavoriteBorderIcon /></Link>
                                        <Link className="nav-link upload-plant-button" to="#"
                                            onClick={() => setShowLoginModal(true)}>Upload Plant</Link>
                                        <Link to="#" onClick={() => setShowLoginModal(true)} className="nav-link">Login</Link>

                                    </>

                                )}
                            </div>
                        )}

                    </div>
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

            <div className="footerNavbar">
                {shouldShowFooterNavbar && <FooterNavbar setShowMainFormModal={setShowMainFormModal} />}
            </div>
        </>
    )
}

export default Navigation