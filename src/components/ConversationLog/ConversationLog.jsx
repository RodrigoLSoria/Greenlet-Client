import { Row } from "react-bootstrap"
import Loader from "../Loader/Loader"
import MessageCard from "../MessageCard/MessageCard"
import setConversationDate from "../../utils/setConversationDate"
import { useEffect } from "react"

const ConversationLog = ({ messages }) => {



    if (!messages || !Array.isArray(messages)) {
        return <Loader />;
    }

    const messageGroups = [];
    let currentDate = null;
    let currentGroup = [];

    for (const message of messages) {
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

    // Push the last group
    if (currentGroup.length > 0) {
        messageGroups.push(currentGroup);
    }

    return (
        <div>
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