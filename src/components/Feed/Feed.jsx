import { Col, Row } from "react-bootstrap";
import PostCard from "../PostCard/PostCard";
import Loader from "../Loader/Loader";

const Feed = ({ refreshPosts, filteredPosts, setPosts }) => {

    return (
        <>
            {!filteredPosts ?
                <Loader />
                :
                <Row>
                    {filteredPosts.map((elm) => (
                        <Col key={elm._id} sm={4} xl={4}>
                            <PostCard
                                refreshPosts={refreshPosts}
                                previousPostData={elm}
                                setPosts={setPosts}
                            />
                        </Col>
                    ))}
                </Row>
            }
        </>
    );
}

export default Feed;
