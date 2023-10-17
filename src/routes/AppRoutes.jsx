import { Route, Routes } from 'react-router-dom'
import FeedPage from '../pages/FeedPage/FeedPage'
import PostDetailsPage from '../pages/PostDetailsPage/PostDetailsPage'
import NewPostPage from '../pages/NewPostPage/NewPostPage'
import ProfilePage from '../pages/ProfilePage/ProfilePage'
import InboxPage from '../pages/InboxPage/InboxPage'
import UserPostsPage from '../pages/UserPostsPage/UserPostsPage'


const AppRoutes = ({ socket }) => {

    return (
        <Routes>
            <Route path={'/'} element={<FeedPage socket={socket} />} />
            <Route path={'/newPost'} element={<NewPostPage />} />
            <Route path={'/postDetails/:post_id'} element={<PostDetailsPage />} />
            <Route path={'/profile/:user_id'} element={<ProfilePage />} />
            <Route path={'/getAllForUser/:user_id'} element={<InboxPage socket={socket} />} />
            {/* <Route path={'/getConversation/:sender_id/:receiver_id`'} element={<ConversationPage />} /> */}
            <Route path={'/getPostsByOwner/:user_id'} element={<UserPostsPage />} />
            <Route path={'*'} element={<p>el error</p>} />

        </Routes>
    )
}

export default AppRoutes