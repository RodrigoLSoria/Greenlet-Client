import { Col, Row } from "react-bootstrap"
import PostCard from "../PostCard/PostCard"
import Loader from "../Loader/Loader"

const Feed = ({ filteredPosts }) => {



    return (
        <>
            {!filteredPosts ?
                <Loader />
                :
                <Row className="justify-content-start">
                    {filteredPosts.map((elm) => (
                        <Col key={elm._id} xs={6} sm={4} md={4} xl={3} className="mb-4">
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
