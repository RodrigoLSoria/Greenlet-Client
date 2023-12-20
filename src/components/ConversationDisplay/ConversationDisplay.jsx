import './ConversationDisplay.css'
import MessageForm from '../MessageForm/MessageForm'
import ConversationLog from '../ConversationLog/ConversationLog'


const ConversationDisplay = ({ selectedConversation }) => {

    console.log("selected conversation", selectedConversation)


    return (
        <div className="conversation-display">
            <div className="chat-body">
                <ConversationLog messages={selectedConversation.messages} conversationId={selectedConversation._id} />
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