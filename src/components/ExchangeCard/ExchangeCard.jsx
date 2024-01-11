import { Button, Modal, Card, Col } from "react-bootstrap"
import './ExchangeCard.css'
import { useContext, useState } from "react"
import { AuthContext } from "../../contexts/auth.context"
import formatDate from '../../utils/setPostDate'
import badgeService from "../../services/badge.services"
import exchangeService from "../../services/exchange.services"
import postsService from "../../services/posts.services"
import RatingForm from "../RatingForm/RatingForm"

const ExchangeCard = ({ exchangeData }) => {

    const { loggedUser } = useContext(AuthContext)
    const [status, setStatus] = useState(exchangeData.status)
    const [isDisabled, setIsDisabled] = useState(false)
    const [showRatingModal, setShowRatingModal] = useState(false)


    const handleBadgeUpdate = () => {
        const payload = {
            user_id: loggedUser._id,
            plantType: exchangeData.givenPost.plantType,
            count: 1
        }

        badgeService.updateExchangeCount(loggedUser._id, payload)
            .then(({ data: user }) => {
                const totalExchanges = user.exchanges.reduce((acc, exchange) => acc + exchange.count, 0)

                return Promise.all([badgeService.getAllBadges(), totalExchanges, user])
            })
            .then(([badges, totalExchanges, user]) => {
                const eligibleBadges = badges.data.filter(badge => {
                    switch (badge.criteria.type) {
                        case 'exchangesCompleted':
                            return totalExchanges >= badge.criteria.count && !user.badges.includes(badge._id)
                        case 'specificPlantExchanged':
                            const specificPlantExchange = user.exchanges.find(ex => ex.plantType === badge.criteria.plantType)
                            return specificPlantExchange && specificPlantExchange.count === badge.criteria.count && !user.badges.includes(badge._id)
                    }
                })

                const badgePromises = eligibleBadges.map(badge => {
                    return badgeService.addBadgeToUser(loggedUser._id, badge._id)
                        .then(response => {
                            console.log(`Badge ${badge.name} added:`, response.data)
                            alert(`Congrats! You have won a new badge: ${badge.name}`)
                        })
                })

                return Promise.all([...badgePromises,
                exchangeService.updateExchangeStatus(exchangeData._id, 'closed'),
                postsService.closePost(exchangeData.givenPost._id)])
            })
            .then(() => {
                if (onExchangeUpdate) onExchangeUpdate()
                setStatus('closed')
                setIsDisabled(true)
            })
            .catch(error => {
                console.error("Error in badge and exchange updates:", error)
            })
    }

    return (
        <>
            <Col lg={{ span: 3 }} md={{ span: 6 }}>
                <article>
                    <Card style={{
                        width: '18rem', opacity: status === 'closed' ? 0.6 : 1,
                        pointerEvents: status === 'closed' ? 'none' : 'auto'
                    }}>
                        <Card.Img variant="top" src={exchangeData.givenPost.image} />
                        <Card.Body>
                            <Card.Title>{exchangeData.givenPost.title}</Card.Title>
                            <Card.Text>STATUS: {exchangeData.status}</Card.Text>
                            <Card.Text>Type: {exchangeData.givenPost.plantType}</Card.Text>
                            <Card.Text>Posted: {formatDate(exchangeData.givenPost.createdAt)}</Card.Text>
                            <hr />
                            <p>Did you complete the exchange?:</p>
                            <Button onClick={() => { handleBadgeUpdate(); setShowRatingModal(true) }} className="btn-btn-dark" disabled={isDisabled}>
                                Exchange completed
                            </Button>
                        </Card.Body>
                    </Card>
                </article>
            </Col>

            <div className="RatingModal">
                <Modal show={showRatingModal} onHide={() => setShowRatingModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>You succesfully completed a plant exchange!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Now that the transaction is completed you can rate the exchange here:
                        <RatingForm
                            setShowRatingModal={setShowRatingModal}
                            exchangeData={exchangeData}
                        />
                    </Modal.Body>
                </Modal>
            </div>
        </>
    )
}

export default ExchangeCard