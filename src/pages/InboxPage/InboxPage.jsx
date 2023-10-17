import { useContext, useEffect, useState } from "react"
import messageService from "../../services/messages.services"
import { AuthContext } from "../../contexts/auth.context"
import Inbox from "../../components/Inbox/Inbox"
import { Container } from "react-bootstrap"
import conversationService from "../../services/conversations.services"


const InboxPage = ({ socket }) => {

    //traer mensaje, no solo el owner, si no el nombre de usuario, y el post de referencia.

    const [conversations, setConversations] = useState()
    const { loggedUser } = useContext(AuthContext)


    const loadInbox = () => {

        conversationService
            .getAllConversationsForUser(loggedUser?._id)
            .then(({ data }) => {
                setConversations(data)
            })
            .catch(err => console.log(err));

        // messageService
        //     .getAllMessagesForUser(loggedUser?._id)
        //     .then(({ data }) => {
        //         setMessages(data)
        //     })
        //     .catch(err => console.log(err));
    }
    useEffect(() => {
        loadInbox()
    }, [])

    return (
        <div className="inboxPage">
            <Container>
                <Inbox conversations={conversations} socket={socket} />
            </Container>
        </div>
    )
}

export default InboxPage