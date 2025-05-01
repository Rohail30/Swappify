import './CounterOffer.css';
import apiRequest from '../../config/apiRequest';
import { CiImageOn } from 'react-icons/ci';
import { GiConfirmed } from 'react-icons/gi';
import { useEffect, useState, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const CounterOffer = () => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [trade, setTrade] = useState(null);
  const [tradeMessage, setTradeMessage] = useState('');
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const evaluateTrade = (itemsOffered, itemWanted) => {
    if (!itemsOffered.length || !itemWanted) return '';

    const totalMinPrice = itemsOffered.reduce(
      (sum, item) => sum + item.price.min,
      0
    );
    const minPriceDifference = Math.abs(totalMinPrice - itemWanted.price.min);

    return minPriceDifference > 7000
      ? 'Not a good trade. The price difference is significant.'
      : 'Good trade! The price difference is acceptable.';
  };

  useEffect(() => {
    const fetchTrade = async () => {
      try {
        const res = await apiRequest.get(`/api/trades/${id}`);
        setTrade(res.data.trade);
      } catch (error) {
        console.error('Error fetching trade:', error);
      }
    };
    fetchTrade();
  }, [id]);

  useEffect(() => {
    if (!trade || !trade.fromUser) return;

    const fetchItems = async () => {
      try {
        const res = await apiRequest.get(
          `/api/items/user/${trade.fromUser._id}`
        );
        const filteredItems = res.data.items.filter(
          (item) => item.status === 'available'
        );
        setItems(filteredItems);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, [trade]);

  useEffect(() => {
    if (selectedItems.length > 0 && trade?.ItemOffered) {
      setTradeMessage(evaluateTrade(selectedItems, trade.ItemOffered));
    } else {
      setTradeMessage('');
    }
  }, [selectedItems, trade]);

  const handleSelectItem = (item) => {
    setSelectedItems((prev) =>
      prev.some((selected) => selected._id === item._id)
        ? prev.filter((selected) => selected._id !== item._id)
        : [...prev, item]
    );
  };

  const handleConfirmTrade = async () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one item to offer!');
      return;
    }

    const tradeData = {
      fromUser: currentUser._id,
      toUser: trade.fromUser._id,
      ItemOffered: trade.ItemWanted[0],
      ItemWanted: selectedItems.map((item) => item._id),
      isCounterTrade: true,
    };

    try {
      const res = await apiRequest.post(`/api/trades/${id}/counter`, tradeData);
      if (!res.data.error) {
        alert('Trade offered successfully!');
        setSelectedItems([]);
        setTradeMessage('');
        navigate('/');
      } else {
        alert(res.data.message || 'Trade failed.');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'An error occurred.');
    }
  };

  if (!trade || !trade.ItemOffered) {
    return <p>Loading trade details...</p>;
  }

  return (
    <div className="counter-offer-page">
      <div className="offerpage-container">
        <div className="offer-item">
          <div className="image">
            <img
              src={`http://localhost:5000${trade.ItemWanted[0].image}`}
              alt="Item"
            />
          </div>
          <div className="line-container">
            <div className="line"></div>
          </div>
          <div className="title">
            <h4>
              {trade.ItemWanted[0].name.length > 25
                ? trade.ItemWanted[0].name.slice(0, 25) + '...'
                : trade.ItemWanted[0].name}
            </h4>
            <h3>
              {trade.ItemWanted[0].price.min} Rs -{' '}
              {trade.ItemWanted[0].price.max} Rs
            </h3>
          </div>
          <div className="button">
            <Link
              to={`/detail-page/${trade.ItemWanted[0]._id}`}
              className="view"
            >
              View Details
            </Link>
          </div>
        </div>

        <div className="mid">
          <div className="offer-button" onClick={handleConfirmTrade}>
            <h4>Counter Trade</h4>
            <GiConfirmed />
          </div>
          <div className="trade-msg">{tradeMessage}</div>
        </div>

        <div className="item">
          {selectedItems.length > 0 ? (
            selectedItems.map((selected) => (
              <div key={selected._id} className="selected-item">
                <div className="image">
                  <img
                    src={`http://localhost:5000${selected.image}`}
                    alt={selected.name}
                  />
                </div>
                <div className="line-container">
                  <div className="line"></div>
                </div>
                <div className="dsp-msg">
                  <h4>
                    {selected.name.length > 12
                      ? selected.name.slice(0, 12) + '...'
                      : selected.name}
                  </h4>
                  <h3>
                    {selected.price.min} Rs - {selected.price.max} Rs
                  </h3>
                </div>
                <div
                  className="remove-button"
                  onClick={() => handleSelectItem(selected)}
                >
                  Remove
                </div>
              </div>
            ))
          ) : (
            <div className="dsp-item">
              <div className="dsp-image">
                <CiImageOn className="cust-i" />
              </div>
              <div className="line-container">
                <div className="line"></div>
              </div>
              <div className="dsp-msg">
                <h2>
                  Add one or more products from the user list to make a counter
                  offer
                </h2>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="your-list">
        <div className="info">
          <h1>User List</h1>
        </div>
        <div className="cards">
          <div className="card-container">
            {items.length === 0 ? (
              <p>No items available.</p>
            ) : (
              items.map((item) => (
                <div className="offer-card">
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
                    <h4>{`Est. Value Pkr: ${item.price.min} - ${item.price.max}`}</h4>
                  </div>

                  <div className="buttons">
                    <Link to={`/detail-page/${item._id}`}>
                      <div className="button1">
                        <div className="view">Details</div>
                      </div>
                    </Link>
                    <div className="button2">
                      <div
                        className="edit"
                        onClick={() => handleSelectItem(item)}
                      >
                        {selectedItems.some(
                          (selected) => selected._id === item._id
                        )
                          ? 'Deselect'
                          : 'Select'}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterOffer;
