import './ConversationDisplay.css'
import MessageForm from '../MessageForm/MessageForm'
import ConversationLog from '../ConversationLog/ConversationLog'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/auth.context'


const ConversationDisplay = ({ selectedConversation }) => {

    const { loggedUser } = useContext(AuthContext)
    const otherUser = selectedConversation.participants.find(participant =>
        participant._id !== loggedUser?._id)


    return (
        <div className="conversation-display">
            <div className="chat-body">
                <ConversationLog messages={selectedConversation.messages} />
            </div>
            <div className="chat-footer">
                <div className="chat-footer-input">
                    <MessageForm selectedConversation={selectedConversation} />
                </div>
            </div>
        </div>
    )
}

export default ConversationDisplay