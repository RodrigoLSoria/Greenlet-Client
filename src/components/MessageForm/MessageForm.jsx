import React, { useContext, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import messageService from "../../services/messages.services"
import { AuthContext } from "../../contexts/auth.context";
import conversationService from "../../services/conversations.services"
import { useMessageModalContext } from '../../contexts/messageModal.context';
import './MessageForm.css'


const MessageForm = ({ postOwnerId, postId, socket, selectedConversation }) => {

    const { loggedUser } = useContext(AuthContext)
    const [messages, setMessages] = useState([])
    const { setShowMessageModal } = useMessageModalContext();

    const receiver = selectedConversation ? selectedConversation.receiver._id : postOwnerId;
    const post = selectedConversation ? selectedConversation.post?._id : postId

    const [messageData, setMessageData] = useState({
        sender: loggedUser?._id,
        receiver: receiver,
        content: ''
    });

    const conversationData = {
        sender: loggedUser?._id,
        receiver: receiver,
        post: post,
        messages: [],
        message_id: null
    }

    const handleInputChange = e => {
        const { name, value } = e.target;
        setMessageData({
            ...messageData,
            [name]: value,
        });
    }

    const handleMessageSubmit = e => {
        e.preventDefault();

        messageService
            .sendMessage(messageData)
            .then((messageData) => {

                setShowMessageModal(false)
                socket.emit('message', messageData)
                // setMessages([...messages, messageData])

                const message_id = messageData.data._id
                conversationData.messages.push(message_id)
                conversationData.message_id = message_id

                conversationService
                    .saveConversation(conversationData)
                    .then(() => { console.log("this is the conversationData", conversationData) })
                    .catch(err => console.log(err))

            })
            .catch(err => {
                console.log(err)
            })



    }

    const handleTextareaKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent the default newline behavior
            handleMessageSubmit(e); // Trigger the form submission
        }
    }

    return (
        <div className="MessageForm">
            <Form onSubmit={handleMessageSubmit}>
                <Row className="align-items-center">
                    <Col xs={8}>
                        <Form.Group controlId="formBasicContent">
                            <Form.Control
                                as="textarea"
                                name="content"
                                value={messageData.content}
                                onChange={handleInputChange}
                                onKeyPress={handleTextareaKeyPress}
                                rows={1}
                                placeholder="Type your message..."
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={4}>
                        <div className="d-grid">
                            <Button variant="primary" type="submit">
                                Send
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
export default MessageForm;
