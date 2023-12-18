import axios from "axios"

class MapsService {

    constructor() {

        this.api = axios.create({
            baseURL: `${import.meta.env.VITE_API_URL}/maps`
        })

        this.api.interceptors.request.use((config) => {

            const storedToken = localStorage.getItem("authToken")

            if (storedToken) {
                config.headers = { Authorization: `Bearer ${storedToken}` }
            }

            return config
        })
    }

    reverseGeocode(latitude, longitude) {
        return this.api.post('/reverse-geocode', { latitude, longitude })
    }

}

const mapsService = new MapsService()

export default mapsService
