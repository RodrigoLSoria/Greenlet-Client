import { Alert, Card, Col, Modal } from "react-bootstrap"
import './ConversationCard.css'
import { Link } from "react-router-dom"
import { useContext, useState } from "react"
import { AuthContext } from "../../contexts/auth.context"
import calculateMessageTime from "../../utils/calculateMessageTime"
import messageService from "../../services/messages.services"


const ConversationCard = ({ conversationData }) => {

    const { loggedUser } = useContext(AuthContext)

    // const [readStatus, setReadStatus] = useState(messageData.read)
    const [HoveredConversation, setHoveredConversation] = useState(false)

    // const isUnread = !messageData.read
    // TODO: METERLE CSS AL LINK PARA QUE NO SALGA SUBRAYADO

    const handleCardClick = () => {
        // messageService
        //     .markAsRead(messageData._id)
        //     .then(() => console.log("state changed succesfully"))
        //     .catch(err => console.log(err))
    }

    const handleMouseEnter = () => {
        setHoveredConversation(true)
    }

    const handleMouseLeave = () => {
        setHoveredConversation(false)
    }


    return (

        <div
            role="gridcell"
            aria-colindex="2"
            className={`conversation-card ${HoveredConversation ? "hovered" : ""}`}
            onClick={handleCardClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* {isUnread && <div className="unread-dot"></div>} */}
            <div className="conversation-content">
                <div className="conversation-header">
                    <div className="conversation-sender">{conversationData.sender.username}</div>
                    <div className="conversation-time">{calculateMessageTime(conversationData.timestamp)}</div>
                </div>
                <div className="conversation-text">{conversationData.content}</div>
            </div>
        </div>
    )
}

export default ConversationCard