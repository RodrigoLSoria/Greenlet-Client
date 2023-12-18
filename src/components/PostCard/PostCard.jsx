import { Modal } from "react-bootstrap"
import './PostCard.css'
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../contexts/auth.context"
import postsService from "../../services/posts.services"
import NewPostForm from "../NewPostForm/NewPostForm"
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import userService from "../../services/user.services"

const PostCard = ({ previousPostData, setPosts, }) => {

    const { loggedUser } = useContext(AuthContext)
    const [showEditModal, setShowEditModal] = useState(false)
    const [isFavorite, setIsFavorite] = useState(false)
    const navigate = useNavigate()


    useEffect(() => {
        if (loggedUser) {
            fetchUserFavorites()
        }
    }, [loggedUser, previousPostData._id])

    const handleDeletePost = () => {
        postsService
            .deletePost(previousPostData._id)
            .then(() => setPosts())
            .catch(err => console.log(err))
    }

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

    // <Card style={{ width: '18rem' }} className={`${previousPostData.isClosed ? 'closed-post' : ''}`}>

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

    const navigateToPostDetails = () => {
        navigate(`/postDetails/${previousPostData._id}`)
    }


    return (
        <>
            <div className="post-card" >
                <div className="post-image-container" >
                    <img className="post-image" onClick={navigateToPostDetails} src={previousPostData.image} alt={previousPostData.title} />
                    <div className="icons-overlay">
                        <div className={`edit-delete-icons ${loggedUser?._id === previousPostData.owner._id ? "" : "hidden"}`}>
                            {loggedUser?._id === previousPostData.owner._id &&
                                <div>
                                    <EditIcon className="edit-icon" onClick={() => setShowEditModal(true)} />
                                    <DeleteIcon className="delete-icon" onClick={() => { handleDeletePost }} />
                                </div>
                            }
                        </div>
                    </div>
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

                <div className="EditPostModal">
                    <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Post</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <NewPostForm setShowEditModal={setShowEditModal} previousPostData={previousPostData} />
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        </>
    )
}

export default PostCard