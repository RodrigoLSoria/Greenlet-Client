import { useContext, useEffect, useState } from "react"
import { Row, Col, Modal } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from '../../contexts/auth.context'
import userService from '../../services/user.services'
import Loader from "../../components/Loader/Loader"
import SignupForm from '../../components/SignupForm/SignupForm'
import postsService from "../../services/posts.services"
import PostCard from '../../components/PostCard/PostCard'
import exchangeService from "../../services/exchange.services"
import ExchangeCard from "../../components/ExchangeCard/ExchangeCard"
import "./ProfilePage.css"
import UserExchanges from "../../components/UserExchanges/UserExchanges"
import UserPosts from "../../components/UserPosts/UserPosts"
import UserProfile from "../../components/UserProfile/UserProfile"
import SavedPostsPage from "../SavedPostsPage/SavedPostsPage"
import UserBadges from "../../components/UserBadges/UserBadges"
import RatingForm from "../../components/RatingForm/RatingForm"
import { usePosts } from '../../contexts/posts.context'


const ProfilePage = () => {

    const { user_id } = useParams()

    const [user, setUser] = useState({})
    const [posts, setPosts] = useState([])
    const [pendingExchanges, setPendingExchanges] = useState([])
    const [closedExchanges, setClosedExchanges] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [wishlistItem, setWishlistItem] = useState('')
    const [wishlist, setWishlist] = useState(user.wishlist || [])
    const [activeSection, setActiveSection] = useState('profile')
    const [showRatingModal, setShowRatingModal] = useState(false)
    const [selectedExchange, setSelectedExchange] = useState(null)

    const { loggedUser, logout } = useContext(AuthContext)

    const navigate = useNavigate()

    const openPosts = posts.filter(post => !post.isClosed)
    const closedPosts = posts.filter(post => post.isClosed)

    const getMemberSinceYear = (dateString) => {
        return new Date(dateString).getFullYear()
    }


    useEffect(() => {
        loadUserDetails()
        loadUserPosts()
        loadPendingExchanges()
        loadClosedExchanges()
        loadUserDetails()
        loadUserPosts()


    }, [])

    useEffect(() => {
        setWishlist(user.wishlist || [])
    }, [user])

    useEffect(() => {
        setEditData(prevData => ({
            ...prevData,
            wishlist: user.wishlist || []
        }))
    }, [user])

    const [editData, setEditData] = useState({
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
        exchangeService
            .getExchangesForUserByStatus(user_id, status)
            .then(({ data }) => {

                if (status === 'pending') {
                    setPendingExchanges(data)
                } else if (status === 'closed') {
                    setClosedExchanges(data)
                }
            })
            .catch(err => console.log(err))
    }

    const loadPendingExchanges = () => {
        loadExchangesByStatus('pending')
    }

    const loadClosedExchanges = () => {
        loadExchangesByStatus('closed')
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
        e.preventDefault()
        try {
            const updatedWishlist = [...editData.wishlist, wishlistItem]
            const updatedData = { ...editData, wishlist: updatedWishlist }

            await userService.editProfile(user._id, updatedData)
            loadUserDetails()
            setShowModal(false)
            setWishlistItem('')
        } catch (error) {
            console.error("Error updating wishlist: ", error)
        }
    }

    const handleWishlistChange = (e) => {
        setWishlistItem(e.target.value)
    }


    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search)
        const section = searchParams.get('section')
        if (section) {
            handleSidebarClick(section)
        }
    }, [window.location.search])

    const handleSidebarClick = (section) => {
        setActiveSection(section)
        navigate(`/profile/${user_id}?section=${section}`)
    }

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'myPosts':
                return <UserPosts posts={posts} />
            case 'pendingExchanges':
                return <UserExchanges exchanges={pendingExchanges}
                    loadPendingExchanges={loadPendingExchanges}
                    handleShowRatingModal={handleShowRatingModal} />
            case 'myFavourites':
                return <SavedPostsPage />
            case 'myBadges':
                return <UserBadges badges={user.badges} />
            default:
                return null
        }
    }

    const memberSinceYear = user.createdAt ? getMemberSinceYear(user.createdAt) : null
    const exchangeCount = user.exchanges ? user.exchanges.length : 0

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search)
        const section = searchParams.get('section')
        if (section) {
            setActiveSection(section)
        }
    }, [])

    const handleShowRatingModal = (exchange) => {
        setShowRatingModal(true)
        setSelectedExchange(exchange)
    }

    return (


        !user ?
            <Loader />
            :

            <div className="profilePage-container">
                <div className="profile-sidebar">
                    <div className="user-details">
                        <img src={user.avatar} alt={`${user.username}'s avatar`} className="user-avatar" />
                        <h3 className="user-name">{user.username}</h3>
                        <p className="member-since">Member since: {memberSinceYear}</p>
                        <p className="exchanges-count">Exchanges: {exchangeCount}</p>
                        <hr />
                    </div>
                    <div className="sidebar-item" onClick={() => handleSidebarClick('myPosts')}>
                        My Posts
                    </div>
                    <div className="sidebar-item" onClick={() => handleSidebarClick('pendingExchanges')}>
                        Pending Exchanges
                    </div>
                    <div className="sidebar-item" onClick={() => handleSidebarClick('myFavourites')}>
                        Favourites
                    </div>
                    <div className="sidebar-item" onClick={() => handleSidebarClick('myBadges')}>
                        Badges
                    </div>
                </div>
                <div className="profile-content">
                    {renderActiveSection()}
                </div>

                <Modal show={showModal} onHide={() => { setShowModal(false) }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit my profile</Modal.Title>
                    </Modal.Header>
                    <SignupForm loadUserDetails={loadUserDetails} setShowModal={setShowModal} />
                </Modal>

                <Modal show={showRatingModal} onHide={() => setShowRatingModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>You successfully completed a plant exchange!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedExchange && (
                            <RatingForm
                                setShowRatingModal={setShowRatingModal}
                                exchangeData={selectedExchange}
                            />
                        )}
                    </Modal.Body>
                </Modal>
            </div>

    )
}

export default ProfilePage