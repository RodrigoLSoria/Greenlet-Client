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
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';



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

    const { loggedUser, logout } = useContext(AuthContext)

    const openPosts = posts.filter(post => !post.isClosed);
    const closedPosts = posts.filter(post => post.isClosed)


    // console.log("pendingExchanges", pendingExchanges)
    useEffect(() => {
        loadUserDetails()
        loadUserPosts()
        loadPendingExchanges()
        loadClosedExchanges()
        loadUserDetails();
        loadUserPosts();


    }, [])

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

                if (status === 'pending') {
                    console.log("hay exchanfes con status pendinggggggg")
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
                <div className="profile-component">
                    <div className="sidebar">
                        <List component="nav">
                            <ListItem button>
                                <ListItemIcon>
                                    <SwapHorizIcon />
                                </ListItemIcon>
                                <ListItemText primary="Exchanges" />
                            </ListItem>

                            <ListItem button>
                                <ListItemIcon>
                                    <PostAddIcon />
                                </ListItemIcon>
                                <ListItemText primary="Posts" />
                            </ListItem>

                            <ListItem button>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary="Buzón" />
                            </ListItem>

                            <ListItem button>
                                <ListItemIcon>
                                    <FavoriteIcon />
                                </ListItemIcon>
                                <ListItemText primary="Favoritos" />
                            </ListItem>
                        </List>
                    </div>
                    <div className="content">
                        {/* Content similar to the screenshot should go here */}
                    </div>
                </div>
            </>
    )
}

export default ProfilePage