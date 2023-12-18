import axios from "axios"

class ExchangeService {

    constructor() {
        this.api = axios.create({
            baseURL: `${import.meta.env.VITE_API_URL}/exchanges`
        })

        this.api.interceptors.request.use((config) => {
            const storedToken = localStorage.getItem("authToken")
            if (storedToken) {
                config.headers = { Authorization: `Bearer ${storedToken}` }
            }
            return config
        })
    }

    saveExchange(exchangeData) {

        return this.api.post('/saveExchange', exchangeData)
    }

    updateExchange(exchange_id, exchangeData) {
        return this.api.put(`/updateExchange/${exchange_id}`, exchangeData)
    }

    updateExchangeStatus(exchange_id, status) {
        return this.api.put(`/updateExchange/${exchange_id}`, { status })
    }

    getExchangesForUserByStatus(user_id, status) {
        return this.api.get(`/getExchangesForUserByStatus/${user_id}/${status}`)
    }


}

const exchangeService = new ExchangeService()

export default exchangeService
