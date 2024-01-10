import "./UserPosts.css"
import PostCard from "../PostCard/PostCard"
import Loader from "../Loader/Loader"
import { Row, Col } from "react-bootstrap"

const UserPosts = ({ posts }) => {

    return (
        <div className='userPosts-container'>
            <h4>My Posts</h4>
            <>
                {!posts ? (
                    <Loader />
                ) : posts.length === 0 ? (
                    <p>Create a new post and share your plant journey with the community!</p>
                ) : (
                    <Row>
                        {posts.map((post) => (
                            <Col key={post._id} xs={12} sm={6} md={4} xl={4}>
                                <PostCard key={post._id} previousPostData={post} />
                            </Col>
                        ))}
                    </Row>
                )}
            </>
        </div>
    )
}

export default UserPosts