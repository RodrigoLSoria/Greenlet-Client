import { Alert, Button, Card, Col, Modal } from "react-bootstrap"
import './PostCard.css'
import { Link } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import MessageForm from "../MessageForm/MessageForm"
import { AuthContext } from "../../contexts/auth.context"
import postsService from "../../services/posts.services"
import NewPostForm from "../NewPostForm/NewPostForm"
import { useLoginModalContext } from '../../contexts/loginModal.context'
import { useSignupModalContext } from '../../contexts/signupModal.context'
import EmailIcon from '@mui/icons-material/Email'
import { useMessageModalContext } from "../../contexts/messageModal.context"
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import formatDate from '../../utils/setPostDate'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import userService from "../../services/user.services"
import { CSSTransition } from 'react-transition-group'

const PostCard = ({ refreshPosts, previousPostData, setPosts }) => {

    const { loggedUser } = useContext(AuthContext)
    const { setShowLoginModal } = useLoginModalContext()
    const { setShowSignupModal } = useSignupModalContext()
    const { showMessageModal, setShowMessageModal } = useMessageModalContext()
    const [showLoginReminder, setShowLoginReminder] = useState(false)
    const [showMessageForm, setShowMessageForm] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [isFavorite, setIsFavorite] = useState(false)



    useEffect(() => {
        if (loggedUser) {
            fetchUserFavorites();
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
                setIsFavorite(true);
            })
            .catch(err => {
                console.error('Error favoriting post:', err);
            });
    }

    const handleUnfavoritePost = () => {
        postsService
            .unfavouritePost(previousPostData._id, loggedUser._id)
            .then(() => {
                setIsFavorite(false);
            })
            .catch(err => {
                console.error('Error unfavoriting post:', err);
            });
    }

    const fetchUserFavorites = () => {
        userService
            .getUserFavorites(loggedUser._id)
            .then(response => {
                const favorites = response.data;

                // Use some() method to check if any favorite has the same _id as previousPostData
                if (favorites.some(favorite => favorite._id === previousPostData._id)) {
                    setIsFavorite(true);
                } else {
                    setIsFavorite(false);
                }
            })
            .catch(error => {
                console.error('Error fetching user favorites:', error);
            });
    }
    return (
        <>
            <Col lg={{ span: 3 }} md={{ span: 6 }}>
                <article>
                    <Card style={{ width: '18rem' }} className={`${previousPostData.isClosed ? 'closed-post' : ''}`}>
                        <Card.Img variant="top" src={previousPostData.image} />
                        <Card.Body>
                            <Card.Title>{previousPostData.title}</Card.Title>
                            <Card.Text>Post by: {previousPostData.owner.username}</Card.Text>
                            <Card.Text>Type: {previousPostData.plantType}</Card.Text>
                            <Card.Text>Posted: {formatDate(previousPostData.createdAt)}</Card.Text>
                            {/* <Link to={`/postDetails/${previousPostData._id}`} className="btn-btn-dark">See Details</Link> */}
                            <EmailIcon onClick={() => setShowMessageForm(!showMessageForm)} />

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
                                            postOwnerId={previousPostData.owner._id}
                                            postId={previousPostData._id}
                                            setShowMessageModal={setShowMessageModal}
                                        />
                                    )}
                                </div>
                            </CSSTransition>

                            {/* {loggedUser ? (
                                loggedUser._id !== previousPostData.owner._id &&
                                <Link onClick={() => setShowMessageModal(true)} className="btn-btn-dark"><EmailIcon /></Link>
                            ) : (
                                <Link onClick={() => setShowLoginReminder(true)} className="btn-btn-dark"><EmailIcon /></Link>
                            )} */}


                            {loggedUser?._id !== previousPostData.owner._id && (
                                isFavorite ? (
                                    <FavoriteIcon onClick={handleUnfavoritePost} />
                                ) : (
                                    <FavoriteBorderIcon onClick={handleFavoritePost} />
                                )
                            )}


                            {loggedUser?._id === previousPostData.owner._id &&
                                <div>
                                    <Button variant='dark' size='sm' onClick={() => setShowEditModal(true)}><EditIcon /></Button>
                                    <Button variant="dark" size='sm' onClick={handleDeletePost}><DeleteIcon /></Button>
                                </div>
                            }
                        </Card.Body>
                    </Card>
                </article>
            </Col>

            {showLoginReminder && (
                <div className="centered-alert">
                    <Alert variant="danger" dismissible>
                        You must
                        <Alert.Link href="#" onClick={() => {
                            setShowLoginModal(true);
                            setShowLoginReminder(false)
                        }}>log in</Alert.Link> to send messages.
                        If you don't have an account <Alert.Link href="#" onClick={() => {
                            setShowSignupModal(true);
                            setShowLoginReminder(false)
                        }}>Sign up.</Alert.Link>
                    </Alert>
                </div>
            )}

            <div className="MessageModal">
                <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)}>
                    <Modal.Body>
                        <MessageForm refreshPosts={refreshPosts} postOwnerId={previousPostData.owner._id} postId={previousPostData._id} setShowMessageModal={setShowMessageModal} />
                    </Modal.Body>
                </Modal>
            </div>

            <div className="EditPostModal">
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Post</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <NewPostForm refreshPosts={refreshPosts} setShowEditModal={setShowEditModal} previousPostData={previousPostData} />
                    </Modal.Body>
                </Modal>
            </div>
        </>
    )
}

export default PostCard