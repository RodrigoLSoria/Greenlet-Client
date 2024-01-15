import Loader from "../Loader/Loader"
import ConversationDisplay from "../ConversationDisplay/ConversationDisplay"
import "./Inbox.css"
import ChatItem from "../ChatItem/ChatItem"
import { SocketContext } from '../../contexts/socket.context'
import React, { useEffect, useState, useContext } from 'react'
import conversationService from "../../services/conversations.services"
import { Modal } from "react-bootstrap"

const Inbox = ({ conversations, setConversations }) => {

    const [selectedConversation, setSelectedConversation] = useState(null)
    const [showExchangeCompleteModal, setShowExchangeCompleteModal] = useState(false)

    const updateConversationExchangeStatus = (conversationId, newStatus) => {
        const updatedConversations = conversations.map(conversation =>
            conversation._id === conversationId ? { ...conversation, exchangeStatus: newStatus } : conversation
        )
        setConversations(updatedConversations)
    }

    const { socket } = useContext(SocketContext)

    useEffect(() => {
        const handleNewMessage = (newMessage) => {
            setConversations(prevConversations => {
                return prevConversations.map(convo => {
                    if (convo._id === newMessage.conversation) {
                        return { ...convo, messages: [...convo.messages, newMessage] }
                    }
                    return convo
                })
            })
        }

        if (socket) {
            socket.on("newMessage", handleNewMessage)
        }

        return () => {
            if (socket) {
                socket.off("newMessage", handleNewMessage)
            }
        }
    }, [socket, setConversations])


    const handleConversationClick = (conversation) => {
        setSelectedConversation(null)
        if (conversation.exchangeStatus === 'closed') {
            setShowExchangeCompleteModal(true)
        } else {
            setShowExchangeCompleteModal(false)
        }
        fetchMessagesForConversation(conversation._id)
            .then(messages => {
                setSelectedConversation({
                    ...conversation,
                    messages: messages,
                })
            })
            .catch(err => console.error('Error fetching messages:', err))
    }

    const fetchMessagesForConversation = async (conversationId) => {
        try {
            const { data } = await conversationService.getMessagesForConversation(conversationId)
            return data
        } catch (err) {
            throw err
        }
    }

    return (
        <div className="inbox-container">
            <div className="sidebar">
                <div className="sidebar-list">
                    {!conversations ? (
                        <Loader />
                    ) : (
                        conversations.map((conversation) => (
                            <ChatItem
                                key={conversation._id}
                                conversationData={conversation}
                                onClick={() => {
                                    handleConversationClick(conversation)
                                }}
                                selected={selectedConversation?._id === conversation._id}
                            />
                        ))
                    )}
                </div>
            </div>
            <div className="chat-panel">
                {selectedConversation && (
                    <ConversationDisplay selectedConversation={selectedConversation}
                        updateConversationExchangeStatus={updateConversationExchangeStatus}
                    />
                )}

                {!selectedConversation && !showExchangeCompleteModal && (
                    <div className="empty-chat-placeholder">
                        <p>Check your inbox</p>
                        <p>If you have read all your messages, <a href="/">keep enjoying Greenlet!</a></p>
                    </div>
                )}
            </div>

            <Modal show={showExchangeCompleteModal} onHide={() => setShowExchangeCompleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Exchange Completed!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>You successfully completed this exchange.</p>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => setShowExchangeCompleteModal(false)}>
                        Close
                    </button>
                </Modal.Footer>
            </Modal>
        </div>

    )
}

export default Inbox
