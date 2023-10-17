import axios from "axios";

class MessageService {

    constructor() {
        this.api = axios.create({
            baseURL: `${import.meta.env.VITE_API_URL}/messages`
        })

        this.api.interceptors.request.use((config) => {
            const storedToken = localStorage.getItem("authToken");
            if (storedToken) {
                config.headers = { Authorization: `Bearer ${storedToken}` }
            }
            return config;
        })
    }

    getAllMessagesForUser(user_id) {

        return this.api.get(`/getAllForUser/${user_id}`);
    }

    sendMessage(messageData) {
        return this.api.post('/sendMessage', messageData);
    }

    markAsRead(message_id) {
        return this.api.patch(`/markAsRead/${message_id}`);
    }

    deleteMessage(message_id) {
        return this.api.delete(`/deleteMessage/${message_id}`);
    }

}

const messageService = new MessageService()

export default messageService;
