import { Avatar } from '@mui/material'
import './ChatItem.css'
import Loader from '../Loader/Loader'
import { useContext, useState } from 'react'
import { AuthContext } from '../../contexts/auth.context'

const ChatItem = ({ conversationData, onClick, selected }) => {

    const { loggedUser } = useContext(AuthContext)
    const [HoveredConversation, setHoveredConversation] = useState(false)

    console.log(conversationData)

    const handleMouseEnter = () => {
        setHoveredConversation(true)
    }

    const handleMouseLeave = () => {
        setHoveredConversation(false)
    }

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
                    <Avatar src={conversationData.sender.avatar} />
                    <div className="item-info">
                        <span className="title">{conversationData.sender.username}</span><br />
                        <span className="info">{conversationData.post.title}</span>
                    </div>
                </div>
            )

    )
}

export default ChatItem