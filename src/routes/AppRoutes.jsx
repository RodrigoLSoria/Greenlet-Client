import { Route, Routes } from 'react-router-dom'
import FeedPage from '../pages/FeedPage/FeedPage'
import PostDetailsPage from '../pages/PostDetailsPage/PostDetailsPage'
import NewPostPage from '../pages/NewPostPage/NewPostPage'
import ProfilePage from '../pages/ProfilePage/ProfilePage'
import InboxPage from '../pages/InboxPage/InboxPage'
import UserPostsPage from '../pages/UserPostsPage/UserPostsPage'
import SavedPostsPage from '../pages/SavedPostsPage/SavedPostsPage'


const AppRoutes = () => {

    return (
        <Routes>
            <Route path={'/'} element={<FeedPage />} />
            <Route path={'/newPost'} element={<NewPostPage />} />
            <Route path={'/postDetails/:post_id'} element={<PostDetailsPage />} />
            <Route path={'/profile/:user_id'} element={<ProfilePage />} />
            <Route path={'/saved/:user_id'} element={<SavedPostsPage />} />
            <Route path={'/getAllForUser/:user_id'} element={<InboxPage />} />
            <Route path={'/getPostsByOwner/:user_id'} element={<UserPostsPage />} />
            <Route path={'*'} element={<p>el error</p>} />

        </Routes>
    )
}

export default AppRoutes