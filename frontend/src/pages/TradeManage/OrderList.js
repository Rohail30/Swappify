import './OrderList.css';
import apiRequest from '../../config/apiRequest';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

const OrderList = () => {
  const [items, setItems] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await apiRequest.get(`/api/trades`);

        let filteredItems = res.data.trades;

        const currentUserId = currentUser._id;
        filteredItems = filteredItems.filter(
          (item) => String(item.fromUser._id) === String(currentUserId)
        );

        setItems(filteredItems || []);
      } catch (error) {
        console.error('Error fetching trades:', error);
      }
    };

    fetchItems();
  }, [currentUser]);

  return (
    <div className="order-list">
      <div className="orderpage-container">
        {items.length === 0 ? (
          <p className="empty-text">No items yet! Add one now.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Order-ID</th>
                <th>Status</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item._id}</td>
                  <td>{item.status}</td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(item.createdAt).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrderList;
