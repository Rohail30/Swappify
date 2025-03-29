import './CounterSent.css';
import apiRequest from '../../config/apiRequest';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { GiCancel } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { GrFormPrevious } from 'react-icons/gr';

const CounterSent = () => {
  const [items, setItems] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [wantedSlide, setWantedSlide] = useState(0);

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

                {/* Item Wanted Slider */}
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

export default CounterSent;
