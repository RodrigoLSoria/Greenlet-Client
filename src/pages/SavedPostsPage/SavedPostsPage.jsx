import React, { useContext, useEffect, useState } from 'react';
import "./SavedPostsPage.css"
import userService from "../../services/user.services"
import { AuthContext } from '../../contexts/auth.context';
import { Col, Row } from "react-bootstrap";
import PostCard from "../../components/PostCard/PostCard";
import Loader from "../../components/Loader/Loader";


const SavedPostsPage = () => {
    const [favoritePosts, setFavoritePosts] = useState([]);
    const { loggedUser } = useContext(AuthContext)

    useEffect(() => {
        fetchUserFavorites();
    }, []);

    const fetchUserFavorites = () => {
        userService
            .getUserFavorites(loggedUser._id)
            .then(response => {
                setFavoritePosts(response.data)
            })
            .catch(error => {
                console.error('Error fetching user favorites:', error);
            });
    }

    return (
        <div className='savedPosts-container'>
            <h4>Favourite Posts</h4>
            <>
                {!favoritePosts ?
                    <Loader />
                    :
                    <Row>
                        {favoritePosts.map((elm) => (
                            <Col key={elm._id} xs={4} sm={4} md={3} xl={3}>
                                <PostCard
                                    previousPostData={elm}
                                />
                            </Col>
                        ))}
                    </Row>
                }
            </>
        </div>
    );
};

export default SavedPostsPage;
