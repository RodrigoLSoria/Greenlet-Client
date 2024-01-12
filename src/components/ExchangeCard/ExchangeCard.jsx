import './ExchangeCard.css'
import { useContext, useState } from "react"
import { AuthContext } from "../../contexts/auth.context"
import formatDate from '../../utils/setPostDate'
import badgeService from "../../services/badge.services"
import exchangeService from "../../services/exchange.services"
import postsService from "../../services/posts.services"

const ExchangeCard = ({ exchangeData, onExchangeUpdate, handleShowRatingModal }) => {

    const { loggedUser } = useContext(AuthContext)
    const [isDisabled, setIsDisabled] = useState(false)

    const handleBadgeUpdate = () => {
        handleShowRatingModal(exchangeData)
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
                onExchangeUpdate(exchangeData._id);
                setIsDisabled(true)
            })
            .catch(error => {
                console.error("Error in badge and exchange updates:", error)
            })
    }

    return (
        <div className="exchange-card">
            <div className="exchange-image-container">
                <img className="exchange-image"
                    src={exchangeData.givenPost.image}
                    alt={exchangeData.givenPost.title} />
            </div>
            <div className="exchange-info">
                <p className="exchange-title">{exchangeData.givenPost.title}</p>
                <p className="exchange-plantType">Posted: {formatDate(exchangeData.givenPost.createdAt)}</p>
                <p className="exchange-plantType">{exchangeData.givenPost.plantType}</p>
                <hr />
                <p>Did you complete the exchange?</p>
                <button onClick={handleBadgeUpdate}
                    disabled={isDisabled}
                    className="exchange-button">
                    Yes!
                </button>
            </div>
        </div>
    )
}

export default ExchangeCard