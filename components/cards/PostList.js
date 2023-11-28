import { React, useContext } from 'react';
import { Avatar } from 'antd';
import renderHTML from 'react-render-html';
import moment from 'moment';
import PostImage from '../images/PostImage';
import { HeartOutlined, HeartFilled, CommentOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { UserContext } from '../../context';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Post from '../../components/cards/Post';

const PostList = ({ posts, handleDelete, handleLike, handleUnlike, handleComment,removeComment }) => {

    const [state] = useContext(UserContext);

    const router = useRouter();

    const imageSource = (user) => {
        if (user.image) {
            return user.image.url;
        }
        else {
            return "/images/profile.jpg";
        }
    }


    return (
        <>
            {
                posts && posts.map((post) => (
                    <Post
                        key={post._id}
                        post={post}
                        handleDelete={handleDelete}
                        handleLike={handleLike}
                        handleUnlike={handleUnlike}
                        handleComment={handleComment}
                        removeComment={removeComment}
                    />
                ))
            }
        </>
    );
};

export default PostList;
