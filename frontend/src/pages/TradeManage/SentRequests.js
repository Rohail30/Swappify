import './Sent.css';
import apiRequest from '../../config/apiRequest';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

const SentRequests = () => {
  const [items, setItems] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await apiRequest.get(`/api/trades`);
        console.log(res.data.trades); // Debug the response structure

        let filteredItems = res.data.trades; // Assuming trades are returned in `res.data.trades`

        // Filter trades where the current user is the sender
        const currentUserId = currentUser._id;
        filteredItems = filteredItems.filter(
          (item) => String(item.fromUser._id) === String(currentUserId)
        );

        setItems(filteredItems || []);
      } catch (error) {
        console.error('Error fetching trades:', error);
      }
    };

    fetchItems();
  }, [currentUser]);

  const handleCancel = async (tradeId) => {
    try {
      await apiRequest.put(`/api/trades/${tradeId}/cancel`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Trade cancelled successfully!');
      setItems(items.filter((item) => item._id !== tradeId)); // Remove cancelled trade
    } catch (error) {
      console.error('Error cancelling trade:', error);
      alert('Failed to cancel trade');
    }
  };

  return (
    <div className="Sent">
      {items.length === 0 ? (
        <p className="empty-text">No items yet! Add one now.</p>
      ) : (
        items.map((item) => (
          <div className="tradepage-container">
            <div className="requested-item ">
              <div className="header">
                <h1>Item Wanted</h1>
              </div>
              <div className="image">
                <img
                  src={`http://localhost:5000${item.ItemWanted.image}`}
                  alt="Item"
                />
              </div>
              <div className="line-container">
                <div className="line"></div>
              </div>
              <div className="title">
                <h4>
                  {item.ItemWanted.name.length > 16
                    ? item.ItemWanted.name.slice(0, 16) + '...'
                    : item.ItemWanted.name}
                </h4>
              </div>
              <div className="pricerange">
                <h3>{`${item.ItemWanted.price.min} - ${item.ItemWanted.price.max}`}</h3>
              </div>
              <div className="button">
                <div className="view">View Details</div>
              </div>
            </div>
            <div>
              <div className="mid-sec">
                <div className="status">
                  <h1>{item.status}</h1>
                  {/* <div className="cancel">Cancel request </div> */}
                  {item.status === 'pending' && (
                    <div
                      className="cancel"
                      onClick={() => handleCancel(item._id)}
                    >
                      Cancel Request
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="offered-item">
              <div className="header">
                <h1>Item Offered</h1>
              </div>
              <div className="image">
                <img
                  src={`http://localhost:5000${item.ItemOffered.image}`}
                  alt="Item"
                />
              </div>
              <div className="line-container">
                <div className="line"></div>
              </div>
              <div className="title">
                <h4>
                  {item.ItemOffered.name.length > 16
                    ? item.ItemOffered.name.slice(0, 16) + '...'
                    : item.ItemOffered.name}
                </h4>
              </div>
              <div className="pricerange">
                <h3>{`${item.ItemOffered.price.min} - ${item.ItemOffered.price.max}`}</h3>
              </div>
              <div className="remove-button">View Details</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SentRequests;
