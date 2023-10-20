import './MessageForm.css'
import React, { useContext, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import messageService from "../../services/messages.services"
import { AuthContext } from "../../contexts/auth.context";
import conversationService from "../../services/conversations.services"
import { useMessageModalContext } from '../../contexts/messageModal.context';
import { SocketContext } from '../../contexts/socket.context'
import exchangeService from '../../services/exchange.services';

const MessageForm = ({ postOwnerId, postId, selectedConversation }) => {

    const { loggedUser } = useContext(AuthContext)
    const { socket } = useContext(SocketContext)
    const { setShowMessageModal } = useMessageModalContext()
    const [messages, setMessages] = useState([])
    const isOwner = loggedUser?._id === selectedConversation?.post.owner


    let receiver

    if (selectedConversation) {
        if (loggedUser._id === selectedConversation.sender._id) {
            receiver = selectedConversation.receiver._id;
        } else if (loggedUser._id === selectedConversation.receiver._id) {
            receiver = selectedConversation.sender._id;
        }
    } else {
        receiver = postOwnerId;
    }

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
                console.log('emit')
                socket.emit('message', messageData)
                setMessages([...messages, messageData])

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
            e.preventDefault();
            handleMessageSubmit(e);
        }
    }

    const handleConfirmExchange = () => {
        // logic for confirming exchange can be implemented here
        console.log("Exchange confirmed!");
        handleSaveExchange()
        // You might want to notify the other user, update the database, etc.
    }
    console.log("esta es la conversatondata de donde tengo que sacar el receiver tdel exchange", conversationData)
    const handleSaveExchange = () => {
        // Define the exchange data based on your data model
        const exchangeData = {
            giver: loggedUser?._id,  // I'm assuming this, adjust based on your requirements
            receiver: receiver,
            givenPost: post,
            // add any other necessary fields
        };

        // Call the service
        exchangeService
            .saveExchange(exchangeData)
            .then(response => {
                console.log("Exchange saved!", response.data);
                // Handle any post-save actions, e.g., notifications, state updates, etc.
            })
            .catch(error => {
                console.error("Failed to save exchange!", error);
                // Handle errors, maybe show a notification or error message to the user.
            });
    };


    return (
        <div className="MessageForm">
            <Form onSubmit={handleMessageSubmit}>
                <Row className="align-items-center">
                    <Col xs={2}>
                        {selectedConversation && isOwner && (
                            <div className="d-grid">
                                <Button variant="warning" onClick={handleConfirmExchange}>
                                    Confirm Exchange/Gift
                                </Button>
                            </div>
                        )}
                    </Col>
                    <Col xs={6}>
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
