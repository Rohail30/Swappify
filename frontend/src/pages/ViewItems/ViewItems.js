import './ViewItems.css';
import { MdDelete } from 'react-icons/md';
import { useEffect, useState } from 'react';
import apiRequest from '../../config/apiRequest';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

const ViewItems = () => {
  const { currentUser } = useContext(AuthContext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await apiRequest.get('/api/admin/items');
        setItems(res.data.items);
      } catch (error) {
        console.log(error);
      }
    };
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Do you really want to delete this item?'
    );

    if (confirmDelete) {
      try {
        await apiRequest.delete(`/api/admin/item/${id}`);
        setItems(items.filter((item) => item._id !== id));
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="view-items">
      {currentUser ? (
        <>
          <h1>Item List</h1>
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Owner</th>
                  <th>Condition</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Price (PKR)</th>
                  <th>Status</th>
                  <th>Date Added</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr>
                    <td>
                      <Link to={`/detail-page/${item._id}`}>{item.name}</Link>
                    </td>
                    <td>{item.owner.name}</td>
                    <td>{item.condition}</td>
                    <td>{item.category}</td>
                    <td>{item.location}</td>
                    <td>{`${item.price.min} - ${item.price.max}`}</td>
                    <td>{item.status}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div
                        className="ban"
                        onClick={() => handleDelete(item._id)}
                      >
                        <MdDelete className="ban-i" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ViewItems;
