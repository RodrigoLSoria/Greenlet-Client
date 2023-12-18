import Loader from "../Loader/Loader"
import MessageCard from "../MessageCard/MessageCard"
import setConversationDate from "../../utils/setConversationDate"
import { useEffect, useRef, useState } from "react"
import "./ConversationLog.css"
import groupMessagesByDate from "../../utils/groupMessagesByDate"

const INITIAL_MESSAGE_COUNT = 20


const ConversationLog = ({ messages }) => {

    const [visibleMessages, setVisibleMessages] = useState([])
    const containerRef = useRef(null)
    const messageGroups = groupMessagesByDate(visibleMessages, setConversationDate)


    useEffect(() => {
        const initialMessages = messages.slice(0, INITIAL_MESSAGE_COUNT).reverse()
        setVisibleMessages(initialMessages)

        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [messages])

    const handleScroll = () => {
        if (containerRef.current.scrollTop === 0) {
            loadMoreMessages()
        }
    }

    const loadMoreMessages = () => {
        const currentCount = visibleMessages.length
        const totalMessages = messages.length
        if (currentCount < totalMessages) {
            const additionalMessages = messages.slice(currentCount, currentCount + INITIAL_MESSAGE_COUNT).reverse()
            setVisibleMessages([...visibleMessages, ...additionalMessages])
        }
    }

    if (!visibleMessages.length) {
        return <Loader />
    }


    return (
        <div ref={containerRef} className="chat-panel2">
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