import './ConversationDisplay.css'
import { Avatar } from '@mui/material';
import { Search } from '@mui/icons-material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MessageForm from '../MessageForm/MessageForm';
import ConversationLog from '../ConversationLog/ConversationLog'


const ConversationDisplay = ({ selectedConversation }) => {

    return (
        <div className="conversation-display">
            <div className="bg-conversation"></div>
            <div className="chat-header">
                <Avatar src={selectedConversation.sender.avatar} />
                <div className="chat-header-details">
                    <span className="chosenConversation">{selectedConversation.sender.username}</span>
                </div>
                <div className="chat-header-right">
                    <Search color="action" />
                    <MoreVertIcon color="action" />
                </div>
            </div>
            <div className="chat-body">
                <ConversationLog messages={selectedConversation.messages} />
            </div>
            <div className="chat-footer">
                <div className="chat-footer-actions">
                    <InsertEmoticonIcon color="action" />
                </div>
                <div className="chat-footer-input">
                    <MessageForm selectedConversation={selectedConversation} />
                </div>
            </div>
        </div>

    )
}

export default ConversationDisplay