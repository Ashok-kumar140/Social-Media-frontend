import { React, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { UserContext } from '../context';
import { useRouter } from 'next/router';

export default function Nav() {

    const [state, setState] = useContext(UserContext);
    const [current, setCurrent] = useState("");



    const router = useRouter();

    useEffect(() => {
        process.browser && setCurrent(window.location.pathname);

    }, [process.browser && window.location.pathname]);


    const logout = () => {
        window.localStorage.removeItem("auth");
        setState(null);
        router.push("/login");
    }
    return (
        <>
            <nav className='nav d-flex justify-content-between' style={{ backgroundColor: "#fef2f2" }}>
                <Link href="/" className={`nav-link `}>
                    <img src="/images/logo2.png" alt="" style={{height:'30px',
                width:'60px'}} />
                </Link>



                {state !== null ? (
                    <>
                        <div className="dropdown">
                            <button
                                className="btn dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                
                                aria-expanded="true">
                                {state && state.user && state.user.name}
                            </button>
                            <ul
                                className="dropdown-menu"
                                >
                                <Link className={`nav-link dropdown-item   ${current === '/' && "active"}`} href="/">Home</Link>
                                <Link className={`nav-link dropdown-item   ${current === '/users/profile/update' && "active"}`} href="/users/profile/update">Update Profile</Link>
                                <Link className={`nav-link dropdown-item   ${current === '/users/dashboard' && "active"}`} href="/users/dashboard">Dashboard</Link>
                                <a className="nav-link dropdown-item " onClick={logout}>Logout</a>
                            </ul>
                        </div>

                    </>
                ) : (
                    <>
                        <Link className={`nav-link   ${current === '/login' && "active"}`} href="/login">Login</Link>
                        <Link className={`nav-link  ${current === '/register' && "active"}`} href="/register">Signup</Link>

                    </>

                )}
            </nav>





        </>
    )
}
