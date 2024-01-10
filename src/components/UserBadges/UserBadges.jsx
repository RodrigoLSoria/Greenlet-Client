import React from 'react'
import "./UserBadges.css"
import Loader from '../Loader/Loader'
import { Row, Col } from 'react-bootstrap'
const UserBadges = ({ badges }) => {

    console.log("badges", badges)


    return (
        <div className='user-badges'>
            <h4>My badges</h4>
            <>
                {!badges ? (
                    <Loader />
                ) : badges.length === 0 ? (
                    <p>You don't have any badges yet, <a href="/">Keep exploring</a> and making exchanges to earn your first badge!</p>
                ) : (
                    <Row>
                        {badges.map((badge) => (
                            <Col key={badge._id} xs={4} sm={4} md={3} xl={3}>
                                <img src={badge.imageUrl} alt={badge.name} />
                                <div className="badge-content">
                                    <h6>{badge.name}</h6>
                                    <p><em>{badge.description}</em></p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                )}
            </>
        </div>
    )
}

export default UserBadges
