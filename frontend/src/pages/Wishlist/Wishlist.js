import './Wishlist.css';
import { MdDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';
import apiRequest from '../../config/apiRequest';
import { useEffect, useState } from 'react';

const Wishlist = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await apiRequest.get(`/api/wishlist`);
        const itemIds = res.data.wishlist.items.map((item) => item.itemId);

        const itemDetails = await Promise.all(
          itemIds.map(async (itemId) => {
            const itemData = await apiRequest.get(`/api/items/${itemId}`);
            return itemData.data.item;
          })
        );

        setItems(itemDetails);
      } catch (error) {
        console.log('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  const handleRemoveFromWishlist = async (id) => {
    const confirmDelete = window.confirm(
      'Do you really want to delete this item from your wishlist?'
    );
    if (confirmDelete) {
      try {
        await apiRequest.delete(`/api/wishlist/${id}`);
        setItems(items.filter((item) => item._id !== id));
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="wishlist">
      <div className="heading">
        <h1>Wishlist</h1>
      </div>
      <div className="card-container">
        {items.length === 0 ? (
          <p className="empty-text">Your Wishlist is Empty!</p>
        ) : (
          items.map((item) => (
            <div className="wishlistcard" key={item._id}>
              <div className="image-container">
                <div className="image">
                  <img src={`http://localhost:5000${item.image}`} alt="Item" />
                </div>
              </div>
              <div className="line-container">
                <div className="line"></div>
              </div>
              <div className="details">
                <div className="title">
                  <h1>
                    {item.name.length > 16
                      ? item.name.slice(0, 14) + '...'
                      : item.name}
                  </h1>
                </div>
                <div className="status">
                  <h2>{item.status}</h2>
                </div>
                <div className="price">
                  <h2>{`Est. Value: ${item.price.min} - ${item.price.max}`}</h2>
                </div>
              </div>
              <div className="buttons">
                <div className="button1">
                  <Link to={`/detail-page/${item._id}`}>
                    <div className="view">View details</div>
                  </Link>
                </div>
                <div className="button2">
                  <div
                    className="delete"
                    onClick={() => handleRemoveFromWishlist(item._id)}
                  >
                    <MdDelete className="custom-icon" />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Wishlist;
