import React, { useContext, useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Rating } from '@mui/material'
import userService from "../../services/user.services"
import { AuthContext } from '../../contexts/auth.context'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'


const RatingForm = ({ setShowRatingModal, exchangeData }) => {
    const [ratingValue, setRatingValue] = useState(0)
    const [comment, setComment] = useState('')
    const { loggedUser } = useContext(AuthContext)
    const ratedUserId = exchangeData.givenPost.owner._id

    console.log("esto es lo que me llega por exchangedata", exchangeData)
    //te quedas aqui, comprobando si el echangaedata owner id es undefinded o no y porque te da este error en consola = 


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
        userService.editProfile(ratedUserId, { $push: { ratings: ratingData } })
            .then(response => {
                console.log('Rating submitted:', response.data)
                // TODO manage the rating submission.
                // For example, update some state, 
                setShowRatingModal(false)
            })
            .catch(error => {
                console.error('Error submitting rating:', error)
            })
    }

    return (
        <div>
            <Rating
                name="rating"
                value={ratingValue}
                onChange={(event, newValue) => setRatingValue(newValue)}
                precision={0.5}
                icon={<StarIcon fontSize="inherit" />}
                emptyIcon={<StarBorderIcon fontSize="inherit" />}
            />
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