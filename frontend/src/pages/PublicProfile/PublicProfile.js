import './PublicProfile.css';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import UserList from '../UserList/UserList';

const PublicProfile = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="publicProfilePage">
      <div className="container">
        <div className="info-sec">
          <div className="propic">
            <img src="/user.png" alt="" />
          </div>
          <div className="info">
            <h1 id="user-info-heading">User Information</h1>
            <span>
              Full Name: <b>{currentUser.name}</b>
            </span>
            <span>
              E-Mail: <b>{currentUser.email}</b>
            </span>
            <span>
              Mobile: <b>{currentUser.mobile}</b>
            </span>
          </div>
        </div>
      </div>
      <UserList />
    </div>
  );
};

export default PublicProfile;
