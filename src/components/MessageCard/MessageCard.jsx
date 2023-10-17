import { Alert, Card, Col, Modal } from "react-bootstrap"
import './MessageCard.css'
import { Link } from "react-router-dom"
import { useContext, useState } from "react"
import { AuthContext } from "../../contexts/auth.context"
import formatMessageTime from "../../utils/formatMessageTime"
import messageService from "../../services/messages.services"


const MessageCard = ({ messageData }) => {

    const { loggedUser } = useContext(AuthContext)

    const isSender = messageData.sender === loggedUser._id;

    // const [readStatus, setReadStatus] = useState(messageData.read)
    const [HoveredConversation, setHoveredConversation] = useState(false)

    const isUnread = !messageData.read
    // TODO: METERLE CSS AL LINK PARA QUE NO SALGA SUBRAYADO

    const handleCardClick = () => {
        //esta logica sacarla de aqui y llevarla a cuando haces click en la conversación no en la carta del mensaje
        messageService
            .markAsRead(messageData._id)
            .then(() => console.log("state changed succesfully"))
            .catch(err => console.log(err))
    }

    const handleMouseEnter = () => {
        setHoveredConversation(true)
    }

    const handleMouseLeave = () => {
        setHoveredConversation(false)
    }


    return (
        <Card
            className={`message-card ${isSender ? 'sender-message' : 'receiver-message'}`}
            onClick={handleCardClick}
        >
            <div className="message-content">
                <div className={`message-text ${isSender ? 'sender-text' : 'receiver-text'}`}>
                    {messageData.content}
                    <div className="message-time">{formatMessageTime(messageData.timestamp)}</div>
                </div>
            </div>
        </Card>
    )
}

export default MessageCard