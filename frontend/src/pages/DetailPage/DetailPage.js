import './DetailPage.css';
import { FaLocationDot } from 'react-icons/fa6';
import { FaRegHeart } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiRequest from '../../config/apiRequest';

const DetailPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const res = await apiRequest.get(`/api/items/${id}`);
        setItem(res.data.item);
        const ownerRes = await apiRequest.get(
          `/api/users/${res.data.item.owner}`
        );
        setOwner(ownerRes.data.user.name);
      } catch (error) {
        console.log('Error fetching item details:', error);
      }
    };

    fetchItemDetails();
  }, [id]);

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
            <h3>{item.owner.name}</h3>
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
          <div className="offer">Offer a Trade</div>
          <div className="det-wishlist">
            <FaRegHeart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
