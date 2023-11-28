import { React, useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context';
import UserRoute from '../../components/routes/UserRoute';
import PostForm from '../../components/forms/PostForm';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import PostList from '../../components/cards/PostList';
import Link from 'next/link';
import { Modal } from 'antd';
import CommentForm from '../../components/forms/CommentForm';
import ParralaxBG from '../../components/cards/parallaxBG';
import { Avatar } from 'antd';



export default function dashboard() {

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

    const router = useRouter();


    useEffect(() => {
        if (state && state.token) {
            newsFeed();
            findPeople();
        }

    }, [state && state.token]);


    const newsFeed = async () => {
        try {
            const { data } = await axios.get('/news-feed');
            setPosts(data);

        } catch (err) {
            console.log(err);
        }
    };


    const findPeople = async () => {
        try {

            const { data } = await axios.get("/find-people");
            setPeople(data);

        } catch (err) {
            console.log(err);
        }
    };


    const postSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.post(`/create-post`, { content, image });
            console.log("Post created", data);

            if (data.error) {
                toast.error(data.error);
            }
            else {
                newsFeed();
                toast.success('Post created');
                setContent("");
                setImage({})
            }

        } catch (err) {
            console.log(err)
        }
    };


    const handleImage = async (e) => {
        const file = e.target.files[0];
        let formData = new FormData()
        formData.append('image', file);
        formData.append("content", content);

        setLoading(true);

        try {
            const { data } = await axios.post("/upload-image", formData);
            setImage({
                url: data.url,
                public_id: data.public_id,

            });

            setLoading(false)
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };


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

        try {

            const { data } = await axios.put(`/like-post`, { _id });
            newsFeed();

        } catch (err) {
            console.log(err);
        }
    };

    const handleUnlike = async (_id) => {

        try {
            const { data } = await axios.put(`/unlike-post`, { _id });

            newsFeed();
        } catch (err) {
            console.log(err);
        }
    };


    const handleComment = async (post) => {
        setCurrentPost(post);
        setVisible(true);

    };


    const addComment = async (e) => {
        e.preventDefault();

        try {

            const { data } = await axios.put('/add-comment', {
                postId: currentPost._id,
                comment
            });

            console.log('add comment=>', data)
            setComment('');
            setVisible(false);
            newsFeed();

        } catch (err) {
            console.log(err);
        }
    };


    const imageSource = (user) => {
        if (user.image) {
            return user.image.url;
        }
        else {
            return "/images/profile.jpg";
        }
    };


    const removeComment = async (postId, comment) => {

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
    

    return (
        <UserRoute>
            <div className='container-fluid'>
                <ParralaxBG url="/images/default.jpeg">Dashboard Page</ParralaxBG>
                <div className="row profile"  >
                    <div className="col-md-3 img-box" >
                        {
                            state && state.user && (
                                <Avatar size={100} src={imageSource(state.user)} />
                            )
                        }
                    </div>
                    <div className="col-md-4 about-box">
                        <div>
                            {state && state.user && state.user.following && state.user.followers && (
                                <span style={{ display: 'flex', justifyContent: 'space-between' }} >
                                    <span className="h6" >
                                        {posts.length} Posts
                                    </span>{" "}
                                    <Link className="h6" href={'/users/following'} >
                                        {state.user.following.length} Following
                                    </Link>{" "}
                                    <Link className="h6" href={'/users/followers'} >
                                        {state.user.followers.length} Followers
                                    </Link>
                                </span>)


                            }{" "}
                        </div>
                        <br></br>
                        <div>
                            {
                                state && state.user && state.user.about && (

                                    <div style={{ whiteSpace: 'pre-line' }}>
                                        {state.user.about}
                                    </div>

                                )


                            }{" "}
                        </div>
                    </div>
                </div>
                <br />

                <div className="row profile" py-3>
                    <div className="col-md-8">
                        <PostForm
                            content={content}
                            setContent={setContent}
                            postSubmit={postSubmit}
                            handleImage={handleImage}
                            loading={loading}
                            image={image}

                        />
                        <br />
                        <PostList
                            id='post'
                            posts={posts} handleDelete={handleDelete} handleLike={handleLike}
                            handleUnlike={handleUnlike} handleComment={handleComment} removeComment={removeComment}
                        />
                    </div>

                </div>
                <Modal visible={visible}
                    onCancel={() => setVisible(false)}
                    title="Comment"
                    footer={null}>
                    <CommentForm comment={comment} addComment={addComment} setComment={setComment} />

                </Modal>

            </div>
        </UserRoute>
    )
}
