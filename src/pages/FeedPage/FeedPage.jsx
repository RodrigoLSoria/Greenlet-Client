import { useEffect, useState } from "react"
import { Button, Container, Dropdown, Form } from "react-bootstrap"
import postsService from "../../services/posts.services"
import Feed from "../../components/Feed/Feed"
import * as Constants from "../../consts/consts"
import Offcanvas from 'react-bootstrap/Offcanvas'
import Carousel from 'react-bootstrap/Carousel'
import { useFeedRefresh } from '../../contexts/postsRefresh.context'
import setGeolocation from '../../utils/setGeolocation';
import LocationOnIcon from '@mui/icons-material/LocationOn'
import mapsService from "../../services/maps.services"
import alertsService from "../../services/alerts.services"


const FeedPage = () => {

    const [posts, setPosts] = useState()
    const [filteredPosts, setFilteredPosts] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedPlantTypes, setSelectedPlantTypes] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [showOffCanvas, setShowOffCanvas] = useState(false)
    const [dateFilter, setDateFilter] = useState('all')
    const [location, setLocation] = useState('')
    const [showCreateAlertButton, setShowCreateAlertButton] = useState(false)
    const [alertCriteria, setAlertCriteria] = useState(null)

    const { refreshFeed, setRefreshFeed } = useFeedRefresh()


    const handleClose = () => setShowOffCanvas(false);
    const handleShow = () => setShowOffCanvas(true);

    useEffect(() => {
        loadFeed()
        if (refreshFeed) {
            setRefreshFeed(false)
        }
    }, [refreshFeed, searchQuery, selectedCategories, selectedPlantTypes, dateFilter])


    const handleSearch = () => {
        // Show the "Create Alert" button and prepare the alert criteria
        setShowCreateAlertButton(true);
        setAlertCriteria({
            searchQuery,
            selectedCategories,
            selectedPlantTypes,
            dateFilter
        });
    }

    const handleCreateAlert = () => {

        // Save the alert criteria to your database
        // Adjust the API call according to your backend implementation
        alertsService
            .saveAlert(alertCriteria)
            .then(console.log('Alert created successfully!'))
            .catch((err) => { console.log(err) })
    }

    const refreshPosts = () => {
        loadFeed();
    }


    const loadFeed = () => {
        setGeolocation(
            async ({ latitude, longitude }) => {

                try {
                    // Use mapsService to get the reverse geocode data
                    const locationData = await mapsService.reverseGeocode(latitude, longitude);

                    setLocation(`${locationData.data.city}, ${locationData.data.country}`);

                    const isFoundCategorySelected = selectedCategories.includes('found');

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
                            setFilteredPosts(data);
                        })
                        .catch((err) => console.log(err))
                } catch (error) {
                    console.error('Error fetching location:', error);
                }
            })
    }


    const handleInputChange = (e) => {
        const searchWord = e.target.value
        setSearchQuery(searchWord)

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


    return (
        <div className="feedPage">
            <Container>
                <h1>Find the perfect plant for your home</h1>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder='Search...'
                    className="form-control"
                />
                <Button variant="primary" onClick={handleSearch}>Search</Button>
                {showCreateAlertButton && (
                    <Button variant="secondary" onClick={handleCreateAlert}>Create Alert</Button>
                )}
                <LocationOnIcon /> <span>{location}</span>
                <hr />
                <Button variant="primary" onClick={handleShow}>
                    Filters
                </Button>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">Category</Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Form>
                            {Constants.POST_CATEGORIES.map((category) => (
                                <div key={`${category}`} className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        id={`${category}`}
                                        label={`${category}`}
                                        checked={selectedCategories.includes(category)}
                                        onChange={() => handleCategoryToggle(category)}
                                    />
                                </div>
                            ))}
                        </Form>
                        <Dropdown.Item href="#/action-1">Search</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <Dropdown>
                    <Dropdown.Toggle variant="success" id="date-dropdown-basic">Posted</Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setDateFilter('24h')}>Last 24 Hours</Dropdown.Item>
                        <Dropdown.Item onClick={() => setDateFilter('7d')}>Last Week</Dropdown.Item>
                        <Dropdown.Item onClick={() => setDateFilter('30d')}>Last Month</Dropdown.Item>
                        <Dropdown.Item onClick={() => setDateFilter('all')}>All</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <Feed filteredPosts={filteredPosts} setPosts={setPosts} refreshPosts={refreshPosts} />
            </Container>

            <div className="OffCanvas">
                <Offcanvas show={showOffCanvas} onHide={handleClose}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Offcanvas</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <div className="categories">
                            <Form.Label>Category</Form.Label>
                            <Form>
                                {Constants.POST_CATEGORIES.map((category) => (
                                    <div key={`${category}`} className="mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            id={`${category}`}
                                            label={`${category}`}
                                            checked={selectedCategories.includes(category)}
                                            onChange={() => handleCategoryToggle(category)}
                                        />
                                    </div>
                                ))}
                            </Form>
                        </div>
                        <div className="plantTypes">
                            <Form.Label>Plant type</Form.Label>
                            <Form>
                                {Constants.PLANT_TYPES.map((type) => (
                                    <div key={`${type}`} className="mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            id={`${type}`}
                                            label={`${type}`}
                                            checked={selectedPlantTypes.includes(type)}
                                            onChange={() => handlePlantTypeToggle(type)}
                                        />
                                    </div>
                                ))}
                            </Form>
                        </div>
                    </Offcanvas.Body>
                </Offcanvas>
            </div>
        </div >
    )
}

export default FeedPage