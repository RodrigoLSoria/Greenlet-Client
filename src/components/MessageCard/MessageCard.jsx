import { Card } from "react-bootstrap"
import './MessageCard.css'
import { useContext } from "react"
import { AuthContext } from "../../contexts/auth.context"
import formatMessageTime from "../../utils/formatMessageTime"


const MessageCard = ({ message }) => {

    const { loggedUser } = useContext(AuthContext)
    const isSender = (message.sender._id ? message.sender._id : message.sender) === loggedUser._id


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