import './Received.css';
import { AiOutlineSwap } from 'react-icons/ai';
import apiRequest from '../../config/apiRequest';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

const ReceivedRequests = () => {
  const [items, setItems] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await apiRequest.get(`/api/trades`);
        console.log(res.data.trades);

        let filteredItems = res.data.trades;

        const currentUserId = currentUser._id;
        filteredItems = filteredItems.filter(
          (item) =>
            String(item.toUser._id) === String(currentUserId) &&
            item.status === 'pending'
        );

        setItems(filteredItems || []);
      } catch (error) {
        console.error('Error fetching trades:', error);
      }
    };

    fetchItems();
  }, [currentUser]);

  const handleAccept = async (tradeId) => {
    try {
      await apiRequest.put(`/api/trades/${tradeId}/accept`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Trade accepted successfully!');
      setItems(items.filter((item) => item._id !== tradeId));
    } catch (error) {
      console.error('Error accepting trade:', error);
      alert('Failed to accept trade');
    }
  };

  const handleReject = async (tradeId) => {
    try {
      await apiRequest.put(`/api/trades/${tradeId}/reject`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Trade rejected successfully!');
      setItems(items.filter((item) => item._id !== tradeId));
    } catch (error) {
      console.error('Error rejecting trade:', error);
      alert('Failed to reject trade');
    }
  };

  return (
    <div className="Received">
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
                <div className="actions">
                  <div
                    className="offer-button"
                    onClick={() => handleAccept(item._id)}
                  >
                    <h4>Accept</h4>
                  </div>
                  <AiOutlineSwap />
                  <div
                    className="offer-button"
                    onClick={() => handleReject(item._id)}
                  >
                    <h4>Reject</h4>
                  </div>
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

export default ReceivedRequests;
