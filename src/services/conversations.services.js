import axios from "axios"

class ConversationService {

    constructor() {
        this.api = axios.create({
            baseURL: `${import.meta.env.VITE_API_URL}/conversations`
        })

        this.api.interceptors.request.use((config) => {
            const storedToken = localStorage.getItem("authToken")
            if (storedToken) {
                config.headers = { Authorization: `Bearer ${storedToken}` }
            }
            return config
        })
    }

    getAllConversationsForUser(user_id) {
        return this.api.get(`/getAllConversationsForUser/${user_id}`)
    }

    getOrCreateConversation(user1_id, user2_id, post_id) {
        console.log("getOrCreateConversation", user1_id, user2_id, post_id)
        return this.api.get(`/findOrCreate/${user1_id}/${user2_id}/${post_id}`)
    }

    deleteConversation(conversation_id) {
        return this.api.delete(`/deleteConversation/${conversation_id}`)
    }

    getMessagesForConversation(conversation_id) {
        return this.api.get(`/messages/${conversation_id}`)
    }

}

const conversationService = new ConversationService()

export default conversationService
