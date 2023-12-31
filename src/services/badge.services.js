import axios from "axios"

class BadgeService {

    constructor() {
        this.api = axios.create({
            baseURL: `${import.meta.env.VITE_API_URL}/badges`
        })

        this.api.interceptors.request.use((config) => {
            const storedToken = localStorage.getItem("authToken")
            if (storedToken) {
                config.headers = { Authorization: `Bearer ${storedToken}` }
            }
            return config
        })
    }

    getAllBadges() {
        return this.api.get('/getAllBadges')
    }

    updateExchangeCount(user_id, exchangeData) {
        return this.api.put(`/updateExchangeCount/${user_id}`, exchangeData)
    }

    addBadgeToUser(user_id, badge_id) {
        return this.api.post(`/addBadgeToUser/${user_id}`, { user_id, badge_id })
    }

}

const badgeService = new BadgeService()

export default badgeService
