import './UserList.css';
import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import apiRequest from '../../config/apiRequest';

const UserList = () => {
  const { currentUser } = useContext(AuthContext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await apiRequest.get(`api/items/user/${currentUser._id}`);
        setItems(res.data.items);
      } catch (error) {
        console.log(error);
      }
    };
    fetchItems();
  }, [currentUser._id]);

  return (
    <div className="userList">
      <div className="container">
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
              <div className="userListCard" key={item._id}>
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
                  <h1>{item.name}</h1>
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
  );
};

export default UserList;
