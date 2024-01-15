import React, { useContext, useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Rating } from '@mui/material'
import userService from "../../services/user.services"
import { AuthContext } from '../../contexts/auth.context'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import "./RatingForm.css"


const RatingForm = ({ setShowRatingModal, exchangeData }) => {
    const [ratingValue, setRatingValue] = useState(0)
    const [comment, setComment] = useState('')
    const { loggedUser } = useContext(AuthContext)
    const ratedUserId = exchangeData.receiver._id


    const handleSubmit = () => {
        const ratingData = {
            rater: loggedUser._id,
            value: ratingValue,
            comment: comment,
            exchangeId: exchangeData._id,
        }
        submitRating(ratedUserId, ratingData)
    }

    const submitRating = (ratedUserId, ratingData) => {
        userService.addRating(ratedUserId, ratingData)
            .then(response => {
                console.log('Rating submitted:', response.data)
                setShowRatingModal(false)
            })
            .catch(error => {
                console.error('Error submitting rating:', error)
            })
    }

    return (
        <div className="rating-form-container">
            <div className="rating-stars">
                <Rating
                    name="rating"
                    value={ratingValue}
                    onChange={(event, newValue) => setRatingValue(newValue)}
                    precision={0.5}
                    icon={<StarIcon fontSize="inherit" />}
                    emptyIcon={<StarBorderIcon fontSize="inherit" />}
                />
            </div>
            <textarea
                placeholder="Leave a comment (optional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <Button onClick={handleSubmit}>Submit Rating</Button>
        </div>
    )
}

export default RatingForm