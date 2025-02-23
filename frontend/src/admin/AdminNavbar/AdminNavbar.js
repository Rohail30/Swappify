import './AdminNavbar.css';
import { Link } from 'react-router-dom';
import { MdLogout } from 'react-icons/md';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import apiRequest from '../../config/apiRequest';
import { useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const { currentUser, updateUser } = useContext(AuthContext);

  const handleLogout = () => {
    apiRequest.get('/api/admin/logout');
    localStorage.removeItem('user');
    updateUser(null);
    navigate('/admin');
  };

  return (
    <div className="admin-navbar">
      <div className="left">
        <div className="logo">
          <img src="/logo1.png" alt="" />
          &nbsp;
          <span>SWAPPIFY</span>
        </div>
        <Link to="/admin/portal">
          <h1>Dashboard</h1>
        </Link>
      </div>
      <div className="right">
        {currentUser ? (
          <>
            {currentUser.name}&nbsp;
            <MdLogout className="log-out" onClick={handleLogout} />
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default AdminNavbar;
