import Loader from "../Loader/Loader"
import MessageCard from "../MessageCard/MessageCard"
import setConversationDate from "../../utils/setConversationDate"
import { useEffect, useRef, useState } from "react"
import "./ConversationLog.css"
import groupMessagesByDate from "../../utils/groupMessagesByDate"
import { SocketContext } from '../../contexts/socket.context'
import { useContext } from 'react'

const ConversationLog = ({ messages, conversationId }) => {

    const [visibleMessages, setVisibleMessages] = useState([])
    const containerRef = useRef(null)
    const { socket } = useContext(SocketContext)

    useEffect(() => {
        setVisibleMessages([...messages].reverse())
    }, [messages])



    useEffect(() => {
        const handleNewMessage = (newMessage) => {
            console.log('New message received:', newMessage)
            if (newMessage.conversation === conversationId) {
                setVisibleMessages(prevMessages => [newMessage, ...prevMessages])
            }
        }

        if (socket) {
            socket.on('newMessage', handleNewMessage)
        }

        return () => {
            if (socket) {
                socket.off('newMessage', handleNewMessage)
            }
        }
    }, [socket, conversationId])

    const messageGroups = groupMessagesByDate(visibleMessages, setConversationDate)

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [visibleMessages])


    return (
        <div ref={containerRef} className="chat-panel2" >
            {messageGroups.map((group, index) => (
                <div key={index}>
                    <div className="date-header">
                        <p>{group.date}</p>
                    </div>
                    <div>
                        {group.messages.map((message) => (
                            <MessageCard
                                key={message._id}
                                message={message}
                                formattedTimestamp={setConversationDate(message.timestamp)}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ConversationLog