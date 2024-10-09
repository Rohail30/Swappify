import { Link } from 'react-router-dom'
import { useState, useContext } from "react";
import "./navbar.css";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {

    const { currentUser, updateUser } = useContext(AuthContext);

    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("user");
        updateUser(null);
    };

    return (
        <nav className='Navbar'>
            <div className="left">
                <a href="/" className="logo">
                    <img src="/logo.png" alt="" />
                    <span>SWAPPIFY</span>
                </a>
                <a href="/">Home</a>
                <a href="/">Explore</a>
                <a href="/">Events</a>
            </div>
            <div className="right">
                <div className='right-menu'>
                    {currentUser ? (
                        <div className="user">
                            <a href="/register" className="about">About Us</a>
                            <Link to="/profile" className="profile">
                                <button>Profile</button>
                            </Link>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    ) : (
                        <>
                            <a href="/register" className="about">About Us</a>
                            <a href="/login">Login</a>
                            <a href="/register" className="register">Register</a>
                        </>
                    )}
                </div>
                <div className="menuIcon">
                    <img src="/menu.png" alt="" onClick={() => setOpen(!open)} style={{ transform: open ? "rotate(90deg)" : "none" }} />
                </div>

                <div className={open ? "menu active" : "menu"}>
                    <a href="/">Home</a>
                    <a href="/">About</a>
                    {currentUser ? (
                        <>
                            <Link to="/profile" className="profile">
                                <span>Profile</span>
                            </Link>
                            <button onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <a href="/login">Login</a>
                            <a href="/register" className="register">Register</a>
                        </>
                    )}
                </div>

            </div>

        </nav>
    );
}


export default Navbar