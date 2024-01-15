import axios from "axios"

class UserService {
    constructor() {
        this.api = axios.create({
            baseURL: `${import.meta.env.VITE_API_URL}/user`
        })

        this.api.interceptors.request.use((config) => {
            const storedToken = localStorage.getItem("authToken")

            if (storedToken) {
                config.headers = { Authorization: `Bearer ${storedToken}` }
            }

            return config
        })
    }

    getAllUsers() {
        return this.api.get(`/getAllUsers`)
    }

    getUserDetails(user_id) {
        return this.api.get(`/getOneUser/${user_id}`)
    }

    deleteUser(user_id) {
        return this.api.delete(`/deleteUser/${user_id}`)
    }

    editProfile(user_id, userData) {
        return this.api.put(`/editProfile/${user_id}`, userData)
    }

    getUserFavorites(user_id) {
        return this.api.get(`/Favorites/${user_id}`)
    }

    addRating(ratedUserId, ratingData) {
        return this.api.put(`/addRating/${ratedUserId}`, ratingData)
    }

}

const userService = new UserService()

export default userService