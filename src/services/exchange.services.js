import axios from "axios";

class ExchangeService {

    constructor() {
        this.api = axios.create({
            baseURL: `${import.meta.env.VITE_API_URL}/exchanges`
        })

        this.api.interceptors.request.use((config) => {
            const storedToken = localStorage.getItem("authToken");
            if (storedToken) {
                config.headers = { Authorization: `Bearer ${storedToken}` }
            }
            return config;
        })
    }

    saveExchange(exchangeData) {

        console.log("esto es lo que me llega al service", exchangeData)
        return this.api.post('/saveExchange', exchangeData)
    }

    updateExchange(exchange_id, exchangeData) {
        return this.api.put(`/updateExchange/${exchange_id}`, exchangeData)
    }

    getPendingExchangesForUser(user_id) {
        return this.api.get(`/pendingExchanges/${user_id}`);
    }


}

const exchangeService = new ExchangeService()

export default exchangeService;
