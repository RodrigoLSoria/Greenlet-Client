import React, { useEffect, useState } from "react"
import postsService from "../../services/posts.services"
import { Container, Row } from "react-bootstrap"
import { useParams } from "react-router-dom"



const PostDetailsPage = () => {

    const { post_id } = useParams()

    const [postDetails, setPostDetails] = useState();


    useEffect(() => {
        loadPostDetails()
    }, [post_id])

    const loadPostDetails = () => {
        postsService
            .getPostDetails(post_id)
            .then(({ data }) => setPostDetails(data))
            .catch(err => console.log(err))
    }

    return (
        <>
            <Container>

                <h1 className="mb-4">{postDetails?.title}</h1>
                <hr />

                <Row>

                    {/* <Col md={{ span: 6, offset: 1 }}> */}
                    <h3>Info</h3>
                    <p>{postDetails?.description}</p>
                    {/* <ul>
                            
                            <li>{event.address}</li>
                        </ul>
                        {loggedUser &&
                            <Button variant="dark" onClick={}>Send a Message</Button>
                        }
                        <Button variant="dark" onClick={handleRemoveEvent}>Remove Event</Button>
                        <hr />
                        <Button variant='dark' size='sm' onClick={() => setShowModal(true)}>Edit event</Button>
                        <Modal show={showModal} onHide={() => { setShowModal(false) }}>
                            <Modal.Header closeButton>
                                <Modal.Title>Edit event</Modal.Title>
                            </Modal.Header>
                            <EditEventForm event={event} fireFinalActions={fireFinalActions} />
                        </Modal>
                        <Link to='/events' className="btn btn-dark">Volver a la galería</Link>
                    </Col>
                    <Col md={{ span: 4 }}>
                        <img src={event.icon} style={{ width: '100%' }} />
                    </Col>
                    <Col>
                        <Maps event={event} />
                    </Col> */}
                </Row>
            </Container >
        </>
    )
}

export default PostDetailsPage