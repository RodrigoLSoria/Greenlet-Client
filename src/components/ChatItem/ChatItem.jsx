import { Avatar } from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import './ChatItem.css'
import Loader from '../Loader/Loader'
import { useContext, useState } from 'react'
import { AuthContext } from '../../contexts/auth.context'
import { useExchangeStatusContext } from '../../contexts/exchangeStatus.context'
import conversationService from '../../services/conversations.services'


const ChatItem = ({ conversationData, onClick, selected }) => {

    const { loggedUser } = useContext(AuthContext)
    const { exchangeStatus } = useExchangeStatusContext()
    const [HoveredConversation, setHoveredConversation] = useState(false)


    const handleMouseEnter = () => {
        setHoveredConversation(true)
    }

    const handleMouseLeave = () => {
        setHoveredConversation(false)
    }

    const handleDeleteConversation = async () => {
        // Call the delete API
        try {
            await conversationService.deleteConversation(conversationData._id);
            // Handle what happens after delete, e.g., refresh the list, show a message, etc.
        } catch (error) {
            console.error('Failed to delete conversation:', error);
        }
    }

    const otherUser = conversationData.sender._id === loggedUser?._id
        ? conversationData.receiver
        : conversationData.sender


    return (
        !conversationData.receiver ?
            (
                <Loader />
            )
            :
            (
                <div role="gridcell"
                    aria-colindex="2"
                    className={`conversation-item 
                    ${exchangeStatus === 'PENDING' ? 'disabled' : ''}
                     ${HoveredConversation ? 'hovered' : ''}`}
                    onClick={() => onClick(conversationData)}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}>
                    {exchangeStatus === 'PENDING' && (
                        <div className="pending-chip">PENDING</div>  // Esta es la ficha 'PENDING'
                    )}
                    <Avatar src={otherUser.avatar} />
                    <div className="item-info">
                        <span className="title">{otherUser.username}</span><br />
                        <span className="info">{conversationData.post?.title}</span>
                    </div>
                    <div onClick={handleDeleteConversation} className="delete-icon">
                        <DeleteIcon />
                    </div>
                </div>
            )

    )
}

export default ChatItem