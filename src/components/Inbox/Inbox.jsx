import { Col, Row } from "react-bootstrap";
import Loader from "../Loader/Loader";
import ConversationDisplay from "../ConversationDisplay/ConversationDisplay";
import "./Inbox.css"
import { useContext, useEffect, useState } from "react";
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Avatar } from "@mui/material";
import { Search } from "@mui/icons-material"
import ChatItem from "../ChatItem/ChatItem";
import conversationService from "../../services/conversations.services";
import { SocketContext } from '../../contexts/socket.context'

const Inbox = ({ conversations }) => {


    const [selectedConversation, setSelectedConversation] = useState(null);
    const { socket, messages } = useContext(SocketContext)

    console.log("esta es la selected conversation", selectedConversation)

    useEffect(() => {
        if (socket) {
            socket.on("newMessage", handleMessage);
        }

        return () => {
            socket && socket.off('newMessage', handleMessage);
        }
    }, [socket, selectedConversation])

    const handleMessage = (message) => {
        selectedConversation &&
            setSelectedConversation((prevConversation) => ({
                ...prevConversation,
                messages: [...prevConversation.messages, message],
            }));
    }

    const handleConversationClick = (conversation) => {

        conversationService
            .getConversation(conversation.sender._id, conversation.receiver._id)
            .then(({ data }) => {
                setSelectedConversation(data)
            })
            .catch(err => console.log(err))
    };


    return (
        <Row>
            <Col lg={4} md={4} className="conversation-list">
                {/* Conversation list on the left */}
                <div className="sidebar-header">
                    <Avatar />
                    <div className="sidebar-header-right">
                        <DonutLargeIcon color="action" />
                        <ChatIcon color="action" />
                        <MoreVertIcon color="action" />
                    </div>
                </div>
                <div className="sidebar-search">
                    <div className="search-container">
                        <Search color="action" />
                        <input placeholder="Search" />
                    </div>
                </div>

                <div className="sidebar-list">
                    {!conversations ? (
                        <Loader />
                    ) : (
                        conversations.map((elm) => (
                            <ChatItem
                                key={elm._id}
                                conversationData={elm}
                                onClick={() => {
                                    handleConversationClick(elm)
                                }}
                                selected={selectedConversation === elm}
                            />
                        ))
                    )
                    }
                </div>
            </Col>
            {selectedConversation ?
                (
                    <Col lg={8} md={8} className="conversation-panel">
                        <ConversationDisplay selectedConversation={selectedConversation}
                            socket={socket} />
                    </Col>
                )
                :
                (
                    <>
                        aqui va una imagen de fondo o algo. en plan welcome to your chat, whatever
                    </>
                )}

        </Row>
    )
}

export default Inbox;
