import axios from "axios";

class AlertService {

    constructor() {
        this.api = axios.create({
            baseURL: `${import.meta.env.VITE_API_URL}/alerts`
        })

        this.api.interceptors.request.use((config) => {
            const storedToken = localStorage.getItem("authToken");
            if (storedToken) {
                config.headers = { Authorization: `Bearer ${storedToken}` }
            }
            return config;
        });
    }

    getAlertsByOwner(user_id) {
        return this.api.get(`/getAlertsByOwner/${user_id}`)
    }

    getOneAlert(alert_id) {
        return this.api.get(`/getOneAlert/${alert_id}`)
    }

    saveAlert(alertData) {
        return this.api.post('/saveAlert', alertData)
    }

    editAlert(alert_id, alertData) {
        return this.api.put(`/editAlert/${alert_id}`, alertData)
    }

    deleteAlert(alert_id) {
        return this.api.delete(`/deleteAlert/${alert_id}`)
    }

    checkForAlertMatches(alertData) {
        return this.api.get(`/getAlertMatches`, alertData)
    }
}

const alertsService = new AlertService()

export default alertsService