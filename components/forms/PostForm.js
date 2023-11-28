import React from 'react';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css';

import { Avatar } from 'antd'
import { CameraOutlined, LoadingOutlined } from '@ant-design/icons';

const PostForm = ({ content, setContent, postSubmit, handleImage, loading, image,handleLike }) => {
    return (
        <>
            <div className="card">
                <div className="card-body">
                    <form action="" className="form-group">
                        <ReactQuill
                            theme='snow'
                            value={content}
                            onChange={(e) => setContent(e)}
                            className='form-control'
                            placeholder='Write here...'
                        ></ReactQuill>
                    </form>
                </div>


                <div className="card-footer d-flex justify-content-between">
                    <button
                        disabled={!content}
                        className="btn btn-primary mt-1"
                        onClick={postSubmit}
                    >Post</button>
                    <label >
                        {
                            image && image.url ? (
                                <Avatar size={30} src ={image.url} className='mt-1' />
                            ) : loading ? (
                                <LoadingOutlined className='mt-3' />
                            ) : (
                                <CameraOutlined className='mt-3' />
                            )}
                        <input onChange={handleImage} type="file" accept='images/*' hidden />
                    </label>
                </div>
            </div>

        </>
    )
}

export default PostForm;
