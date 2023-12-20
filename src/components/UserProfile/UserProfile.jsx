import React from 'react'
import "./UserProfile.css"

const UserProfile = ({ user }) => {
    const exchangeCount = user.exchanges?.length
    const memberSinceYear = new Date(user.createdAt).getFullYear()

    return (
        <div className="user-profile">
            <div className="avatar-container">
                <img src={user.avatar} alt={`${user.username}'s avatar`} className="avatar" />
            </div>
            <h2 className="username">{user.username}</h2>
            <p className="bio">"{user.bio}."</p>
            <div className="additional-info">
                <span className="exchanges">Exchanges: {exchangeCount}</span>
                <span className="member-since">Member since: {memberSinceYear}</span>
            </div>
        </div>
    )
}

export default UserProfile
