import { Avatar } from '@mui/material'
import './ChatItem.css'
import Loader from '../Loader/Loader'

const ChatItem = ({ conversationData, onClick, selected }) => {

    //TO-DO: añadir el red dot aquí para los unreadmessages y repensar esa lógica

    return (
        !conversationData.receiver ?
            (
                <Loader />
            )
            :
            (
                <div className={`conversation-item ${selected ? 'selected' : ''
                    }`} onClick={() => onClick(conversationData)}>
                    <Avatar src={conversationData.sender.avatar} />
                    <div className="item-info">
                        <span className="title">{conversationData.receiver.username}</span><br />
                        {/* <span className="info">{conversationData.post.title}</span> */}
                    </div>
                </div>
            )

    )
}

export default ChatItem