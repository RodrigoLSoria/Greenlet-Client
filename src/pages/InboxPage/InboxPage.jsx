import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../contexts/auth.context"
import Inbox from "../../components/Inbox/Inbox"
import conversationService from "../../services/conversations.services"
import "./InboxPage.css"

const InboxPage = () => {

    const [conversations, setConversations] = useState()
    const { loggedUser } = useContext(AuthContext)

    const loadInbox = () => {

        conversationService
            .getAllConversationsForUser(loggedUser?._id)
            .then(({ data }) => {
                setConversations(data)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        loadInbox()
    }, [])


    return (
        <div className="inboxPage">
            <Inbox conversations={conversations} />
        </div>
    )
}

export default InboxPage