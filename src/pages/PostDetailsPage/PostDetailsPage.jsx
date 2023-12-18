import React, { useContext, useEffect, useState } from "react"
import postsService from "../../services/posts.services"
import { useParams } from "react-router-dom"
import Loader from "../../components/Loader/Loader"
import "./PostDetailsPage.css"
import { AuthContext } from "../../contexts/auth.context"
import EmailIcon from '@mui/icons-material/Email'
import { useMessageModalContext } from "../../contexts/messageModal.context"
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import formatDate from '../../utils/setPostDate'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { Alert, Modal } from "react-bootstrap"
import { CSSTransition } from 'react-transition-group'
import { useLoginModalContext } from "../../contexts/loginModal.context"
import { useSignupModalContext } from "../../contexts/signupModal.context"
import userService from "../../services/user.services"
import MessageForm from "../../components/MessageForm/MessageForm"
import NewPostForm from "../../components/NewPostForm/NewPostForm"


const PostDetailsPage = () => {

    const { loggedUser } = useContext(AuthContext)
    const { post_id } = useParams()
    const [postDetails, setPostDetails] = useState()
    const [isFavorite, setIsFavorite] = useState(false)
    const { setShowLoginModal } = useLoginModalContext()
    const { setShowSignupModal } = useSignupModalContext()
    const { showMessageModal, setShowMessageModal } = useMessageModalContext()
    const [showLoginReminder, setShowLoginReminder] = useState(false)
    const [showMessageForm, setShowMessageForm] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)


    useEffect(() => {
        loadPostDetails()
    }, [post_id])

    const loadPostDetails = () => {
        postsService
            .getPostDetails(post_id)
            .then(({ data }) => setPostDetails(data))
            .catch(err => console.log(err))
    }


    useEffect(() => {
        if (loggedUser) {
            fetchUserFavorites()
        }
    }, [loggedUser, post_id])

    const handleDeletePost = () => {
        postsService
            .deletePost(post_id)
            .then(() => setPosts())
            .catch(err => console.log(err))
    }

    const handleFavoritePost = () => {
        postsService
            .favouritePost(post_id, loggedUser._id)
            .then(() => {
                setIsFavorite(true)
            })
            .catch(err => {
                console.error('Error favoriting post:', err)
            })
    }

    // <Card style={{ width: '18rem' }} className={`${postDetails.isClosed ? 'closed-post' : ''}`}>

    const handleUnfavoritePost = () => {
        postsService
            .unfavouritePost(post_id, loggedUser._id)
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

                if (favorites.some(favorite => favorite._id === post_id)) {
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
        !postDetails ? (
            <Loader />
        ) :
            (
                <div className="container">
                    <div className="postDetails-card">
                        <div className="card-header">
                            <div className="owner-info">
                                <img
                                    src={postDetails.owner.avatar}
                                    alt={postDetails.owner.username}
                                    className="avatar"
                                />
                                <div className="owner-name">{postDetails.owner.username}</div>
                                <div className="owner-details">
                                    {/* <div className="owner-rating">{renderStars(postDetails.owner.ratings)}</div> */}
                                    <div className="owner-exchanges">{postDetails.owner.exchanges.length} exchanges</div>
                                </div>
                            </div>
                        </div>
                        <div className="postDetails-image-container">
                            <img className="postDetails-image" src={postDetails.image} alt={postDetails.title} />
                            <div className="icons-overlay">
                                <div className={`edit-delete-icons ${loggedUser?._id === postDetails.owner._id ? "" : "hidden"}`}>
                                    {loggedUser?._id === postDetails.owner._id &&
                                        <div>
                                            <EditIcon className="edit-icon" onClick={() => setShowEditModal(true)} />
                                            <DeleteIcon className="delete-icon" onClick={handleDeletePost} />
                                        </div>
                                    }
                                </div>
                                <div className={`message-icon${loggedUser?._id === postDetails.owner._id ? "hidden" : ""}`}>
                                    {loggedUser ? (
                                        loggedUser._id !== postDetails.owner._id &&
                                        <EmailIcon onClick={() => {
                                            setShowMessageModal(true)
                                        }} />
                                    ) : (
                                        <EmailIcon onClick={() => setShowLoginModal(true)} />
                                    )}

                                    <CSSTransition
                                        in={showMessageForm}
                                        timeout={300}
                                        classNames="message-form"
                                        unmountOnExit
                                    >
                                        <div>
                                            {showMessageForm && (
                                                <MessageForm
                                                    refreshPosts={refreshPosts}
                                                    postOwnerId={postDetails.owner._id}
                                                    postId={post_id}
                                                    setShowMessageModal={setShowMessageModal}
                                                />
                                            )}
                                        </div>
                                    </CSSTransition>
                                </div>
                            </div>
                        </div>
                        <div className="postDetails-info">
                            <h2 className="postDetails-title">{postDetails.title}</h2>
                            <h4 className="postDetails-plantType">{postDetails.plantType} </h4>
                            <hr />
                            <p><strong>Description: </strong>{postDetails.description}</p>

                            <div className="favourite-icon">
                                {loggedUser?._id !== postDetails.owner._id && (
                                    isFavorite ? (
                                        <FavoriteIcon onClick={handleUnfavoritePost} />
                                    ) : (
                                        <FavoriteBorderIcon onClick={handleFavoritePost} />
                                    )
                                )}
                            </div>

                        </div>


                        {showLoginReminder && (
                            <div className="centered-alert">
                                <Alert variant="danger" dismissible>
                                    You must
                                    <Alert.Link href="#" onClick={() => {
                                        setShowLoginModal(true)
                                        setShowLoginReminder(false)
                                    }}>log in</Alert.Link> to send messages.
                                    If you don't have an account <Alert.Link href="#" onClick={() => {
                                        setShowSignupModal(true)
                                        setShowLoginReminder(false)
                                    }}>Sign up.</Alert.Link>
                                </Alert>
                            </div>
                        )}

                        <div className="MessageModal">
                            <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)}>
                                <Modal.Body>
                                    <MessageForm postOwnerId={postDetails.owner._id} postId={post_id} setShowMessageModal={setShowMessageModal} />
                                </Modal.Body>
                            </Modal>
                        </div>

                        <div className="EditPostModal">
                            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Edit Post</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <NewPostForm setShowEditModal={setShowEditModal} previousPostData={postDetails} />
                                </Modal.Body>
                            </Modal>
                        </div>
                    </div>
                </div>
            )
    )
}

export default PostDetailsPage


