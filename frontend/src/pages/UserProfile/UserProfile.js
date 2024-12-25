import './UserProfile.css';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const UserProfile = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="user-profile">
      <div className="up">User Profile</div>
      <div className="container">
        <div className="info">
          <h1 id="user-info-heading">User Information</h1>
          <div className="propic">
            <img src="/user.png" alt="" />
          </div>
          <span>
            Full Name: <b>{currentUser.name}</b>
          </span>
          <span>
            E-Mail: <b>{currentUser.email}</b>
          </span>
          <span>
            Mobile: <b>{currentUser.mobile}</b>
          </span>
          <Link to="/update-profile">
            <button>Update Profile</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
