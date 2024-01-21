import React from 'react';

const Navbar = () => {
    const isLoggedIn = sessionStorage.getItem('jwt') !== null;

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <button className="navbar-toggler border border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="fw-lighter">Links</span>
                </button>
                <div className="collapse navbar-collapse fw-lighter" id="navbarNav">
                    <ul className="navbar-nav me-auto mx-4">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/home">🏠 Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/house">🛡️ Houses</a>
                        </li>
                        {isLoggedIn && (
                            <li className="nav-item">
                                <a className="nav-link active" href={`/my-page?username=${sessionStorage.getItem('username')}`}>
                                    👨🏻‍💻 My Page
                                </a>
                            </li>
                        )}
                    </ul>
                    <ul className="navbar-nav mx-4">
                        {isLoggedIn ? (
                            <li className="nav-item active">
                                <a className="nav-link" href="/home" onClick={() => {sessionStorage.clear();}}>
                                    Logout
                                </a>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <a className="nav-link" href="/login">Login</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/signup">Signup</a>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
