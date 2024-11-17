import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import './navbar.css';
import { AuthContext } from '../../context/AuthContext';
import apiRequest from '../../config/apiRequest';

const Navbar = () => {
  const navigate = useNavigate();

  const { currentUser, updateUser } = useContext(AuthContext);

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    apiRequest.get('/api/auth/logout');
    localStorage.removeItem('user');
    updateUser(null);
    navigate('/');
  };

  return (
    <nav className="Navbar">
      <div className="left">
        <a href="/" className="logo">
          <img src="/logo.png" alt="" />
          <span>SWAPPIFY</span>
        </a>
        <Link to="/">Home</Link>
        <Link to="/item-listing">Swap!</Link>
      </div>
      <div className="right">
        <div className="right-menu">
          {currentUser ? (
            <div className="user">
              <Link to="/profile" className="profile">
                <button>Profile</button>
              </Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <>
              <a href="/login">Login</a>
              <a href="/register" className="register">
                Register
              </a>
            </>
          )}
        </div>
        <div className="menuIcon">
          <img
            src="/menu.png"
            alt=""
            onClick={() => setOpen(!open)}
            style={{ transform: open ? 'rotate(90deg)' : 'none' }}
          />
        </div>

        <div className={open ? 'menu active' : 'menu'}>
          <a href="/">Home</a>
          <a href="/">Swap!</a>
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
              <a href="/register" className="register">
                Register
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
