import { React, useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';
import { SyncOutlined, CameraOutlined,LoadingOutlined } from '@ant-design/icons';
import { UserContext } from '../../../context';
import { useRouter } from 'next/router';
import { Avatar } from 'antd';


export default function register() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [gender, setGender] = useState("");
    const [about, setAbout] = useState("");
    const [image, setImage] = useState({});
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [ok, setOk] = useState(false)

    const [state, setState] = useContext(UserContext);

    const router = useRouter();

    useEffect(() => {
        if (state && state.user) {
            setUsername(state.user.username);
            setAbout(state.user.about);
            setGender(state.user.gender);
            setName(state.user.name);
            setEmail(state.user.email);
            setImage(state.user.image)
        }

    }, [state && state.user])


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
           
            setLoading(true);
            const { data } = await axios.put(`/profile-update`,
                {
                    name,
                    username,
                    about,
                    gender,
                    image
                });
            console.log("updated data==>", data);
            if (data.error) {
                toast.error(data.error);
                setLoading(false);
            }
            else {
                toast.success("Profile updated successfuly");
                setOk(true);
                setLoading(false);
                //update local storage,update user,keep token
                let auth = JSON.parse(localStorage.getItem("auth"));
                auth.user = data;
                localStorage.setItem("auth", JSON.stringify(auth));
                //update context

                setState({ ...state, user: data });
            }
        } catch (err) {
            // toast.error(err.response.data);
            console.log(err);
            setLoading(false);
        }

    };
    const handleImage = async (e) => {
        const file = e.target.files[0];
        let formData = new FormData()
        formData.append('image', file);
       
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

    return (
        <div className='container-fluid'>
            <div className="row py-5 bg-default-image text-light">
                <div className="col text-center">
                    <h1 >Update your profile</h1>
                </div>
            </div>
            <div className="row py-5">
                <div className="col-md-6 offset-md-3">
                    <label  className='d-flex justify-content-center h5'>
                        {
                            image && image.url ? (
                                <Avatar size={50} src={image.url} className='mt-1' />
                            ) : loading ? (
                                <LoadingOutlined className='mt-3' />
                            ) : (
                                <CameraOutlined className='mt-3' />
                            )}
                        <input onChange={handleImage} type="file" accept='images/*' hidden />
                    </label>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group p-2">
                            <small>
                                <label className='text-muted'>Name</label>
                            </small>
                            <input value={name} onChange={(e) => setName(e.target.value)} type="text" className='form-control' placeholder='Enter your name' />
                        </div>
                        <div className="form-group p-2">
                            <small>
                                <label className='text-muted'>Username</label>
                            </small>
                            <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" className='form-control' placeholder='Enter your username' />
                        </div>
                        <div className="form-group p-2">
                            <small>
                                <label className='text-muted'>Emial</label>
                            </small>
                            <input disabled={true} value={email} onChange={(e) => setEmail(e.target.value)} type="email" className='form-control' placeholder='Enter your email' />
                        </div>
                        <div className="form-group p-2">
                            <small>
                                <label className='text-muted'>About</label>
                            </small>
                            <textarea value={about} onChange={(e) => setAbout(e.target.value)} type="textarea" className='form-control' placeholder='Write about yourself' />
                        </div>
                        <div className="form-group p-2">
                            <small>
                                <label className='text-muted'>Gender</label>
                            </small>
                            <input value={gender} onChange={(e) => setGender(e.target.value)} type="text" className='form-control' placeholder='Write your gender' />
                        </div>

                        <div className="form-group p-2">
                            <button

                                className="btn btn-primary col-12 p-2">
                                {loading ? <SyncOutlined spin className="py-1" /> : "SUBMIT"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>




        </div >
    )
}
