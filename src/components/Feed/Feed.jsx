import { Col, Row } from "react-bootstrap"
import PostCard from "../PostCard/PostCard"
import Loader from "../Loader/Loader"

const Feed = ({ filteredPosts }) => {


    return (
        <>
            {!filteredPosts ?
                <Loader />
                :
                <Row>
                    {filteredPosts.map((elm) => (
                        <Col key={elm._id} xs={4} sm={4} md={3} xl={3}>
                            <PostCard
                                previousPostData={elm}
                            />
                        </Col>
                    ))}
                </Row>
            }
        </>
    )
}

export default Feed
