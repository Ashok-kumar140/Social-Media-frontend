import { React, useContext } from 'react';
import { Avatar } from 'antd';
import renderHTML from 'react-render-html';
import moment from 'moment';
import PostImage from '../images/PostImage';
import { HeartOutlined, HeartFilled, CommentOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { UserContext } from '../../context';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Post = ({ post, handleDelete, handleLike, handleUnlike, handleComment, commentsCount = 2,removeComment }) => {

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
                post && post.postedBy && (
                    <div key={post._id} className='card mb-5'>
                        <div className="card-header">

                            <Avatar size={40} src={imageSource(post.postedBy)}></Avatar>{" "}
                            <span className='pt-2 px-1'>{post.postedBy.name}</span>
                            <span className='pt-2 px-1'>{moment(post.createdAt).fromNow()}
                            </span>

                        </div>
                        <div className="card-body">
                            {renderHTML(post.content)}

                        </div>
                        <div className="card-footer ">
                            {post.image && <PostImage url={post.image.url} />}
                            <div className="d-flex pt-1">
                                {state && state.user && post.likes && post.likes.includes(state.user._id) ? (
                                    <HeartFilled className='text-danger pt-2 h5' onClick={() => handleUnlike(post._id)} />
                                ) : (
                                    <HeartOutlined className='text-danger pt-2 h5' onClick={() => handleLike(post._id)} />
                                )}
                                <div className="pt-2 mx-2">{post.likes.length} likes</div>
                                <CommentOutlined
                                    onClick={() => handleComment(post)}
                                    className='text-danger pt-2 h5 ' />
                                <div className="pt-2 mx-2">
                                    <Link href={`/post/${post._id}`}>{post.comments.length} comments
                                    </Link>
                                </div>
                                {
                                    state && state.user && state.user._id === post.postedBy._id && (
                                        <>
                                            <EditOutlined
                                                onClick={() => router.push(`/users/post/${post._id}`)} className='text-danger pt-2 h5 mx-auto' />
                                            <DeleteOutlined
                                                onClick={() => handleDelete(post)} className='text-danger pt-2 h5' /></>
                                    )
                                }
                            </div>

                        </div>
                        {
                            post.comments && post.comments.length > 0 && (
                                <ol className="list-group">
                                    {post.comments.slice(0, commentsCount).map((c) => (
                                        <li key={c._id} className="list-group-item d-flex justify-content-between align-items-start"  >
                                            <div className="ms-2 me-auto">
                                                <div >
                                                    <Avatar size={20} className="mb-1 mr-3" src={imageSource(c.postedBy)} />{" "}
                                                    {c.postedBy.name}
                                                </div>
                                                <div>{c.text}</div>

                                            </div>
                                            <span className="badge rounded-pill text-muted">
                                                {moment(c.created).fromNow()}
                                                {state && state.user && state.user._id===c.postedBy._id &&(
                                                    <div className="ml-auto mt-1">
                                                    <DeleteOutlined
                                                    onClick={()=>removeComment(post,c)}
                                                     className="pl-2 text-danger"/>
                                                    </div>
                                                )}
                                            </span>

                                        </li>
                                    ))}
                                </ol>

                            )
                        }
                    </div>

                )
            }
        </>
    );
};

export default Post;
