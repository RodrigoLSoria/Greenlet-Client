import { Avatar } from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import './ChatItem.css'
import Loader from '../Loader/Loader'
import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../contexts/auth.context'
import conversationService from '../../services/conversations.services'


const ChatItem = ({ conversationData, onClick }) => {


    const { loggedUser } = useContext(AuthContext)
    const [HoveredConversation, setHoveredConversation] = useState(false)

    const handleMouseEnter = () => { setHoveredConversation(true) }
    const handleMouseLeave = () => { setHoveredConversation(false) }

    const exchangeStatus = conversationData.exchangeStatus

    const otherUser = conversationData.participants.find(participant =>
        participant._id !== loggedUser?._id)


    useEffect(() => {
    }, [conversationData.exchangeStatus])



    const handleDeleteConversation = async () => {
        try {
            await conversationService.deleteConversation(conversationData._id)
        } catch (error) {
            console.error('Failed to delete conversation:', error)
        }
    }

    let statusChipClass = ""
    let statusChipText = ""
    let itemClass = 'conversation-item'

    if (exchangeStatus === 'pending') {
        statusChipClass = 'pending-chip'
        statusChipText = 'PENDING'
    } else if (exchangeStatus === 'closed') {
        statusChipClass = 'closed-chip'
        statusChipText = 'CLOSED'
        itemClass += ' closed'
    }

    return (
        !otherUser ? (
            <Loader />
        ) : (
            <div role="gridcell"
                aria-colindex="2"
                className={`${itemClass}`}
                onClick={() => onClick(conversationData)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                {exchangeStatus && (
                    <div className={statusChipClass}>{statusChipText}</div>
                )}
                <Avatar src={conversationData.post?.image} />
                <div className="item-info">
                    <span className="info">{conversationData.post?.title}</span>
                </div>
                {/* <div onClick={handleDeleteConversation} className="delete-icon">
                    <DeleteIcon />
                </div> */}
            </div>
        )

    )
}

export default ChatItem