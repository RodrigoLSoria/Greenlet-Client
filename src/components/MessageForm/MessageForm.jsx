import './MessageForm.css'
import React, { useContext, useEffect, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import messageService from "../../services/messages.services"
import { AuthContext } from "../../contexts/auth.context";
import conversationService from "../../services/conversations.services"
import { useMessageModalContext } from '../../contexts/messageModal.context';
import { SocketContext } from '../../contexts/socket.context'
import exchangeService from '../../services/exchange.services';
import { useExchangeStatusContext } from '../../contexts/exchangeStatus.context';
import SendIcon from '@mui/icons-material/Send';

const MessageForm = ({ postOwnerId, postId, selectedConversation }) => {

    // console.log("en linea 1, asi me llegan el postOwner y el postID", postOwnerId, postId)

    const { loggedUser } = useContext(AuthContext)
    const { socket } = useContext(SocketContext)
    const { setShowMessageModal } = useMessageModalContext()
    const { exchangeStatus, updateExchangeStatus } = useExchangeStatusContext();

    const [messages, setMessages] = useState([])
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)

    const isOwner = loggedUser?._id === selectedConversation?.post.owner

    let receiver = postOwnerId

    // if (selectedConversation) {
    //     if (loggedUser._id === selectedConversation.sender._id) {
    //         receiver = selectedConversation.receiver._id;
    //         console.log("loggedUser._id === selectedConversation.sender._id", loggedUser._id === selectedConversation.sender._id)
    //     } else if (loggedUser._id === selectedConversation.receiver._id) {
    //         receiver = selectedConversation.sender._id;
    //         console.log("loggedUser._id === selectedConversation.receiver._id", loggedUser._id === selectedConversation.receiver._id)
    //     }
    // } else {
    //     receiver = postOwnerId;
    // }

    // const post = selectedConversation ? selectedConversation.post?._id : postId
    const post = postId
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
    useEffect(() => {
        setMessageData({
            ...messageData,
            receiver: postOwnerId
        });
    }, [postOwnerId, postId, selectedConversation])

    useEffect(() => {
        if (loggedUser?._id && selectedConversation?._id) {
            // Here, we check for 'pending' exchanges for the logged-in user
            exchangeService
                .getExchangesForUserByStatus(loggedUser._id, 'pending')
                .then(({ data }) => {

                    const pendingExchanges = data.filter(
                        exchange => exchange.status === 'pending'
                    );

                    const relevantExchange = pendingExchanges.find(
                        exchange => exchange.givenPost._id === post
                    );

                    if (relevantExchange) {
                        setIsButtonDisabled(true);
                    }
                })
                .catch(error => {
                    console.error("Failed to fetch pending exchanges!", error);
                });
        }
    }, [loggedUser, selectedConversation, post])


    const handleInputChange = e => {
        const { name, value } = e.target;
        setMessageData({
            ...messageData,
            [name]: value,
        });
    }
    const handleMessageSubmit = e => {
        e.preventDefault();
        // console.log("esto es lo que me llega por post, por loggeduseer y receiver, el villain tiene id 65325a2003d536524c9b6c52   el fulanito tiene id 65325a7d03d536524c9b6c5a , el post del paraiso tiene id 65377cc04bbb7e9b974d48a4 (es de fulanito) el post de la cinta tiene id 653787ca4bbb7e9b974d49ea   (es de villain) a cointnuacion los valores de receiver y post respectivamente:", receiver, post,)
        // Check for existing conversation between the sender and receiver for the post
        conversationService
            .getConversation(loggedUser?._id, receiver, post)
            .then(response => {
                const existingConversation = response.data;

                existingConversation &&
                    sendMessageToConversation(existingConversation._id);

            })
            .catch(err => console.log(err));
    }

    const sendMessageToConversation = async (conversationId) => {
        const fullMessageData = {
            ...messageData,
            conversation: conversationId
        }

        console.log("---------------------------- lets pray for an id esto es lo que hay dentro de fullmesageData", fullMessageData)

        try {
            const { data: sentMessage } = await messageService.sendMessage(fullMessageData);

            if (!sentMessage?._id) {
                console.error("Failed to save the message or get its ID!");
                return;
            }

            const updateData = {
                conversationId: conversationId,
                messageId: sentMessage._id
            };

            // console.log("esto es lo que hay en el updateDate", updateData)

            setTimeout(async () => {
                console.log("esto es lo que hay dentro de settiemout cuando le paso el update data", updateData)
                try {
                    const { data: updatedConversation } = await conversationService
                        .updateConversation(updateData);

                    if (!updatedConversation) {
                        console.error("Failed to update the conversation!");
                        return;
                    }

                    // Close the message modal, send the message through the socket, and update the local messages state
                    setShowMessageModal(false);
                    socket.emit('message', sentMessage);
                    setMessages(prevMessages => [...prevMessages, sentMessage]);
                } catch (err) {
                    console.error("Error while updating the conversation:", err);
                }
            }, 1000)
        } catch (err) {
            console.error("Error while sending the message:", err);
        }
    }



    const handleTextareaKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleMessageSubmit(e);
        }
    }

    const handleConfirmExchange = () => {
        setIsButtonDisabled(true)
        handleSaveExchange()
        updateExchangeStatus('PENDING')
        // You might want to notify the other user, update the database, etc.
    }
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
                                <Button variant="warning" onClick={handleConfirmExchange}
                                    disabled={isButtonDisabled}>
                                    Confirm Exchange/Gift
                                </Button>
                            </div>
                        )}
                    </Col>
                    <Col xs={8}>
                        <Form.Group controlId="formBasicContent">
                            <Form.Control
                                as="textarea"
                                name="content"
                                value={messageData.content}
                                onChange={handleInputChange}
                                onKeyPress={handleTextareaKeyPress}
                                rows={3}
                                placeholder="Type your message..."
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={2}>
                        <div className="d-grid">
                            {/* This div will act as the submit button for the form */}
                            <div onClick={handleMessageSubmit} style={{ cursor: 'pointer' }}>
                                <SendIcon />
                            </div>
                        </div>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
export default MessageForm;
