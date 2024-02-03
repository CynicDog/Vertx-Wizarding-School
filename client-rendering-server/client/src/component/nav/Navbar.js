import React, {useEffect, useState} from 'react';
import AvatarMe from "../avatar/AvatarMe";
import './Navbar.css'

const Navbar = () => {
    const [darkMode, setDarkMode] = useState(false);
    const isLoggedIn = sessionStorage.getItem('jwt') !== null;

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        setColorModePreference(newMode ? 'dark' : 'light');
        updateHtmlTheme(newMode ? 'dark' : 'light');
    };

    const setColorModePreference = (mode) => {
        localStorage.setItem('colorMode', mode);
    };

    const applyColorModePreference = () => {
        const colorMode = localStorage.getItem('colorMode');
        setDarkMode(colorMode === 'dark');
        updateHtmlTheme(colorMode);
    };

    const updateHtmlTheme = (mode) => {
        const htmlElement = document.querySelector('html');
        if (mode === 'dark') {
            htmlElement.setAttribute('data-bs-theme', 'dark');
        } else {
            htmlElement.removeAttribute('data-bs-theme');
        }
    };

    useEffect(() => {
        applyColorModePreference();
    }, []);

    return (
        <nav className="navbar navbar-expand bg-body-tertiary">
            <div className="container-fluid">
                <div className="navbar-nav me-auto mx-4">
                    <a className="nav-link active fw-lighter" aria-current="page" href="/Users/ginsenglee/Documents/GitHub/Java/VertxWizardingSchool/client-rendering-server/client/src/page/Home">🏠 Home</a>
                    <a className="nav-link active fw-lighter" aria-current="page" href="/house">🛡️ Houses</a>
                    <a className="nav-link active fw-lighter" aria-current="page" href="/course">📚 Course</a>
                    {/*{isLoggedIn && (*/}
                    {/*    <a className="nav-link active fw-lighter" href={`/my-page?username=${sessionStorage.getItem('username')}`}>*/}
                    {/*        👨🏻‍💻 My Page*/}
                    {/*    </a>*/}
                    {/*)}*/}
                </div>
                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckChecked"
                        checked={darkMode}
                        onChange={toggleDarkMode}
                    />
                </div>
                <div className="navbar-nav">
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
