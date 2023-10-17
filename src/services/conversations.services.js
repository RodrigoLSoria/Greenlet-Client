import axios from "axios";

class ConversationService {

    constructor() {
        this.api = axios.create({
            baseURL: `${import.meta.env.VITE_API_URL}/conversations`
        })

        this.api.interceptors.request.use((config) => {
            const storedToken = localStorage.getItem("authToken");
            if (storedToken) {
                config.headers = { Authorization: `Bearer ${storedToken}` }
            }
            return config;
        })
    }

    getAllConversationsForUser(user_id) {
        return this.api.get(`/getAllConversationsForUser/${user_id}`);
    }

    getConversation(sender_Id, receiver_Id) {
        return this.api.get(`/getConversation/${sender_Id}/${receiver_Id}`);
    }

    saveConversation(conversationData) {
        return this.api.post(`/saveConversation`, conversationData)
    }

    deleteConversation(conversation_id) {
        return this.api.delete(`/deleteConversation/${conversation_id}`);
    }

}

const conversationService = new ConversationService()

export default conversationService;
