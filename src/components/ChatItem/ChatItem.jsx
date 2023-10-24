import { Avatar } from '@mui/material'
import './ChatItem.css'
import Loader from '../Loader/Loader'
import { useContext, useState } from 'react'
import { AuthContext } from '../../contexts/auth.context'

const ChatItem = ({ conversationData, onClick, selected }) => {

    const { loggedUser } = useContext(AuthContext)
    const [HoveredConversation, setHoveredConversation] = useState(false)


    const handleMouseEnter = () => {
        setHoveredConversation(true)
    }

    const handleMouseLeave = () => {
        setHoveredConversation(false)
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
                    className={`conversation-item ${HoveredConversation ? 'hovered' : ''}`}
                    onClick={() => onClick(conversationData)}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}>
                    <Avatar src={otherUser.avatar} />
                    <div className="item-info">
                        <span className="title">{otherUser.username}</span><br />
                        <span className="info">{conversationData.post?.title}</span>
                    </div>
                </div>
            )

    )
}

export default ChatItem