import { Alert, Button, Card, Col } from "react-bootstrap"
import './ExchangeCard.css'
import { Link } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../../contexts/auth.context"
import formatDate from '../../utils/setPostDate'
import badgeService from "../../services/badge.services"

const ExchangeCard = ({ exchangeData }) => {

    const { loggedUser } = useContext(AuthContext)


    const handleBadgeUpdate = () => {
        // Construct payload for API call
        const payload = {
            user_id: loggedUser._id,
            plantType: exchangeData.givenPost.plantType,
            count: 1 // Assuming one exchange at a time
        };

        badgeService
            .updateExchangeCount(loggedUser._id, payload)
            .then(response => {
                console.log(response.data);
                // Here you can show some alert/notification to the user that the exchange has been completed and badges (if any) awarded.
            })
            .catch(error => {
                console.error("Error updating exchange and evaluating badges:", error);
                // Handle errors here, e.g., show an alert to the user
            })
    }

    return (
        <>
            <Col lg={{ span: 3 }} md={{ span: 6 }}>
                <article>
                    <Card style={{ width: '18rem' }}>
                        <Card.Img variant="top" src={exchangeData.givenPost.image} />
                        <Card.Body>
                            <Card.Title>{exchangeData.givenPost.title}</Card.Title>
                            <Card.Text>STATUS: {exchangeData.status}</Card.Text>
                            <Card.Text>Post by: {exchangeData.givenPost.owner.username}</Card.Text>
                            <Card.Text>Type: {exchangeData.givenPost.plantType}</Card.Text>
                            <Card.Text>Posted: {formatDate(exchangeData.givenPost.createdAt)}</Card.Text>
                            <Button onClick={handleBadgeUpdate} className="btn-btn-dark">Exchange completed</Button>
                        </Card.Body>
                    </Card>
                </article>
            </Col>
        </>
    )
}

export default ExchangeCard