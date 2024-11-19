import './PublicProfile.css';
import '../MyList/MyList.css';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiRequest from '../../config/apiRequest';

const PublicProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [items, setItems] = useState([]);

  const getUserDetails = async () => {
    try {
      const res = await apiRequest.get(`/api/users/${id}`);
      setUser(res.data.user);
    } catch (error) {
      console.log('Error fetching user details:', error);
    }
  };

  const getUserItems = async () => {
    try {
      const res = await apiRequest.get(`api/items/user/${id}`);
      setItems(res.data.items);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserDetails();
    getUserItems();
    // eslint-disable-next-line
  }, [id]);

  return (
    <>
      <div className="publicProfilePage">
        <div className="container">
          <div className="info-sec">
            <div className="propic">
              <img src="/user.png" alt="" />
            </div>
            <div className="info">
              <h1 id="user-info-heading">User Information</h1>
              <span>
                Full Name: <b>{user.name}</b>
              </span>
              <span>
                E-Mail: <b>{user.email}</b>
              </span>
              <span>
                Mobile: <b>{user.mobile}</b>
              </span>
            </div>
          </div>
        </div>

        <div className="userList">
          <div className="l-container">
            <div className="info">
              <h1>User List</h1>
            </div>
          </div>

          <div className="cards">
            <div className="card-container">
              {items.length === 0 ? (
                <p className="empty-text">No items yet! Add one now.</p>
              ) : (
                items.map((item) => (
                  <div className="userListCard " key={item._id}>
                    <div className="image-container">
                      <div className="image">
                        <img
                          src={`http://localhost:5000${item.image}`}
                          alt="Item"
                        />
                      </div>
                    </div>
                    <div className="line-container">
                      <div className="line"></div>
                    </div>
                    <div className="title">
                      <h1>
                        {item.name.length > 16
                          ? item.name.slice(0, 16) + '...'
                          : item.name}
                      </h1>
                    </div>
                    <div className="status">
                      <h2>{item.status}</h2>
                    </div>
                    <div className="buttons">
                      <Link to={`/detail-page/${item._id}`}>
                        <div className="button1">
                          <div className="view">View Details</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicProfile;
