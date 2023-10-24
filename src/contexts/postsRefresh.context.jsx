import { createContext, useContext, useState } from 'react';

export const PostsRefreshContext = createContext();

export const FeedRefreshProvider = ({ children }) => {
    const [refreshFeed, setRefreshFeed] = useState(false);

    return (
        <PostsRefreshContext.Provider value={{ refreshFeed, setRefreshFeed }}>
            {children}
        </PostsRefreshContext.Provider>
    );
};

export const useFeedRefresh = () => {
    return useContext(PostsRefreshContext);
};
