import './PublicProfile.css';
import '../MyList/MyList.css';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiRequest from '../../config/apiRequest';
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from 'react-icons/io';

const PublicProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [items, setItems] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(null); // <- new state

  const getUserDetails = async () => {
    try {
      const res = await apiRequest.get(`/api/users/${id}`);
      setUser(res.data.user);
      console.log(res.data.averageRating);
      setAverageRating(res.data.averageRating); // <- set average rating
    } catch (error) {
      console.log('Error fetching user details:', error);
    }
  };

  const getUserItems = async () => {
    try {
      const res = await apiRequest.get(`/api/items/user/${id}`);
      setItems(res.data.items);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserRatings = async () => {
    try {
      const res = await apiRequest.get(`/api/rating/user/${id}`);
      setRatings(res.data.ratings);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserDetails();
    getUserItems();
    getUserRatings();
    // eslint-disable-next-line
  }, [id]);

  return (
    <div className="publicProfilePage">
      <div className="container">
        <div className="info-sec">
          <div className="propic">
            <img src="/user.png" alt="profile" />
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
            {averageRating && (
              <span>
                {isNaN(averageRating) ? (
                  <b>No ratings yet!</b>
                ) : (
                  <>
                    User Rating:{' '}
                    <b>
                      {Array.from({ length: 5 }, (_, i) => {
                        const ratingValue = i + 1;
                        if (averageRating >= ratingValue) {
                          return (
                            <IoIosStar
                              key={i}
                              style={{ color: 'gold', verticalAlign: 'middle' }}
                            />
                          );
                        } else if (averageRating >= ratingValue - 0.5) {
                          return (
                            <IoIosStarHalf
                              key={i}
                              style={{ color: 'gold', verticalAlign: 'middle' }}
                            />
                          );
                        } else {
                          return (
                            <IoIosStarOutline
                              key={i}
                              style={{ color: 'gold', verticalAlign: 'middle' }}
                            />
                          );
                        }
                      })}
                      &nbsp;({Number(averageRating).toFixed(1)})
                    </b>
                  </>
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="userList">
        <div className="l-container">
          <div className="info">
            <h1>User Item List</h1>
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

      <div className="rev-section">
        <h1>Rating and Reviews</h1>
        <div className="rating-list">
          {ratings.length === 0 ? (
            <p className="empty-text">No reviews yet.</p>
          ) : (
            ratings.map((rating, idx) => (
              <div className="rating-card" key={rating._id || idx}>
                <div className="propic">
                  <img src="/user.png" alt="user" />
                </div>
                <div className="R-User">
                  <b>{rating.user?.name || 'Anonymous'}</b>
                </div>
                <div className="line-container">
                  <div className="line"></div>
                </div>
                <div className="R-date">
                  {new Date(rating.createdAt).toLocaleDateString()}
                </div>
                <div className="line-container">
                  <div className="line"></div>
                </div>
                <div className="R-Stars">
                  <div className="rating">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <IoIosStar
                        key={i}
                        style={{ color: i <= rating.rating ? 'gold' : '#ccc' }}
                      />
                    ))}
                  </div>
                </div>
                <div className="line-container">
                  <div className="line"></div>
                </div>
                <div className="R-Review">{rating.review}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
