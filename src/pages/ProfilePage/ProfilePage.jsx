import { useContext, useEffect, useState } from "react"
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap"
import { useParams } from "react-router-dom"
import { AuthContext } from '../../contexts/auth.context'
import userService from '../../services/user.services'
import Loader from "../../components/Loader/Loader"
import SignupForm from '../../components/SignupForm/SignupForm'
import postsService from "../../services/posts.services"
import PostCard from '../../components/PostCard/PostCard'
import exchangeService from "../../services/exchange.services"
import ExchangeCard from "../../components/ExchangeCard/ExchangeCard"
import { DataArray } from "@mui/icons-material"
import { useFeedRefresh } from '../../contexts/postsRefresh.context'



const ProfilePage = () => {
    const { user_id } = useParams()

    const [user, setUser] = useState({})
    const [posts, setPosts] = useState([])
    // const [favourites, setFavourites] = useState([])
    const [pendingExchanges, setPendingExchanges] = useState([])
    const [closedExchanges, setClosedExchanges] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [wishlistItem, setWishlistItem] = useState('')
    const [wishlist, setWishlist] = useState(user.wishlist || [])

    const { refreshFeed, setRefreshFeed } = useFeedRefresh()
    const { loggedUser, logout } = useContext(AuthContext)

    const openPosts = posts.filter(post => !post.isClosed);
    const closedPosts = posts.filter(post => post.isClosed)


    // console.log("pendingExchanges", pendingExchanges)
    useEffect(() => {
        loadUserDetails()
        loadUserPosts()
        loadPendingExchanges()
        loadClosedExchanges()
        if (refreshFeed) {
            loadUserDetails();
            loadUserPosts();
            setRefreshFeed(false); // Resetting the refresh state
        }

    }, [refreshFeed])

    useEffect(() => {
        // Update local wishlist when user data is updated
        setWishlist(user.wishlist || []);
    }, [user])

    useEffect(() => {
        setEditData(prevData => ({
            ...prevData,
            wishlist: user.wishlist || []
        }));
    }, [user])

    const [editData, setEditData] = useState({
        // ... other fields,
        wishlist: user.wishlist || []
    })

    const loadUserDetails = () => {
        userService
            .getUserDetails(user_id)
            .then(({ data }) => setUser(data))
            .catch(err => console.log(err))
    }

    const loadUserPosts = () => {
        postsService
            .getPostsByOwner(user_id)
            .then(({ data }) => setPosts(data))
            .catch(err => console.log(err))
    }

    const loadExchangesByStatus = (status) => {
        console.log("este es el status", status, "y este el id del user", user_id)
        exchangeService
            .getExchangesForUserByStatus(user_id, status) // Updated service function name
            .then(({ data }) => {
                console.log("esta e la data q me vuelve", data)

                if (status === 'pending') {
                    setPendingExchanges(data);
                } else if (status === 'closed') {
                    setClosedExchanges(data);
                }
            })
            .catch(err => console.log(err));
    }

    const loadPendingExchanges = () => {
        loadExchangesByStatus('pending');
    }

    const loadClosedExchanges = () => {
        loadExchangesByStatus('closed');
    }


    const handleDeleteUser = () => {
        userService
            .deleteUser(user_id)
            .then(() => {
                logout()
                navigate('/')
            })
            .catch(err => console.log(err))
    }

    const handleWishlistSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedWishlist = [...editData.wishlist, wishlistItem];
            const updatedData = { ...editData, wishlist: updatedWishlist };

            await userService.editProfile(user._id, updatedData);
            loadUserDetails();
            setShowModal(false);
            setWishlistItem('');
        } catch (error) {
            console.error("Error updating wishlist: ", error);
        }
    }

    const handleWishlistChange = (e) => {
        setWishlistItem(e.target.value);
    };



    return (


        !user ?
            <Loader />
            :
            <>
                <Container>

                    <h1 className="mb-4">Welcome to your profile, {user.username}</h1>
                    <Button variant="dark" onClick={handleDeleteUser}>Delete profile</Button>
                    <Button variant="dark" onClick={() => setShowModal(true)}>Edit profile</Button>

                    <Row>
                        <Col md={{ span: 4 }}>
                            <img src={user.avatar} style={{ width: '100%' }} />
                        </Col>
                    </Row>

                    <h2>My Badges</h2>
                    <Row>
                        {user.badges?.map(badge => (
                            <Col key={badge._id} md={4}>
                                <h2>{badge.name}</h2>
                                <img src={badge.imageUrl} style={{ width: '100%' }} />
                            </Col>
                        ))}
                    </Row>
                    <h2>My Wishlist</h2>

                    <ul>
                        {wishlist.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>


                    <Form onSubmit={handleWishlistSubmit}>
                        <Form.Group className="mb-3" controlId="wishlistForm">
                            <Form.Label>Wishlist</Form.Label>
                            <Row>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Add to wishlist"
                                        value={wishlistItem}
                                        onChange={handleWishlistChange}
                                    />
                                </Col>
                                <Col md="auto">
                                    <Button type="submit">Add</Button>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Form>

                    <h2>Pending Exchanges</h2>
                    <Row>
                        {pendingExchanges.map(exchange => (
                            <Col key={exchange._id} md={4}>
                                <ExchangeCard exchangeData={exchange} />
                            </Col>
                        ))}
                    </Row>

                    <h2>My Posts</h2>
                    <Row>
                        {openPosts.map(post => (
                            <Col key={post._id} md={4}>
                                <PostCard previousPostData={post} />
                            </Col>
                        ))}
                    </Row>

                    <h2>My Closed Posts</h2>
                    <Row>
                        {closedPosts.map(post => (
                            <Col key={post._id} md={4}>
                                <PostCard previousPostData={post} />
                            </Col>
                        ))}
                    </Row>
                </Container >

                <Modal show={showModal} onHide={() => { setShowModal(false) }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit my profile</Modal.Title>
                    </Modal.Header>
                    <SignupForm loadUserDetails={loadUserDetails} setShowModal={setShowModal} />
                </Modal>
            </>
    )
}

export default ProfilePage