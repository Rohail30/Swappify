import './Offer.css';
import { AuthContext } from '../../context/AuthContext';
import apiRequest from '../../config/apiRequest';
import { CiImageOn } from 'react-icons/ci';
import { GiConfirmed } from 'react-icons/gi';
import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { IoMdAdd } from 'react-icons/io';

const Offer = () => {
  const { currentUser } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

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

  return (
    <div className="offerpage">
      <div className="offerpage-container">
        <div className="offer-item">
          <div className="image">
            <img src="/products.png" alt="" />
          </div>
          <div className="line-container">
            <div className="line"></div>
          </div>
          <div className="title">
            <h4>Title</h4>
          </div>
          <div className="button">
            <div className="view">View Details</div>
          </div>
        </div>
        <div className="offer-button">
          <h4>Confirm Trade</h4>
          &nbsp;
          <GiConfirmed />
        </div>
        {/* <div className="item">
          <div className="image">
            <CiImageOn className="cust-i" />
          </div>
          <div className="line-container">
            <div className="line"></div>
          </div>
          <div className="dsp-msg">
            <h2>Add product from your list to make an offer</h2>
          </div>
        </div> */}
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
