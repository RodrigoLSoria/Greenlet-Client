import { Row } from "react-bootstrap"
import Loader from "../Loader/Loader"
import MessageCard from "../MessageCard/MessageCard"
import setConversationDate from "../../utils/setConversationDate"
import { useEffect, useRef, useState } from "react"

const INITIAL_MESSAGE_COUNT = 20

const ConversationLog = ({ messages }) => {

    const [visibleMessages, setVisibleMessages] = useState([]);
    const containerRef = useRef(null)

    useEffect(() => {
        setVisibleMessages(messages.slice(-INITIAL_MESSAGE_COUNT));

        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }

        if (containerRef.current) {
            containerRef.current.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (containerRef.current) {
                containerRef.current.removeEventListener('scroll', handleScroll);
            }
        }
    }, [messages])

    const handleScroll = (event) => {
        const scrollTop = event.target.scrollTop;

        if (scrollTop === 0) {
            loadMoreMessages();
        }
    };

    const loadMoreMessages = () => {
        const currentCount = visibleMessages.length;
        const additionalMessages = messages.slice(-currentCount - INITIAL_MESSAGE_COUNT, -currentCount);
        setVisibleMessages([...additionalMessages, ...visibleMessages]);
    };

    if (!visibleMessages || !Array.isArray(visibleMessages)) {
        return <Loader />;
    }

    const messageGroups = [];
    let currentDate = null;
    let currentGroup = [];

    for (const message of visibleMessages) {
        const messageDate = setConversationDate(message.timestamp);
        if (messageDate !== currentDate) {
            currentDate = messageDate;
            if (currentGroup.length > 0) {
                messageGroups.push(currentGroup);
            }
            currentGroup = [message];
        } else {
            currentGroup.push(message);
        }
    }

    if (currentGroup.length > 0) {
        messageGroups.push(currentGroup);
    }

    return (
        <div ref={containerRef} style={{ overflow: 'auto', maxHeight: '400px' }}> {/* Adjust maxHeight as per your need */}
            {messageGroups.map((messageGroup, index) => (
                <div key={index}>
                    <div className="date-header">
                        {setConversationDate(messageGroup[0].timestamp)}
                    </div>
                    <Row>
                        {messageGroup.map((message) => (
                            <MessageCard
                                key={message._id}
                                messageData={message}
                                formattedTimestamp={setConversationDate(message.timestamp)}
                            />
                        ))}
                    </Row>
                </div>
            ))}
        </div>
    )
}

export default ConversationLog