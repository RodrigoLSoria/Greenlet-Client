import { Alert, Card, Col, Modal } from "react-bootstrap"
import './MessageCard.css'
import { Link } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../../contexts/auth.context"
import formatMessageTime from "../../utils/formatMessageTime"
import messageService from "../../services/messages.services"


const MessageCard = ({ message }) => {

    const { loggedUser } = useContext(AuthContext)

    const isSender = message.sender._id === loggedUser._id

    console.log("message", message)


    return (
        <Card
            className={`message-card ${isSender ? 'sender-message' : 'receiver-message'}`}
            style={{ maxWidth: '80%', alignSelf: isSender ? 'end' : 'start' }}
        >
            <div className="d-flex align-items-center">
                <Card.Text className="mb-0">{message.content}</Card.Text>
                <div className="message-time ms-2">{formatMessageTime(message.timestamp)}</div>
            </div>
        </Card>
    )
}

export default MessageCard