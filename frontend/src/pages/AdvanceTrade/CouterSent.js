import './CounterSent.css';
import apiRequest from '../../config/apiRequest';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { GiCancel } from 'react-icons/gi';
import { Link } from 'react-router-dom';

const CounterSent = () => {
  const [items, setItems] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await apiRequest.get(`/api/trades`);

        let filteredItems = res.data.trades;

        const currentUserId = currentUser._id;
        filteredItems = filteredItems.filter(
          (item) =>
            String(item.fromUser._id) === String(currentUserId) &&
            item.status === 'pending' &&
            item.isCounterTrade === true
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
      await apiRequest.put(`/api/trades/${tradeId}/cancel`);
      alert('Trade cancelled successfully!');
      setItems(items.filter((item) => item._id !== tradeId));
    } catch (error) {
      console.error('Error cancelling trade:', error);
      alert('Failed to cancel trade');
    }
  };

  return (
    <div className="CounterSent">
      {items.length === 0 ? (
        <p className="empty-text">No Sent request</p>
      ) : (
        items.map((item) => (
          <div className="tradepage-container" key={item._id}>
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
              <Link
                to={`/detail-page/${item.ItemOffered._id}`}
                className="remove-button"
              >
                View Details
              </Link>
            </div>
            <div className="mid-sec">
              <div className="status">
                <h1>{item.status}</h1>
                {item.status === 'pending' && (
                  <>
                    <div
                      className="cancel"
                      onClick={() => handleCancel(item._id)}
                    >
                      Cancel
                    </div>
                    <div
                      className="cross"
                      onClick={() => handleCancel(item._id)}
                    >
                      <GiCancel />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="item-cards">
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
                          {wantedItem.name.length > 10
                            ? wantedItem.name.slice(0, 10) + '...'
                            : wantedItem.name}
                        </h4>
                      </div>
                      <div className="pricerange">
                        <h3>{`${wantedItem.price.min} Rs - ${wantedItem.price.max} Rs`}</h3>
                      </div>
                      <div className="button">
                        <Link
                          to={`/detail-page/${wantedItem._id}`}
                          className="view"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))
                : null}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CounterSent;
