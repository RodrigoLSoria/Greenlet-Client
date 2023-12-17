import './ConversationDisplay.css'
import { Avatar } from '@mui/material'
import { Search } from '@mui/icons-material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import MessageForm from '../MessageForm/MessageForm'
import ConversationLog from '../ConversationLog/ConversationLog'
import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../../contexts/auth.context'
import conversationService from '../../services/conversations.services'

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