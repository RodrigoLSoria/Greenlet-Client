import { createContext, useState, useContext } from 'react'

const PostsContext = createContext()

export const usePosts = () => useContext(PostsContext)

export const PostsProvider = ({ children }) => {
    const [posts, setPosts] = useState([])

    const value = {
        posts,
        setPosts
    }

    return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>
}
