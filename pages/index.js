import { React, useContext, useState, useEffect } from 'react';
import { UserContext } from '../context';
import ParallaxBG from '../components/cards/parallaxBG';
import axios from 'axios';
import Post from '../components/cards/Post';
import Head from "next/head";
import Link from "next/link";
import UserRoute from '../components/routes/UserRoute';
import PostList from '../components/cards/PostList';
import Search from '../components/Search';
import People from '../components/cards/People';

export default function Home() {

    const [state, setState] = useContext(UserContext);

    const [content, setContent] = useState("");
    const [image, setImage] = useState({});

    // for posts
    const [posts, setPosts] = useState([]);
    //people
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(false);
    // for comments
    const [comment, setComment] = useState('');
    const [visible, setVisible] = useState(false);
    const [currentPost, setCurrentPost] = useState({});




    useEffect(() => {
        if (state && state.token) {
            newsFeed();
            findPeople();
        }

    }, [state && state.token]);


    const newsFeed = async () => {
        try {
            const { data } = await axios.get('/posts');
            // console.log("User posts=>", data);
            setPosts(data);

        } catch (err) {
            console.log(err);
        }
    }

    const findPeople = async () => {
        try {

            const { data } = await axios.get("/find-people");
            setPeople(data);

        } catch (err) {
            console.log(err);
        }
    }
    const handleDelete = async (post) => {
        try {
            const answer = window.confirm("Are you sure to delete post?");
            if (!answer) return;
            const { data } = await axios.delete(`/delete-post/${post._id}`);
            toast.error("Post deleted");
            newsFeed();
        } catch (err) {
            console.log(err);
        }
    };
    const handleLike = async (_id) => {

        // console.log("like this post", _id)

        try {

            const { data } = await axios.put(`/like-post`, { _id });
            // console.log("liked data=>", data);
            newsFeed();

        } catch (err) {
            console.log(err);
        }
    };
    const handleUnlike = async (_id) => {

        // console.log("Unlike this post", _id)
        try {
            const { data } = await axios.put(`/unlike-post`, { _id });
            // console.log("unliked data=>", data);
            newsFeed();
        } catch (err) {
            console.log(err);
        }
    };
    const handleComment = async (post) => {
        setCurrentPost(post);
        setVisible(true);

    };

    const removeComment = async (postId, comment) => {
        // console.log("postId and comment",postId,comment);

        try {

            let answer = window.confirm("Are you sure to delete comment?");
            if (!answer) return;
            const { data } = await axios.put(`/remove-comment`, { postId, comment });
            console.log("removed comment", data);
            newsFeed();

        } catch (err) {
            console.log(err);
        }
    };

    const handleFollow = async (user) => {

        try {

            const { data } = await axios.put('/user-follow', { _id: user._id });
            // console.log("handle follow response=>", data);
            //update local storage, update user, keep token

            let auth = JSON.parse(localStorage.getItem('auth'));
            auth.user = data;
            localStorage.setItem("auth", JSON.stringify(auth));


            //update context
            setState({ ...state, user: data });
            // update people state
            let filtered = people.filter((p) => (p._id !== user._id));
            setPeople(filtered);
            //rerender the posts in newsfeed
            newsFeed();

            toast.success(`Following ${user.name}`);

        } catch (err) {

        }
    };


    const head = () => (
        <Head>
            <title>SOCIAL MEDIA- A social network by devs for devs</title>
            <meta name="description" content="A social network by developers for other web developers" />
            <meta property="og:description"
                content="A social network by developers for other web developers" />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="SOCIALMEDIA" />
            <meta property="og:url" content="http://socialmedia.com" />
            <meta property="og:image:secure_url" content="http://socilamedia.com/images/default.jpg" />
            <link rel="icon" type="image/jpg" href="/images/profilepic.jpg"/>

        </Head>
    )

    return (
        <UserRoute>
            {head()}
            <div className="container-fluid">
                <ParallaxBG url="/images/default1.jpeg" />

                <div className="row pt-5" py-3>
                    <div className="col-md-6 offset-1">
                        <PostList posts={posts} handleDelete={handleDelete} handleLike={handleLike}
                            handleUnlike={handleUnlike} handleComment={handleComment} removeComment={removeComment}
                        />
                    </div>
                    <div className="col-md-4">
                        <Search />
                        <div className='suggestion'>Suggested for you</div>
                        <People people={people} handleFollow={handleFollow} />
                    </div>
                </div>
            </div>

        </UserRoute>
    );
}
// export async function getServerSideProps() {
//     const { data } = await axios.get('/posts');

//     return {
//         props: {
//             posts: data,
//         }
//     }
// }

