import { React, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import UserRoute from '../../components/routes/UserRoute';
import { toast } from 'react-toastify';
import Post from '../../components/cards/Post';
import { RollbackOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { Modal } from 'antd';
import CommentForm from '../../components/forms/CommentForm';

const PostComments = () => {

    const [post, setPost] = useState({});

    const [comment, setComment] = useState('');
    const [visible, setVisible] = useState(false);
    const [currentPost, setCurrentPost] = useState({});
    const router = useRouter();

    const _id = router.query._id;

    useEffect(() => {
        if (_id) {
            fetchPost();
        }
    }, [_id]);

    const fetchPost = async () => {
        try {
            const { data } = await axios.get(`/user-post/${_id}`);

            setPost(data);

        } catch (err) {
            console.log(err);
        }
    };

    const removeComment = async (postId, comment) => {
        // console.log("postId and comment",postId,comment);

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
        // console.log('add coment to this post id=>',currentPost._id)
        // console.log('comment',comment);
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

    return (
        <div className='container-fluid'>
            <div className="row py-5 text-light">
                <div className="col text-center">
                    <h1 >Post</h1>
                </div>
            </div>
            <div className="container row col-md-8 offset-md-2 pt-5">
                <Post post={post} commentsCount={100} removeComment={removeComment} handleLike={handleLike} handleUnlike={handleUnlike} handleComment={handleComment} handleDelete={handleDelete} />
            </div>
            <Link href="/users/dashboard" className='d-flex justify-content-center p5 h5'>
                <RollbackOutlined />
            </Link>

            <Modal visible={visible}
                onCancel={() => setVisible(false)}
                title="Comment"
                footer={null}>
                <CommentForm comment={comment} addComment={addComment} setComment={setComment} />

            </Modal>



        </div>
    )
}

export default PostComments;
