import { useContext, useEffect, useState } from "react"
import postsService from "../../services/posts.services"
import { AuthContext } from "../../contexts/auth.context"
import Feed from "../../components/Feed/Feed"

const UserPostsPage = () => {

    const [posts, setPosts] = useState()
    const { loggedUser } = useContext(AuthContext)

    useEffect(() => {
        loadPosts()
    }, [])

    const loadPosts = () => {
        postsService
            .getPostsByOwner(loggedUser._id)
            .then(({ data }) => {
                setPosts(data)
            })
            .catch(err => console.log(err))
    }


    return (
        <Feed posts={posts} />
    )
}

export default UserPostsPage