import './CounterReceived.css';
import { AiOutlineSwap } from 'react-icons/ai';
import apiRequest from '../../config/apiRequest';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { GrFormPrevious } from 'react-icons/gr';
import { IoChatboxEllipsesOutline } from 'react-icons/io5';

const CounterReceived = () => {
  const [items, setItems] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [wantedSlides, setWantedSlides] = useState({});

  useEffect(() => {
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

        const initialSlides = {};
        filteredItems.forEach((item) => {
          initialSlides[item._id] = 0;
        });
        setWantedSlides(initialSlides);
      } catch (error) {
        console.error('Error fetching trades:', error);
      }
    };

    fetchItems();
  }, [currentUser]);

  const handleAccept = async (tradeId) => {
    try {
      await apiRequest.put(`/api/trades/${tradeId}/accept`);
      alert('Trade accepted successfully!');
    } catch (error) {
      console.error('Error accepting trade:', error);
      alert('Failed to accept trade');
    }
  };

  const handleReject = async (tradeId) => {
    try {
      await apiRequest.put(`/api/trades/${tradeId}/reject`);
      alert('Trade rejected successfully!');
    } catch (error) {
      console.error('Error rejecting trade:', error);
      alert('Failed to reject trade');
    }
  };

  const nextWantedSlide = (tradeId, total) => {
    setWantedSlides((prev) => ({
      ...prev,
      [tradeId]: (prev[tradeId] + 1) % total,
    }));
  };

  const prevWantedSlide = (tradeId, total) => {
    setWantedSlides((prev) => ({
      ...prev,
      [tradeId]: (prev[tradeId] - 1 + total) % total,
    }));
  };

  return (
    <div className="CounterReceived">
      {items.length === 0 ? (
        <p className="empty-text">No Received SentRequest</p>
      ) : (
        items.map((item) => {
          const tradeId = item._id;
          const totalWanted = item.ItemWanted.length;
          const currentSlide = wantedSlides[tradeId] || 0;

          return (
            <div className="main" key={tradeId}>
              {/* <span>
                <b>Order ID:</b> {tradeId}
              </span> */}
              <div className="tradepage-container">
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
                    <Link
                      to={`/chat/${item.toUser._id}`}
                      state={{
                        prefillText: `Hi! I received your offer for "${item.ItemOffered.name}". Let's discuss!`,
                      }}
                    >
                      <h2>
                        <IoChatboxEllipsesOutline className="cus-i" />
                      </h2>
                    </Link>
                    <Link
                      to={`/history-detail/${item.counteredFrom._id}`}
                      className="offer-button"
                    >
                      <h4>Initial Trade</h4>
                    </Link>
                    <AiOutlineSwap />
                    <div
                      className="offer-button"
                      onClick={() => handleAccept(tradeId)}
                    >
                      <h4>Accept</h4>
                    </div>
                    <AiOutlineSwap />
                    <div
                      className="offer-button"
                      onClick={() => handleReject(tradeId)}
                    >
                      <h4>Reject</h4>
                    </div>
                  </div>
                </div>

                <div className="wanted-items-slider">
                  {totalWanted > 1 && (
                    <GrFormPrevious
                      onClick={() => prevWantedSlide(tradeId, totalWanted)}
                      className="slider-button prev-wanted"
                    />
                  )}
                  <div className="item-cards">
                    <div className="requested-item">
                      <div className="header">
                        <h1>Item Wanted</h1>
                      </div>
                      <div className="image">
                        <img
                          src={`http://localhost:5000${
                            item.ItemWanted[currentSlide]?.image || ''
                          }`}
                          alt="Item"
                        />
                      </div>
                      <div className="line-container">
                        <div className="line"></div>
                      </div>
                      <div className="title">
                        <h4>
                          {item.ItemWanted[currentSlide]?.name.length > 16
                            ? item.ItemWanted[currentSlide]?.name.slice(0, 16) +
                              '...'
                            : item.ItemWanted[currentSlide]?.name}
                        </h4>
                      </div>
                      <div className="pricerange">
                        <h3>{`${item.ItemWanted[currentSlide]?.price.min} Rs - ${item.ItemWanted[currentSlide]?.price.max} Rs`}</h3>
                      </div>
                      <Link
                        to={`/detail-page/${item.ItemWanted[currentSlide]?._id}`}
                        className="view"
                      >
                        <div className="button">View Details</div>
                      </Link>
                    </div>
                  </div>
                  {totalWanted > 1 && (
                    <MdOutlineNavigateNext
                      onClick={() => nextWantedSlide(tradeId, totalWanted)}
                      className="slider-button next-wanted"
                    />
                  )}
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
