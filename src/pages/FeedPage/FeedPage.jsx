import { useEffect, useState } from "react"
import { Button, Container, Dropdown, Form } from "react-bootstrap"
import postsService from "../../services/posts.services"
import Feed from "../../components/Feed/Feed"
import * as Constants from "../../consts/consts"
import Offcanvas from 'react-bootstrap/Offcanvas'
import Carousel from 'react-bootstrap/Carousel'
import { useFeedRefresh } from '../../contexts/postsRefresh.context'
import setGeolocation from '../../utils/setGeolocation'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import mapsService from "../../services/maps.services"
import alertsService from "../../services/alerts.services"
import { useSearchContext } from '../../contexts/search.Context'
import { useFilterContext } from "../../contexts/filter.context"



const FeedPage = () => {

    const [posts, setPosts] = useState()
    const [filteredPosts, setFilteredPosts] = useState([])
    const [showOffCanvas, setShowOffCanvas] = useState(false)
    const [location, setLocation] = useState('')
    const [showCreateAlertButton, setShowCreateAlertButton] = useState(false)
    const [alertCriteria, setAlertCriteria] = useState(null)
    const { searchQuery } = useSearchContext()

    const { refreshFeed, setRefreshFeed } = useFeedRefresh()
    const { selectedCategories, selectedPlantTypes, dateFilter } = useFilterContext();



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


    const refreshPosts = () => {
        loadFeed();
    }


    const loadFeed = () => {
        // If you need latitude and longitude, you should also manage them in your LocationContext
        const queryParams = {
            searchQuery,
            category: selectedCategories,
            dateFilter: dateFilter,
            // Add latitude and longitude to the query if needed
        };

        postsService.getFilteredPosts(queryParams)
            .then(({ data }) => {
                setFilteredPosts(data);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        loadFeed();
        if (refreshFeed) {
            setRefreshFeed(false);
        }
    }, [refreshFeed, searchQuery, selectedCategories, selectedPlantTypes, dateFilter, location]);


    return (
        <div className="feedPage">
            {/* <Container>
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
            </div> */}
        </div >
    )
}

export default FeedPage