import { useEffect, useState } from "react"
import { Button, Container, Dropdown, Form } from "react-bootstrap"
import postsService from "../../services/posts.services"
import Feed from "../../components/Feed/Feed"
import * as Constants from "../../consts/consts"
import Offcanvas from 'react-bootstrap/Offcanvas'
import Carousel from 'react-bootstrap/Carousel'
import setGeolocation from '../../utils/setGeolocation';
import LocationOnIcon from '@mui/icons-material/LocationOn'
import mapsService from "../../services/maps.services"
import alertsService from "../../services/alerts.services"
import { usePosts } from '../../contexts/posts.context';
import "./FeedPage.css"

const FeedPage = () => {
    const { posts } = usePosts()

    return (
        <div className="feedPage">
            <Container>
                <Feed filteredPosts={posts} />
            </Container>

            {/* <div className="OffCanvas">
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