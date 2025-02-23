import './ViewUsers.css';
import { MdBlock } from 'react-icons/md';
import { useEffect, useState } from 'react';
import apiRequest from '../../config/apiRequest';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';

const ViewUsers = () => {
  const { currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [itemCount, setItemCount] = useState({});

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await apiRequest.get('/api/admin/users');
        const filteredUsers = res.data.users.filter((user) => !user.isBan);

        setUsers(filteredUsers);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchUserItems = async () => {
      try {
        const userItemCounts = {};

        for (const user of users) {
          const res = await apiRequest.get(`/api/items/user/${user._id}`);
          userItemCounts[user._id] = res.data.items.length;
        }

        setItemCount(userItemCounts);
      } catch (error) {
        console.log(error);
      }
    };

    if (users.length > 0) {
      fetchUserItems();
    }
  }, [users]);

  const handleBan = async (id) => {
    const confirmBan = window.confirm('Do you really want to Ban this User?');

    if (confirmBan) {
      try {
        await apiRequest.put(`/api/admin/ban/${id}`);
        setUsers(users.filter((user) => user._id !== id));
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="view-users">
      {currentUser ? (
        <>
          <h1>User List</h1>
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Total Items</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr>
                    <td>{user.name}</td>
                    <td>{user.mobile}</td>
                    <td>{user.email}</td>
                    <td>{itemCount[user._id] ?? 'Loading...'}</td>
                    <td>
                      <div className="ban" onClick={() => handleBan(user._id)}>
                        <MdBlock className="ban-i" />
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

export default ViewUsers;
