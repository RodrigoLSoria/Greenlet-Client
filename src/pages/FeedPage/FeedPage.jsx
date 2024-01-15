import { useEffect } from "react"
import { Container } from "react-bootstrap"
import postsService from "../../services/posts.services"
import Feed from "../../components/Feed/Feed"
import { usePosts } from '../../contexts/posts.context'
import "./FeedPage.css"
import { useSearchParams } from "react-router-dom"

const FeedPage = () => {
    const { posts } = usePosts()
    const [searchParams, setSearchParams] = useSearchParams()
    const { setPosts } = usePosts()


    useEffect(() => {
        const searchQuery = searchParams.get('search')
        if (searchQuery) {
            postsService.getFilteredPosts({ searchQuery })
                .then(({ data }) => {
                    setPosts(data)
                })
                .catch((err) => console.log(err))
        }
    }, [searchParams, setPosts])

    useEffect(() => {
        console.log("FeedPage posts updated:", posts);
    }, [posts])

    return (
        <div className="feedPage">
            <Container>
                <Feed filteredPosts={posts} />
            </Container>
        </div >
    )
}

export default FeedPage