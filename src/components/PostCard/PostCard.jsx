import { Alert, Button, Card, Col, Modal } from "react-bootstrap"
import './PostCard.css'
import { Link } from "react-router-dom"
import { useContext, useState } from "react"
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

const PostCard = ({ refreshPosts, previousPostData, setPosts, socket }) => {

    const { setShowLoginModal } = useLoginModalContext()
    const { setShowSignupModal } = useSignupModalContext()
    const { showMessageModal, setShowMessageModal } = useMessageModalContext()
    const [showLoginReminder, setShowLoginReminder] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)

    const { loggedUser } = useContext(AuthContext)

    const handleDeletePost = () => {
        postsService
            .deletePost(previousPostData._id)
            .then(() => setPosts())
            .catch(err => console.log(err))
    }

    console.log(previousPostData)
    return (
        <>
            <Col lg={{ span: 3 }} md={{ span: 6 }}>
                <article>
                    <Card style={{ width: '18rem' }}>
                        <Card.Img variant="top" src={previousPostData.image} />
                        <Card.Body>
                            <Card.Title>{previousPostData.title}</Card.Title>
                            <Card.Text>Post by: {previousPostData.owner.username}</Card.Text>
                            <Card.Text>Type: {previousPostData.plantType}</Card.Text>
                            <Card.Text>Posted: {formatDate(previousPostData.createdAt)}</Card.Text>
                            <Link to={`/postDetails/${previousPostData._id}`} className="btn-btn-dark">See Details</Link>
                            {
                                loggedUser ?
                                    <Link onClick={() => setShowMessageModal(true)} className="btn-btn-dark"><EmailIcon /></Link>
                                    :
                                    <Link onClick={() => setShowLoginReminder(true)} className="btn-btn-dark"><EmailIcon /></Link>

                            }

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
                        <MessageForm refreshPosts={refreshPosts} postOwnerId={previousPostData.owner._id} postId={previousPostData._id} setShowMessageModal={setShowMessageModal} socket={socket} />
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