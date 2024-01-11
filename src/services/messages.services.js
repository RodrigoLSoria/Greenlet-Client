import axios from "axios"

class MessageService {

    constructor() {
        this.api = axios.create({
            baseURL: `${import.meta.env.VITE_API_URL}/messages`
        })

        this.api.interceptors.request.use((config) => {
            const storedToken = localStorage.getItem("authToken")
            if (storedToken) {
                config.headers = { Authorization: `Bearer ${storedToken}` }
            }
            return config
        })
    }


    sendMessage(messageData) {
        return this.api.post('/sendMessage', messageData)
    }

    deleteMessage(message_id) {
        return this.api.delete(`/deleteMessage/${message_id}`)
    }
}

const messageService = new MessageService()

export default messageService
