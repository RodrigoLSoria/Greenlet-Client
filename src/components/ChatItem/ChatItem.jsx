import { Avatar } from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import './ChatItem.css'
import Loader from '../Loader/Loader'
import { useContext, useState } from 'react'
import { AuthContext } from '../../contexts/auth.context'
import { useExchangeStatusContext } from '../../contexts/exchangeStatus.context'
import conversationService from '../../services/conversations.services'


const ChatItem = ({ conversationData, onClick }) => {

    const { loggedUser } = useContext(AuthContext)
    const { exchangeStatus } = useExchangeStatusContext()
    const [HoveredConversation, setHoveredConversation] = useState(false)


    const handleMouseEnter = () => { setHoveredConversation(true) }
    const handleMouseLeave = () => { setHoveredConversation(false) }


    const otherUser = conversationData.participants.find(participant =>
        participant._id !== loggedUser?._id)

    const handleDeleteConversation = async () => {
        try {
            await conversationService.deleteConversation(conversationData._id)
        } catch (error) {
            console.error('Failed to delete conversation:', error)
        }
    }

    return (
        !otherUser ? (
            <Loader />
        ) : (
            <div role="gridcell"
                aria-colindex="2"
                className={`conversation-item 
                    ${exchangeStatus === 'PENDING' ? 'disabled' : ''}
                     ${HoveredConversation ? 'hovered' : ''}`}
                onClick={() => onClick(conversationData)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                {exchangeStatus === 'PENDING' && (
                    <div className="pending-chip">PENDING</div>
                )}
                <Avatar src={conversationData.post.image} />

                <div className="item-info">
                    <span className="info">{conversationData.post.title}</span>
                </div>
                {/* <div onClick={handleDeleteConversation} className="delete-icon">
                    <DeleteIcon />
                </div> */}
            </div>
        )

    )
}

export default ChatItem