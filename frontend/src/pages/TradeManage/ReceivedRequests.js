import './Received.css';
import { AiOutlineSwap } from 'react-icons/ai';
import apiRequest from '../../config/apiRequest';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

const ReceivedRequests = () => {
  const [items, setItems] = useState([]);
  const { currentUser } = useContext(AuthContext);

  const fetchItems = async () => {
    try {
      const res = await apiRequest.get(`/api/trades`);

      let filteredItems = res.data.trades;

      const currentUserId = currentUser._id;
      filteredItems = filteredItems.filter(
        (item) =>
          String(item.toUser._id) === String(currentUserId) &&
          item.status === 'pending' &&
          item.counterTrade === false
      );

      setItems(filteredItems || []);
    } catch (error) {
      console.error('Error fetching trades:', error);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line
  }, [currentUser]);

  const handleAccept = async (tradeId) => {
    try {
      await apiRequest.put(`/api/trades/${tradeId}/accept`);
      alert('Trade accepted successfully!');
      fetchItems();
    } catch (error) {
      console.error('Error accepting trade:', error);
      alert('Failed to accept trade');
    }
  };

  const handleReject = async (tradeId) => {
    try {
      await apiRequest.put(`/api/trades/${tradeId}/reject`);
      alert('Trade rejected successfully!');
      fetchItems();
    } catch (error) {
      console.error('Error rejecting trade:', error);
      alert('Failed to reject trade');
    }
  };

  return (
    <div className="Received">
      {items.length === 0 ? (
        <p className="empty-text">No Received SentRequest</p>
      ) : (
        items.map((item) => (
          <div className="tradepage-container" key={item._id}>

            {Array.isArray(item.ItemWanted)
              ? item.ItemWanted.map((wantedItem) => (
                <div className="requested-item" key={wantedItem._id}>
                  <div className="header">
                    <h1>Item Wanted</h1>
                  </div>
                  <div className="image">
                    <img
                      src={`http://localhost:5000${wantedItem.image}`}
                      alt="Item"
                    />
                  </div>
                  <div className="line-container">
                    <div className="line"></div>
                  </div>
                  <div className="title">
                    <h4>
                      {wantedItem.name.length > 16
                        ? wantedItem.name.slice(0, 16) + '...'
                        : wantedItem.name}
                    </h4>
                  </div>
                  <div className="pricerange">
                    <h3>{`${wantedItem.price.min} Rs - ${wantedItem.price.max} Rs`}</h3>
                  </div>
                  <div className="button">
                    <div className="view">View Details</div>
                  </div>
                </div>
              ))
              : null}

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
                <h3>{`${item.ItemOffered.price.min} Rs - ${item.ItemOffered.price.max} Rs`}</h3>
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
