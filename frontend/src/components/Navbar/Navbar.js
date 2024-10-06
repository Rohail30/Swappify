import { Link } from 'react-router-dom'
import { useState, useContext } from "react";
import "./navbar.css";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {

    const { currentUser } = useContext(AuthContext);

    const [open, setOpen] = useState(false);

    return (
        <nav>
            <div className="left">
                <a href="/" className="logo">
                    <img src="/logo.png" alt="" />
                    <span>SWAPPIFY</span>
                </a>
                <a href="/">Home</a>
                <a href="/">About</a>
            </div>
            <div className="right">
                {currentUser ? (
                    <div className="user">
                        <span>{currentUser.name}</span>
                        <Link to="/profile" className="profile">
                            <span>Profile</span>
                        </Link>
                    </div>
                ) : (
                    <>
                        <a href="/login">Login</a>
                        <a href="/register" className="register">Register</a>
                    </>
                )}
                <div className="menuIcon">
                    <img
                        src="/menu.png"
                        alt=""
                        onClick={() => setOpen((prev) => !prev)}
                    />
                </div>

                <div className={open ? "menu active" : "menu"}>
                    <a href="/">Home</a>
                    <a href="/">About</a>
                    {currentUser ? (
                        <>
                            <Link to="/profile" className="profile">
                                <span>Profile</span>
                            </Link>
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