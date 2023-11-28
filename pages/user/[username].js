import { React, useContext, useEffect, useState } from 'react';
import { Avatar, Card } from 'antd';
import { UserContext } from '../../context';
import { useRouter } from 'next/router';
import axios from 'axios';
import { RollbackOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { toast } from "react-toastify";
import { CameraOutlined } from '@ant-design/icons';
import PostList from '../../components/cards/PostList';
import { Modal } from 'antd';
import CommentForm from '../../components/forms/CommentForm';

export default function Username() {

    const [state, setState] = useContext(UserContext);
    const [user, setUser] = useState({});
    const [posts, setPosts] = useState([]);
    const [comment, setComment] = useState('');
    const [visible, setVisible] = useState(false);
    const [currentPost, setCurrentPost] = useState({});

    const router = useRouter();

    useEffect(() => {
        if (router.query.username)
            fetchUser();
        fetchPost();

    }, [router.query.username]);




    const fetchPost = async () => {
        try {

            const { data } = await axios.get(`/user/post/${router.query.username}`);
            // console.log('userposts=>', data);
            setPosts(data);

        } catch (err) {
            console.log(err);
        }
    }


    const fetchUser = async () => {
        try {

            const { data } = await axios.get(`/user/${router.query.username}`);
            // console.log("router.query.username", data);
            setUser(data);

        } catch (err) {
            console.log(err);
        }

    };

    const imageSource = (user) => {
        if (user.image) {
            return user.image.url;
        }
        else {
            return "/images/profile.jpg"
        }
    };

    const handleDelete = async (post) => {
        try {
            const answer = window.confirm("Are you sure to delete post?");
            if (!answer) return;
            const { data } = await axios.delete(`/delete-post/${post._id}`);
            toast.error("Post deleted");
            fetchPost();
        } catch (err) {
            console.log(err);
        }
    };
    const handleLike = async (_id) => {

        try {

            const { data } = await axios.put(`/like-post`, { _id });

            fetchPost();

        } catch (err) {
            console.log(err);
        }
    };

    const handleUnlike = async (_id) => {

        try {
            const { data } = await axios.put(`/unlike-post`, { _id });
            // console.log("unliked data=>", data);
            fetchPost();
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
            fetchPost();

        } catch (err) {
            console.log(err);
        }
    };


    const removeComment = async (postId, comment) => {

        try {

            let answer = window.confirm("Are you sure to delete comment?");
            if (!answer) return;
            const { data } = await axios.put(`/remove-comment`, { postId, comment });
            console.log("removed comment", data);
            fetchPost();

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <div className='container-fluid'>
                <div className="username">
                    {
                        user && (
                            <h6>{user.username}</h6>
                        )
                    }
                </div>
                <div className="row userprofile"  >
                    <div className="col-md-3 img-box" >
                        {
                            user && (
                                <Avatar size={100} src={imageSource(user)} />
                            )
                        }
                    </div>
                    <div className="col-md-4 about-box">
                        <div>
                            {user && user.following && user.followers && (
                                <span style={{ display: 'flex', justifyContent: 'space-between' }} >
                                    <span className="h6" >
                                        {posts.length} Posts
                                    </span>{" "}
                                    <span className="h6" href={'/users/following'} >
                                        {user.following.length} Following
                                    </span>{" "}
                                    <span className="h6" href={'/users/followers'} >
                                        {user.followers.length} Followers
                                    </span>
                                </span>)


                            }{" "}
                        </div>
                        <br></br>
                        <div>
                            {
                                user && user.about && (

                                    <div style={{ whiteSpace: 'pre-line' }}>
                                        {user.about}
                                    </div>

                                )


                            }{" "}
                        </div>
                    </div>
                </div>

                <hr />
                <div className="row post-box">
                    <div className="col-md-8 ">
                        {
                            posts.length == 0 ? (
                                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                    <CameraOutlined />
                                    <h3>No Post Yet</h3>
                                </div>

                            ) : (
                                <PostList
                                    id='post'
                                    posts={posts} handleDelete={handleDelete} handleLike={handleLike}
                                    handleUnlike={handleUnlike} handleComment={handleComment} removeComment={removeComment}
                                />

                            )
                        }
                    </div>
                </div>
                <Modal visible={visible}
                    onCancel={() => setVisible(false)}
                    title="Comment"
                    footer={null}>
                    <CommentForm comment={comment} addComment={addComment} setComment={setComment} />

                </Modal>

            </div>
        </>
    );
};
