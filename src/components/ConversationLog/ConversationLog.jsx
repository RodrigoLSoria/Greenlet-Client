import Loader from "../Loader/Loader"
import MessageCard from "../MessageCard/MessageCard"
import setConversationDate from "../../utils/setConversationDate"
import { useEffect, useRef, useState } from "react"
import "./ConversationLog.css"

const INITIAL_MESSAGE_COUNT = 20

const ConversationLog = ({ messages }) => {

    const [visibleMessages, setVisibleMessages] = useState([])
    const containerRef = useRef(null)

    console.log("messages", messages)

    useEffect(() => {
        const initialMessages = messages.slice(Math.max(messages.length - INITIAL_MESSAGE_COUNT, 0))
        setVisibleMessages(initialMessages)

        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }

        if (containerRef.current) {
            containerRef.current.addEventListener('scroll', handleScroll)
        }

        return () => {
            if (containerRef.current) {
                containerRef.current.removeEventListener('scroll', handleScroll)
            }
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
        const nextMessageCount = Math.min(currentCount + INITIAL_MESSAGE_COUNT, totalMessages)
        const additionalMessages = messages.slice(Math.max(totalMessages - nextMessageCount, 0), totalMessages - currentCount)
        setVisibleMessages([...additionalMessages, ...visibleMessages])
    }

    if (!visibleMessages || !Array.isArray(visibleMessages)) {
        return <Loader />
    }

    const messageGroups = []
    let currentDate = null
    let currentGroup = []

    for (const message of visibleMessages) {
        const messageDate = setConversationDate(message?.timestamp)
        if (messageDate !== currentDate) {
            currentDate = messageDate
            if (currentGroup.length > 0) {
                messageGroups.push(currentGroup)
            }
            currentGroup = [message]
        } else {
            currentGroup.push(message)
        }
    }

    if (currentGroup.length > 0) {
        messageGroups.push(currentGroup)
    }

    return (
        <div ref={containerRef} style={{ overflow: 'auto', maxHeight: '400px' }}>
            {messageGroups.map((messageGroup, index) => (
                <div key={index}>
                    <div className="date-header">
                        <p>{setConversationDate(messageGroup[0].timestamp)}</p>
                    </div>
                    <div>
                        {messageGroup.map((message) => (
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