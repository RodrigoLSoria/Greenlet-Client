import './PostCard.css'
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../../contexts/auth.context"
import postsService from "../../services/posts.services"
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import userService from "../../services/user.services"


const PostCard = ({ previousPostData }) => {

    const { loggedUser } = useContext(AuthContext)
    const [isFavorite, setIsFavorite] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (loggedUser) {
            fetchUserFavorites()
        }
    }, [loggedUser, previousPostData._id])

    const handleFavoritePost = () => {
        postsService
            .favouritePost(previousPostData._id, loggedUser._id)
            .then(() => {
                setIsFavorite(true)
            })
            .catch(err => {
                console.error('Error favoriting post:', err)
            })
    }

    const handleUnfavoritePost = () => {
        postsService
            .unfavouritePost(previousPostData._id, loggedUser._id)
            .then(() => {
                setIsFavorite(false)
            })
            .catch(err => {
                console.error('Error unfavoriting post:', err)
            })
    }
    const fetchUserFavorites = () => {
        userService
            .getUserFavorites(loggedUser._id)
            .then(response => {
                const favorites = response.data

                if (favorites.some(favorite => favorite._id === previousPostData._id)) {
                    setIsFavorite(true)
                } else {
                    setIsFavorite(false)
                }
            })
            .catch(error => {
                console.error('Error fetching user favorites:', error)
            })
    }


    return (
        <>
            <div className="post-card" >
                <div className="post-image-container" >
                    <Link to={`/postDetails/${previousPostData._id}`}><img className="post-image"
                        src={previousPostData.image}
                        alt={previousPostData.title} /></Link>
                    <div className="post-info">
                        <p className="post-title">{previousPostData.title}</p>
                        <p className="post-plantType">{previousPostData.plantType} </p>

                        <div className="favourite-icon">
                            {loggedUser?._id !== previousPostData.owner._id && (
                                isFavorite ? (
                                    <FavoriteIcon onClick={handleUnfavoritePost} />
                                ) : (
                                    <FavoriteBorderIcon onClick={handleFavoritePost} />
                                )
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default PostCard