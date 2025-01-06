import './DetailPage.css';
import { FaLocationDot } from 'react-icons/fa6';
import { FaRegHeart } from 'react-icons/fa';
import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import apiRequest from '../../config/apiRequest';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const DetailPage = () => {
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams();
  const [item, setItem] = useState(null);

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

  const addToWishlist = async (itemId) => {
    try {
      await apiRequest.post('/api/wishlist', { itemId });
      alert('Item added to wishlist!');
    } catch (error) {
      alert('Item already in wishlist!');
    }
  };

  if (!item) {
    return <p>Loading item details...</p>;
  }

  return (
    <div className="detailPage">
      <div className="img-container">
        <img src={`http://localhost:5000${item.image}`} alt="Item" />
      </div>
      <div className="other">
        <div className="titles">
          <div className="left">
            <div className="detail1">
              <h1>{item.name}</h1>
              <h2>{`Est. Value: ${item.price.min} - ${item.price.max}`}</h2>
            </div>
            <div className="icon">
              <FaLocationDot size={14} />
              <h3>{item.location}</h3>
            </div>
          </div>
          <div className="right">
            <Link to={`/user/${item.owner._id}`}>
              <h2>{item.owner.name}</h2>
            </Link>
            <h3>{new Date(item.createdAt).toLocaleDateString()}</h3>
          </div>
        </div>
        <div className="details">
          <div className="r1">
            <h3>Condition</h3>
            <h3>Category</h3>
            <h3>Status</h3>
          </div>
          <div className="r2">
            <h3>{item.condition}</h3>
            <h3>{item.category}</h3>
            <h3>{item.status}</h3>
          </div>
        </div>
        <div className="description">
          <h2>Description</h2>
          <p>{item.description}</p>
        </div>
        <div className="buttons">
          {currentUser && item.owner._id !== currentUser._id && item.status !== 'traded' && (
            <>
              <div className="offer">
                <Link to={`/trade-offer/${item._id}`}>Offer a Trade</Link>
              </div>
              <div className="det-wishlist" onClick={() => addToWishlist(item._id)}>
                <FaRegHeart />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
