import { React, useState, useContext } from 'react';
import { UserContext } from '../context';
import axios from 'axios';
import People from '../components/cards/People';
import {toast} from 'react-toastify';

const Search = () => {

    const [state, setState] = useContext(UserContext);
    const [query, setQuery] = useState("");
    const [result, setResult] = useState([]);
    

    const searchUser = async (e) => {
        e.preventDefault();
        // console.log("find user", query, "from database");
        try {

            const { data } = await axios.get(`/search-user/${query}`);
            // console.log("query=>", data);
            setResult(data);
           

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
            let filtered = result.filter((p) => (p._id !== user._id));
            setResult(filtered);
  

            toast.success(`Following ${user.name}`);

        } catch (err) {

        }
        // console.log('following');
    };
    const handleUnfollow = async (user) => {
        try {
            const {data} = await axios.put('/user-unfollow',{_id:user._id});

            //update local storage
            let auth = JSON.parse(localStorage.getItem('auth'));
            auth.user = data;
            localStorage.setItem("auth", JSON.stringify(auth));


            //update context
            setState({ ...state, user: data });
            // update people state
            let filtered = result.filter((p) => (p._id !== user._id));
            setResult(filtered);
            
            toast.error(`Unfollowed ${user.name}`);

        } catch (err) {
            console.log(err);
        }

    };

    return (
        <>
            <form className='form-inline row ' onSubmit={searchUser}>
                <div className="col-8">
                    <input type="text"
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setResult([]);
                        }}
                        value={query}
                        className='form-control  col'
                        placeholder='Search' />
                </div>
                <div className="col-4">
                    <button className="btn btn-outline-primary"
                        type='submit'>Search </button>
                </div>
            </form>
            
            {
                result && result.map((r) => (<People key={r._id} people={result}
                    handleFollow={handleFollow}
                    handleUnfollow={handleUnfollow}
                     />))
            }

        </>
    )
}

export default Search;
