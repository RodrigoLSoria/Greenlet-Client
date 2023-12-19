import './ConversationDisplay.css'
import MessageForm from '../MessageForm/MessageForm'
import ConversationLog from '../ConversationLog/ConversationLog'


const ConversationDisplay = ({ selectedConversation }) => {


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