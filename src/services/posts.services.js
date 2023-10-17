import axios from "axios";

class PostService {

    constructor() {
        this.api = axios.create({
            baseURL: `${import.meta.env.VITE_API_URL}/feed`
        })

        this.api.interceptors.request.use((config) => {
            const storedToken = localStorage.getItem("authToken");
            if (storedToken) {
                config.headers = { Authorization: `Bearer ${storedToken}` }
            }
            return config;
        });

    }

    getPosts() {
        return this.api.get('/getAllPosts')
    }
    getPostDetails(post_id) {
        return this.api.get(`/getOnePost/${post_id}`)
    }

    getPostsByOwner(user_id) {
        return this.api.get(`/getPostsByOwner/${user_id}`)
    }

    savePost(postData) {
        return this.api.post('/savePost', postData)
    }

    editPost(post_id, postData) {
        return this.api.put(`/editPost/${post_id}`, postData)
    }

    deletePost(post_id) {
        return this.api.delete(`/deletePost/${post_id}`)
    }

    getFilteredPosts(queryParams) {

        return this.api.get(`/getFilteredPosts/`, {
            params: queryParams
        })
    }

    getPostsByLocation(city) {
        return this.api.get(`/getPostsByLocation/${city}`)
    }
}


const postsService = new PostService()

export default postsService