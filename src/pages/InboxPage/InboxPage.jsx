import { useContext, useEffect, useState } from "react"
import messageService from "../../services/messages.services"
import { AuthContext } from "../../contexts/auth.context"
import Inbox from "../../components/Inbox/Inbox"
import { Container } from "react-bootstrap"
import conversationService from "../../services/conversations.services"


const InboxPage = () => {

    const [conversations, setConversations] = useState()
    const { loggedUser } = useContext(AuthContext)

    const loadInbox = () => {

        conversationService
            .getAllConversationsForUser(loggedUser?._id)
            .then(({ data }) => {
                console.log("esto es lo que me llega de conversacioens-----------------------------------------------", data)
                setConversations(data)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        loadInbox()
    }, [])

    return (
        <div className="inboxPage">
            <Container>
                <Inbox conversations={conversations} />
            </Container>
        </div>
    )
}

export default InboxPage