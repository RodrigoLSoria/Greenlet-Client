import "./UserExchanges.css"
import ExchangeCard from "../ExchangeCard/ExchangeCard"
import Loader from "../Loader/Loader"
import { Row, Col } from "react-bootstrap"
import { useState } from "react"
import { Modal } from "react-bootstrap"
import RatingForm from "../RatingForm/RatingForm"

const UserExchanges = ({ exchanges, loadPendingExchanges, handleShowRatingModal }) => {

    const handleExchangeUpdate = (closedExchangeId) => {
        const updatedExchanges = exchanges.filter(exchange => exchange._id !== closedExchangeId)
        loadPendingExchanges()
    }

    console.log("los exchanges", exchanges)
    return (
        <div className='userExchanges-container' >
            <h4>My pending exchanges</h4>
            <>
                {!exchanges ? (
                    <Loader />
                ) : exchanges.length === 0 ? (
                    <p>Ready for more exchanges? <a href="/">Keep exploring</a> to find your next plant buddy! </p>
                ) : (
                    <>
                        <Row>
                            {exchanges.map((exchange) => (
                                <Col key={exchange._id} xs={12} sm={6} md={4} xl={4}>
                                    <ExchangeCard key={exchange._id} exchangeData={exchange}
                                        onExchangeUpdate={handleExchangeUpdate}
                                        handleShowRatingModal={handleShowRatingModal} />
                                </Col>
                            ))}
                        </Row>
                    </>
                )}
            </>
        </div >
    )
}

export default UserExchanges