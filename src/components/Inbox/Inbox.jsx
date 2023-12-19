import Loader from "../Loader/Loader"
import ConversationDisplay from "../ConversationDisplay/ConversationDisplay"
import "./Inbox.css"
import ChatItem from "../ChatItem/ChatItem"
import { SocketContext } from '../../contexts/socket.context'
import React, { useEffect, useState, useContext } from 'react'
import conversationService from "../../services/conversations.services"


const Inbox = ({ conversations }) => {
    const [selectedConversation, setSelectedConversation] = useState(null)
    const { socket } = useContext(SocketContext)


    useEffect(() => {
        if (socket) {
            socket.on("newMessage", handleMessage)
        }
        return () => {
            socket && socket.off('newMessage', handleMessage)
        }
    }, [socket,])


    const handleMessage = (newMessage) => {
        if (selectedConversation && selectedConversation._id === newMessage.conversation) {
            setSelectedConversation(prevConversation => ({
                ...prevConversation,
                messages: [...prevConversation.messages, newMessage],
            }))
        }
        // TODO: i need to update the conversations list to reflect the new messages
    }

    const handleConversationClick = (conversation) => {
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
                {selectedConversation ? (
                    <ConversationDisplay selectedConversation={selectedConversation} socket={socket} />
                ) : (
                    <div className="empty-chat-placeholder">
                        <p>Check your inbox</p>
                        <p>If you have read all your messages, keep enjoying Greenlet!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Inbox
