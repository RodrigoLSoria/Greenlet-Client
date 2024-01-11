import './MessageForm.css'
import React, { useContext, useState } from "react"
import messageService from "../../services/messages.services"
import { AuthContext } from "../../contexts/auth.context"
import conversationService from "../../services/conversations.services"
import { useMessageModalContext } from '../../contexts/messageModal.context'
import { SocketContext } from '../../contexts/socket.context'
import exchangeService from '../../services/exchange.services'
import SendIcon from '@mui/icons-material/Send'



const MessageForm = ({ postOwnerId, postId, selectedConversation, onNewMessage }) => {

    const { loggedUser } = useContext(AuthContext)
    const { socket } = useContext(SocketContext)
    const { setShowMessageModal } = useMessageModalContext()

    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const [content, setContent] = useState('')

    const isOwner = loggedUser?._id === selectedConversation?.post.owner
    const post = selectedConversation ? selectedConversation?.post._id : postId
    const showConfirmExchangeButton = selectedConversation?.exchangeStatus === 'none' && isOwner
    const showCancelExchangeButton = selectedConversation?.exchangeStatus === 'pending' && isOwner





    const handleMessageSubmit = async (e) => {
        e.preventDefault()

        try {
            let conversationId = selectedConversation?._id
            if (!conversationId) {
                const response = await
                    conversationService
                        .getOrCreateConversation(loggedUser?._id, postOwnerId, postId)
                conversationId = response.data.conversation._id
            }


            const messageData = {
                sender: loggedUser?._id,
                content: content,
                conversation: conversationId,
            }


            const { data: newMessage } = await
                messageService
                    .sendMessage(messageData)

            socket.emit('message', newMessage)

            if (onNewMessage) {
                onNewMessage(newMessage)
            }

            setContent('')
            setShowMessageModal(false)
        } catch (err) {
            console.error('Error handling the message:', err)
        }

    }


    const handleTextareaKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleMessageSubmit(e)
        }
    }


    const handleConfirmExchange = async () => {
        setIsButtonDisabled(true);

        const receiverId = selectedConversation.participants.find(p => p !== loggedUser._id);

        console.log("este es el receiverid", receiverId)

        const exchangeData = {
            giver: loggedUser._id,
            receiver: receiverId,
            givenPost: post,
        };

        try {
            const response = await exchangeService.saveExchange(exchangeData);
            console.log("Exchange saved!", response.data);
        } catch (error) {
            console.error("Failed to save exchange!", error);
        } finally {
            setIsButtonDisabled(false);
        }
    };

    return (
        <div className="MessageForm">

            <form onSubmit={handleMessageSubmit} className="message-form-grid">
                {showConfirmExchangeButton && (
                    <div className="message-form-button">
                        <button type="button" onClick={handleConfirmExchange}
                            disabled={isButtonDisabled}>
                            Confirm Exchange/Gift
                        </button>
                    </div>
                )}
                {/* {showCancelExchangeButton && (
                    <div className="message-form-button">
                        <button type="button" onClick={handleCancelExchange}
                            className="cancel-button"
                            disabled={isButtonDisabled}>
                            Cancel Exchange/Gift
                        </button>
                    </div>
                )} */}
                <div className="input-group">
                    <div className="message-input-container">
                        <input
                            type="text"
                            className="form-control message-textarea"
                            name="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onKeyPress={handleTextareaKeyPress}
                            placeholder="Type your message..."
                        />
                    </div>
                    <div className="send-button" onClick={handleMessageSubmit}
                        style={{ cursor: 'pointer' }}>
                        <SendIcon />
                    </div>
                </div>
            </form>
        </div>
    )
}
export default MessageForm
