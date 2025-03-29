import './CounterReceived.css';
import { AiOutlineSwap } from 'react-icons/ai';
import apiRequest from '../../config/apiRequest';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { GrFormPrevious } from 'react-icons/gr';

const CounterReceived = () => {
  const [items, setItems] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [wantedSlide, setWantedSlide] = useState(0);

  const fetchItems = async () => {
    try {
      const res = await apiRequest.get(`/api/trades`);

      let filteredItems = res.data.trades;

      const currentUserId = currentUser._id;
      filteredItems = filteredItems.filter(
        (item) =>
          String(item.toUser._id) === String(currentUserId) &&
          item.status === 'pending' &&
          item.isCounterTrade === true
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
    <div className="CounterReceived">
      {items.length === 0 ? (
        <p className="empty-text">No Received SentRequest</p>
      ) : (
        items.map((item) => {
          const totalWanted = item.ItemWanted.length;

          const nextWantedSlide = () => {
            setWantedSlide((prev) => (prev + 1) % totalWanted);
          };

          const prevWantedSlide = () => {
            setWantedSlide((prev) => (prev - 1 + totalWanted) % totalWanted);
          };

          return (
            <div className="main">
              <span>
                <b>Order ID:</b> {item._id}
              </span>
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
                  <Link to={`/detail-page/${item.ItemOffered._id}`}>
                    <div className="remove-button">View Details</div>
                  </Link>
                </div>
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
                <div className="wanted-items-slider">
                  <GrFormPrevious
                    onClick={prevWantedSlide}
                    className="slider-button prev-wanted"
                  />
                  <div className="item-cards">
                    <div className="requested-item">
                      <div className="header">
                        <h1>Item Wanted</h1>
                      </div>
                      <div className="image">
                        <img
                          src={`http://localhost:5000${item.ItemWanted[wantedSlide].image}`}
                          alt="Item"
                        />
                      </div>
                      <div className="line-container">
                        <div className="line"></div>
                      </div>
                      <div className="title">
                        <h4>
                          {item.ItemWanted[wantedSlide].name.length > 16
                            ? item.ItemWanted[wantedSlide].name.slice(0, 16) +
                              '...'
                            : item.ItemWanted[wantedSlide].name}
                        </h4>
                      </div>
                      <div className="pricerange">
                        <h3>{`${item.ItemWanted[wantedSlide].price.min} Rs - ${item.ItemWanted[wantedSlide].price.max} Rs`}</h3>
                      </div>

                      <Link
                        to={`/detail-page/${item.ItemWanted[wantedSlide]._id}`}
                        className="view"
                      >
                        <div className="button">View Details</div>
                      </Link>
                    </div>
                  </div>
                  <MdOutlineNavigateNext
                    onClick={nextWantedSlide}
                    className="slider-button next-wanted"
                  />
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default CounterReceived;
