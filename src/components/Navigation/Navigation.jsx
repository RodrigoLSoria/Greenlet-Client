import { useContext, useState, useEffect } from "react"
import SignupForm from "../SignupForm/SignupForm"
import LoginForm from "../LoginForm/LoginForm"
import NewPostForm from "../NewPostForm/NewPostForm"
import { AuthContext } from '../../contexts/auth.context'
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useLoginModalContext } from '../../contexts/loginModal.context'
import { useSignupModalContext } from '../../contexts/signupModal.context'
import { usePosts } from "../../contexts/posts.context"
import * as Constants from "../../consts/consts"
import { Button, Modal } from "react-bootstrap"
import "./Navigation.css"
import setGeolocation from '../../utils/setGeolocation'
import mapsService from "../../services/maps.services"
import postsService from "../../services/posts.services"
import EmailIcon from '@mui/icons-material/Email'
import FooterNavbar from "../NavigationFooter/NavigationFooter"
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt'
import { useLoadScript } from "@react-google-maps/api"
import Maps from "../Maps/Maps"
import LocationOnIcon from '@mui/icons-material/LocationOn'
import LogoutIcon from '@mui/icons-material/Logout'
import { useRef } from "react"
import FavoriteIcon from '@mui/icons-material/Favorite'


const Navigation = () => {

    const [location, setLocation] = useState('')
    const [showNewPostFormModal, setShowNewPostFormModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedPlantTypes, setSelectedPlantTypes] = useState([])
    const [dateFilter, setDateFilter] = useState('all')
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
    const [showDateFilterDropdown, setShowDateFilterDropdown] = useState(false)
    const [showPlantTypeModal, setShowPlantTypeModal] = useState(false)
    const [showLocationModal, setShowLocationModal] = useState(false)
    const [center, setCenter] = useState({ lat: 0, lng: 0 })
    const [radius, setRadius] = useState(5000)
    const [showUserOptions, setShowUserOptions] = useState(false)


    const { showLoginModal, setShowLoginModal } = useLoginModalContext()
    const { showSignupModal, setShowSignupModal } = useSignupModalContext()
    const { loggedUser, logout } = useContext(AuthContext)

    const { setPosts } = usePosts()
    const navigate = useNavigate()
    const pageLocation = useLocation()

    const shouldShowFooterNavbar = windowWidth < 1000
    const isFeedPage = pageLocation.pathname === '/'

    const userOptionsRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userOptionsRef.current && !userOptionsRef.current.contains(event.target)) {
                setShowUserOptions(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [userOptionsRef])

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    useEffect(() => {
        loadFeed()

    }, [searchQuery, selectedCategories, selectedPlantTypes, dateFilter, radius])

    useEffect(() => {
        const onSuccess = (position) => {
            const { latitude, longitude } = position.coords
            setCenter({ lat: latitude, lng: longitude })
            setRadius(radius)

            mapsService.reverseGeocode(latitude, longitude)
                .then(response => {
                    const { city, country } = response.data
                    setLocation(`${city}, ${country}`)
                    loadFeed({ lat: latitude, lng: longitude })
                })
                .catch(error => {
                    console.error('Error getting location details:', error)
                    setLocation('Unknown location')
                })
        }

        const onError = () => {
            console.error('Error getting user location')
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(onSuccess, onError)
        } else {
            onError()
        }
    }, [])


    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])


    const loadFeed = (location = {}) => {
        const latitude = location.lat || center.lat
        const longitude = location.lng || center.lng
        const queryParams = {
            searchQuery,
            category: selectedCategories,
            userLatitude: latitude,
            userLongitude: longitude,
            plantType: selectedPlantTypes,
            dateFilter: dateFilter,
            radius: radius
        }

        if (radius !== null) {
            queryParams.radius = radius
        }

        postsService
            .getFilteredPosts(queryParams)
            .then(({ data }) => {
                setPosts(data)
            })
            .catch((err) => console.log(err))
    }


    const onPlaceSelected = (place) => {
        const { lat, lng } = place
        setCenter({ lat, lng })

        mapsService.reverseGeocode(lat, lng)
            .then(response => {
                const { city, country } = response.data
                const distance = radius / 1000
                setLocation(`${distance}km, ${city}, ${country}`)
            })
            .catch(error => {
                console.error('Error in reverse geocoding:', error)
            })

        loadFeed({ lat, lng })
    }


    const handleRadiusChange = (newRadius) => {
        setRadius(newRadius)
        if (newRadius !== 'No limit') {
            mapsService.reverseGeocode(center.lat, center.lng)
                .then(response => {
                    const { city, country } = response.data
                    setLocation(`${newRadius / 1000}km, ${city}, ${country}`)
                })
                .catch(error => {
                    console.error('Error in reverse geocoding:', error)
                    setLocation(`${newRadius / 1000}km, Unknown location`)
                })
        } else {
            mapsService.reverseGeocode(center.lat, center.lng)
                .then(response => {
                    const { city, country } = response.data
                    setLocation(`No limit, ${city}, ${country}`)
                })
                .catch(error => {
                    console.error('Error in reverse geocoding:', error)
                    setLocation(`No limit, Unknown location`)
                })
        }
    }

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    })



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

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            navigate(`/?search=${encodeURIComponent(searchQuery)}`)
            setSearchQuery('')
        }
    }

    const handlePlantTypeModalToggle = () => {
        setShowPlantTypeModal(!showPlantTypeModal)
    }

    const handleLocationModalToggle = () => {
        setShowLocationModal(!showLocationModal)
    }

    const handleSelect = (type) => {
        handlePlantTypeToggle(type)
    }

    const clearFilters = () => {
        setSearchQuery('')
        setSelectedCategories([])
        setSelectedPlantTypes([])
        setDateFilter('all')
        loadFeed()
        setRadius(5000)
    }

    const toggleUserOptions = () => {
        setShowUserOptions(!showUserOptions)
    }

    return (
        <div>
            <nav className="navbar">
                <div className="navbar-container-top">
                    <Link className="nav-link" to="/">
                        <picture>
                            <source srcSet="Logo.png" media="(max-width: 768px)" />
                            <img src="https://res.cloudinary.com/depxadgb3/image/upload/v1704907058/Icon_lkdlwb.png" alt="Greenlet Icon" className="greenlet-icon" />
                        </picture>
                    </Link>

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder='Search in all categories...'
                        className="form-control search-input"
                    />


                    <div className="topRightItems">

                        {!shouldShowFooterNavbar && (
                            <div className="navbar-items" id="navbarItems">
                                {loggedUser ? (
                                    <>
                                        <Link className="nav-link upload-plant-button" to="#"
                                            onClick={() => setShowNewPostFormModal(true)}>Upload Plant</Link>
                                        <Link to={`/profile/${loggedUser?._id}`} className="footer-icon">
                                            <SentimentSatisfiedAltIcon />
                                        </Link>
                                        <Link to={`/getAllForUser/${loggedUser?._id}`} className="footer-icon">
                                            <EmailIcon />
                                        </Link>
                                        <Link to={`/saved/${loggedUser?._id}`} className="footer-icon">
                                            <FavoriteIcon />
                                        </Link>


                                    </>
                                ) : (
                                    <>
                                        <Link className="nav-link upload-plant-button" to="#"
                                            onClick={() => setShowLoginModal(true)}>Upload Plant</Link>
                                        <Link onClick={() => setShowLoginModal(true)} className='nav-link'> <SentimentSatisfiedAltIcon /></Link>
                                        <EmailIcon onClick={() => setShowLoginModal(true)} />
                                        <Link onClick={() => setShowLoginModal(true)} className='nav-link'><FavoriteIcon /></Link>


                                    </>

                                )}

                            </div>
                        )}


                    </div>
                    <div className="user-options" ref={userOptionsRef}>
                        <button onClick={toggleUserOptions} className='logoutIcon'>
                            <LogoutIcon />
                        </button>
                        {showUserOptions && (
                            <div className="user-options-dropdown">
                                {loggedUser ? (
                                    <div onClick={handleLogout} className="user-option">Logout</div>
                                ) : (
                                    <>
                                        <div onClick={() => setShowLoginModal(true)} className="user-option">Login</div>
                                        <div onClick={() => setShowSignupModal(true)} className="user-option">Signup</div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {isFeedPage && (
                    <div className="navbar-container-bottom">
                        <div className="filtering-items">
                            <div className="custom-dropdown">
                                <button
                                    onClick={handleLocationModalToggle}
                                    className={`dropdown-toggle ${radius !== null ? 'button-active' : ''}`}
                                >
                                    <LocationOnIcon /> {location}
                                </button>
                                <Modal show={showLocationModal} onHide={handleLocationModalToggle} size="lg">
                                    <Modal.Header closeButton>
                                        <Modal.Title>Where?</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <div className="location-filter">
                                            <Maps initialCenter={center} radius={radius} onRadiusChange={handleRadiusChange} onPlaceSelected={onPlaceSelected} />
                                        </div>
                                    </Modal.Body>
                                </Modal>
                            </div>

                            <div className="custom-dropdown">
                                <button
                                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                    className={`dropdown-toggle ${selectedCategories.length > 0 ? 'button-active' : ''}`}
                                >
                                    Category
                                </button>
                                {showCategoryDropdown && (
                                    <div className="dropdown-menu">
                                        {Constants.POST_CATEGORIES.map((category) => (
                                            <Button
                                                key={category}
                                                variant={selectedCategories.includes(category) ? 'success' : 'outline-secondary'}
                                                className={`dropdown-item ${selectedCategories.includes(category) ? 'btn-success' : ''}`}
                                                onClick={() => handleCategoryToggle(category)}
                                            >
                                                {category}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="custom-dropdown">
                                <button
                                    onClick={handlePlantTypeModalToggle}
                                    className={`dropdown-toggle ${selectedPlantTypes.length > 0 ? 'button-active' : ''}`}
                                >
                                    Plant Types
                                </button>

                                <Modal show={showPlantTypeModal} onHide={handlePlantTypeModalToggle} size="lg">
                                    <Modal.Header closeButton>
                                        <Modal.Title>Plant Types</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <div className="grid-container">
                                            {Constants.PLANT_TYPES.map((type, index) => (
                                                <Button
                                                    key={index}
                                                    variant={selectedPlantTypes.includes(type) ? 'success' : 'outline-secondary'}
                                                    className="grid-item"
                                                    onClick={() => handleSelect(type)}
                                                >
                                                    <img src={Constants.PLANT_TYPE_LOGOS[type]} alt={type} />
                                                    {type}
                                                </Button>
                                            ))}
                                        </div>
                                    </Modal.Body>
                                </Modal>
                            </div>
                            <div className="custom-dropdown date-filter-dropdown">
                                <button
                                    onClick={() => setShowDateFilterDropdown(!showDateFilterDropdown)}
                                    className={`dropdown-toggle ${dateFilter !== 'all' ? 'button-active' : ''}`}
                                >
                                    Posted
                                </button>
                                {showDateFilterDropdown && (
                                    <div className="dropdown-menu">
                                        <a href="#!" onClick={() => handleDateFilterChange('24h')} className={`dropdown-item ${dateFilter === '24h' ? 'btn-success' : 'btn-outline-secondary'}`}>Last 24 Hours</a>
                                        <a href="#!" onClick={() => handleDateFilterChange('7d')} className={`dropdown-item ${dateFilter === '7d' ? 'btn-success' : 'btn-outline-secondary'}`}>Last Week</a>
                                        <a href="#!" onClick={() => handleDateFilterChange('30d')} className={`dropdown-item ${dateFilter === '30d' ? 'btn-success' : 'btn-outline-secondary'}`}>Last Month</a>
                                        <a href="#!" onClick={() => handleDateFilterChange('all')} className={`dropdown-item ${dateFilter === 'all' ? 'btn-success' : 'btn-outline-secondary'}`}>All</a>
                                    </div>
                                )}
                            </div>
                            <div className="custom-dropdown">
                                <button className="clear-filters-button" onClick={clearFilters}>
                                    Clear Filters
                                </button>
                            </div>
                        </div>
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
                <Modal show={showNewPostFormModal} onHide={() => setShowNewPostFormModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Post</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <NewPostForm showNewPostFormModal={showNewPostFormModal} setShowNewPostFormModal={setShowNewPostFormModal} />
                    </Modal.Body>
                </Modal>
            </div>

            <div className="footerNavbar">
                {shouldShowFooterNavbar && <FooterNavbar setShowNewPostFormModal={setShowNewPostFormModal} />}
            </div>
        </div>
    )
}

export default Navigation