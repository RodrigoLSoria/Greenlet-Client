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
                        <Col key={elm._id} xs={12} sm={6} md={6} lg={6} xl={4} className="mb-4">
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
