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
          <img src="/logo1.png" alt="" />
          &nbsp;
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
                <button>{currentUser.name.split(' ')[0]}</button>
              </Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <>
              <Link to="/admin">Admin</Link>
              <Link to="/login">Login</Link>
              <Link to="/register" className="register">
                Register
              </Link>
            </>
          )}
        </div>
        <div className="menuIcon">
          <img
            src="/menu.png"
            alt=""
            onClick={() => setOpen(!open)}
            style={{
              transform: open ? 'rotate(90deg)' : 'none',
            }}
          />
        </div>

        <div className={open ? 'menu active' : 'menu'}>
          <Link to="/">Home</Link>
          <Link to="/item-listing">Swap!</Link>
          {currentUser ? (
            <>
              <Link to="/profile" className="profile">
                <span>Profile</span>
              </Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
