import { React, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {toast} from 'react-toastify';
import axios from 'axios';
import UserRoute from '../../../components/routes/UserRoute';
import PostForm from '../../../components/forms/PostForm';

const EditPost = () => {

    const [post, setPost] = useState({});
    const [content, setContent] = useState("");
    const [image, setImage] = useState({});
    const [posts, setPosts] = useState([]);
    const router = useRouter();
    const _id = router.query._id;

    useEffect(() => {
        if (_id) fetchPost();
    }, [_id])

    const fetchPost = async () => {

        try {
            const { data } = await axios.get(`/user-post/${_id}`);
            setPost(data);
            setContent(data.content);
            setImage(data.image);

        } catch (err) {
            console.log(err);
        }
    };

    const postSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.put(`/update-post/${_id}`,{
                content,
                image,
            });
            
            if (data.error) {
                toast.error(data.error);

            }
            else {
                toast.success("Post updated Successfuly");
                router.push('/users/dashboard');
            }

        } catch (err) {
            console.log(err);
        }

    };
    const handleImage = async (e) => {
        const file = e.target.files[0];
        let formData = new FormData()
        formData.append('image', file);
        formData.append("content", content);



        // console.log([...formData]);
        setLoading(true);

        try {
            const { data } = await axios.post("/upload-image", formData);

            // console.log("image=>", data);
            setImage({
                url: data.url,
                public_id: data.public_id,

            });

            setLoading(false)
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    }


    return (
        <UserRoute>
            <div className='container-fluid'>
                <div className="row py-5 text-light">
                    <div className="col text-center">
                        <h1 >Dashboard Page</h1>
                    </div>
                </div>
                <div className="row" py-3>
                    <div className="col-md-8 offset-md-2">
                        <PostForm
                            content={content}
                            setContent={setContent}
                            postSubmit={postSubmit}
                            handleImage={handleImage}

                            image={image} />
                    </div>
                </div>

            </div>
        </UserRoute>
    )
}

export default EditPost;
