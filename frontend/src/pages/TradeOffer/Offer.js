import './Offer.css';
import { AuthContext } from '../../context/AuthContext';
import apiRequest from '../../config/apiRequest';
import { CiImageOn } from 'react-icons/ci';
import { GiConfirmed } from 'react-icons/gi';
import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { IoMdAdd } from 'react-icons/io';
import { useParams } from 'react-router-dom';

const Offer = () => {
  const { currentUser } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await apiRequest.get(`api/items/user/${currentUser._id}`);
        setItems(res.data.items);
      } catch (error) {
        console.log(error);
      }
    };
    fetchItems();
  }, [currentUser._id]);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const res = await apiRequest.get(`/api/items/${id}`);
        setItem(res.data.item);
      } catch (error) {
        console.log('Error fetching item details:', error);
      }
    };

    fetchItemDetails();
  }, [id]);

  const handleConfirmTrade = async () => {
    if (!selectedItem) {
      alert('Please select an item to offer!');
      return;
    }

    const tradeData = {
      fromUser: currentUser._id,
      toUser: item.owner,
      ItemOffered: selectedItem._id,
      ItemWanted: item._id,
    };

    try {
      const res = await apiRequest.post('/api/trades', tradeData);
      if (!res.data.error) {
        alert('Trade offered successfully!');
        setSelectedItem(null);
      } else {
        alert(res.data.message || 'Trade failed.');
      }
    } catch (error) {
      console.error('Error confirming trade:', error);
      alert('This item is already in process.', error);
    }
  };

  if (!item) {
    return <p>Loading item details...</p>;
  }

  return (
    <div className="offerpage">
      <div className="offerpage-container">
        <div className="offer-item">
          <div className="image">
            <img src={`http://localhost:5000${item.image}`} alt="Item" />
          </div>
          <div className="line-container">
            <div className="line"></div>
          </div>
          <div className="title">
            <h4>
              {item.name.length > 25
                ? item.name.slice(0, 25) + '...'
                : item.name}
            </h4>
            <h3>
              ${item.price.min} - ${item.price.max}
            </h3>
          </div>
          <div className="button">
            <div className="view">View Details</div>
          </div>
        </div>
        <div>
          <div className="offer-button" onClick={handleConfirmTrade}>
            <h4>Confirm Trade</h4>
            &nbsp;
            <GiConfirmed />
          </div>
          {/* <div className="trade-msg">Yes</div> */}
        </div>
        <div className="item">
          {selectedItem ? (
            <>
              <div className="image">
                <img
                  src={`http://localhost:5000${selectedItem.image}`}
                  alt={selectedItem.name}
                />
              </div>
              <div className="line-container">
                <div className="line"></div>
              </div>
              <div className="dsp-msg">
                <h4>
                  {selectedItem.name.length > 25
                    ? selectedItem.name.slice(0, 25) + '...'
                    : selectedItem.name}
                </h4>
                <h3>
                  ${selectedItem.price.min} - ${selectedItem.price.max}
                </h3>
              </div>
              <div
                className="remove-button"
                onClick={() => setSelectedItem(null)}
              >
                Remove Item
              </div>
            </>
          ) : (
            <>
              <div className="image">
                <CiImageOn className="cust-i" />
              </div>
              <div className="line-container">
                <div className="line"></div>
              </div>
              <div className="dsp-msg">
                <h2>Add product from your list to make an offer</h2>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="your-list">
        <div className="info">
          <h1>Your List</h1>
        </div>

        <div className="cards">
          <div className="card-container">
            {items.length === 0 ? (
              <p className="empty-text">No items yet! Add item first.</p>
            ) : (
              items.map((item) => (
                <div className="offer-card" key={item._id}>
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
                        <div className="view">Details</div>
                      </div>
                    </Link>
                    <div className="button2">
                      <Link>
                        <div
                          className="edit"
                          onClick={() => setSelectedItem(item)}
                        >
                          <IoMdAdd className="cust-i" />
                        </div>
                      </Link>
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

export default Offer;
