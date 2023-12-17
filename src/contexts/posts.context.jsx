// contexts/posts.context.js
import { createContext, useState, useContext } from 'react';

const PostsContext = createContext();

export const usePosts = () => useContext(PostsContext);

export const PostsProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);

    // The value object contains everything you want to provide through the context
    const value = {
        posts,
        setPosts
    };

    return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
};
