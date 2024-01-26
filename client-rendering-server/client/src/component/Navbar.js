import React from 'react';
import AvatarMe from "./user-page/AvatarMe";
import './Navbar.css'

const Navbar = () => {
    const isLoggedIn = sessionStorage.getItem('jwt') !== null;

    return (
        <nav className="navbar navbar-expand bg-body-tertiary">
            <div className="container-fluid">
                <div className="navbar-nav me-auto mx-4">
                    <a className="nav-link active fw-lighter" aria-current="page" href="/home">🏠 Home</a>
                    <a className="nav-link active fw-lighter" aria-current="page" href="/house">🛡️ Houses</a>
                    <a className="nav-link active fw-lighter" aria-current="page" href="/course">📚 Course</a>
                    {isLoggedIn && (
                        <a className="nav-link active fw-lighter" href={`/my-page?username=${sessionStorage.getItem('username')}`}>
                            👨🏻‍💻 My Page
                        </a>
                    )}
                </div>
                <div className="navbar-nav mx-4">
                    {isLoggedIn ? (
                        <>
                            <a className="nav-link">
                                <AvatarMe />
                            </a>
                            {/*<a className="nav-link active fw-light" href="/home" onClick={() => {sessionStorage.clear();}}>*/}
                            {/*    Logout*/}
                            {/*</a>*/}
                        </>
                    ) : (
                        <>
                            <a className="nav-link active fw-lighter" href="/login">Login</a>
                            <a className="nav-link active fw-lighter" href="/signup">Signup</a>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
