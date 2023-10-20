import { useEffect, useState } from "react"
import { Button, Container, Dropdown, Form } from "react-bootstrap"
import postsService from "../../services/posts.services"
import Feed from "../../components/Feed/Feed"
import * as Constants from "../../consts/consts"
import Offcanvas from 'react-bootstrap/Offcanvas'
import setGeolocation from "../../utils/setGeolocation"
import Carousel from 'react-bootstrap/Carousel'


const FeedPage = () => {

    const [posts, setPosts] = useState()
    const [filteredPosts, setFilteredPosts] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedPlantTypes, setSelectedPlantTypes] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [showOffCanvas, setShowOffCanvas] = useState(false)
    const [dateFilter, setDateFilter] = useState('all');

    const handleClose = () => setShowOffCanvas(false);
    const handleShow = () => setShowOffCanvas(true);


    useEffect(() => {
        loadFeed();

    }, [searchQuery, selectedCategories, selectedPlantTypes, dateFilter]);


    const refreshPosts = () => {
        loadFeed();
    }


    const loadFeed = () => {
        setGeolocation(
            ({ latitude, longitude }) => {

                const queryParams = {
                    searchQuery,
                    category: selectedCategories,
                    userLatitude: latitude,
                    userLongitude: longitude,
                    plantType: selectedPlantTypes,
                    dateFilter
                }

                postsService
                    .getFilteredPosts(queryParams)
                    .then(({ data }) => {
                        setFilteredPosts(data);
                    })
                    .catch((err) => console.log(err));
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