import "./UserPosts.css"
import PostCard from "../PostCard/PostCard"
import Loader from "../Loader/Loader"
import { Row, Col } from "react-bootstrap"

const UserPosts = ({ posts }) => {

    return (
        <div className='userPosts-container'>
            <h4>My Posts</h4>
            <>
                {!posts ?
                    <Loader />
                    :
                    <Row>
                        {posts.map((post) => (
                            <Col key={post._id} xs={4} sm={4} md={3} xl={3}>
                                <PostCard
                                    key={post._id} previousPostData={post}
                                />
                            </Col>
                        ))}
                    </Row>
                }
            </>
        </div>
    )
}

export default UserPosts