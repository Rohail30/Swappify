import './UserProfile.css';
import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import apiRequest from '../../config/apiRequest';
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from 'react-icons/io';

const UserProfile = () => {
  const { currentUser } = useContext(AuthContext);
  const [averageRating, setAverageRating] = useState(null);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await apiRequest.get(`/api/users/${currentUser._id}`);
        if (!res.data.error) {
          setAverageRating(parseFloat(res.data.averageRating));
        }
      } catch (err) {
        console.error('Error fetching average rating:', err);
      }
    };

    if (currentUser?._id) {
      fetchRating();
    }
  }, [currentUser]);

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
          {averageRating !== null && (
            <span>
              Overall Rating:{' '}
              <b>
                {isNaN(averageRating) ? (
                  'No ratings yet!'
                ) : (
                  <>
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
                    &nbsp;({averageRating.toFixed(1)})
                  </>
                )}
              </b>
            </span>
          )}

          <Link to="/update-profile">
            <button>Update Profile</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
