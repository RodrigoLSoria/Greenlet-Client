import React from 'react'
import "./UserBadges.css"

const UserBadges = ({ badges }) => {

    console.log("badges", badges)


    return (
        <div className="user-badges">
            <h1>My badges</h1>
            {badges.map((badge) => (
                <div key={badge._id} className="badge">
                    <img src={badge.imageUrl} alt={badge.name} />
                    <div className="badge-content">
                        <h6>{badge.name}</h6>
                        <p><em>{badge.description}</em></p>
                    </div>
                </div>
            ))}
        </div>
    )
} 

export default UserBadges
