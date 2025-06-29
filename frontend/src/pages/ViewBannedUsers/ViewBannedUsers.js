import './ViewBannedUsers.css';
import { CgLockUnlock } from 'react-icons/cg';
import { useEffect, useState } from 'react';
import apiRequest from '../../config/apiRequest';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

const ViewBannedUsers = () => {
  const { currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [itemCount, setItemCount] = useState({});

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await apiRequest.get('/api/admin/users');
        const filteredUsers = res.data.users.filter((user) => user.isBan);

        setUsers(filteredUsers);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserDetails();
  });

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
    const confirmDelete = window.confirm('Do you want to unban this user?');

    if (confirmDelete) {
      try {
        await apiRequest.put(`/api/admin/unban/${id}`);
        setUsers(users.filter((user) => user._id !== id));
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="view-banned-users">
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
                  <tr key={user._id}>
                    <td>
                      <Link to={`/user/${user._id}`}>{user.name}</Link>
                    </td>
                    <td>{user.mobile}</td>
                    <td>{user.email}</td>
                    <td>{itemCount[user._id] ?? 'Loading...'}</td>
                    <td>
                      <div className="ban" onClick={() => handleBan(user._id)}>
                        <CgLockUnlock className="ban-i" />
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

export default ViewBannedUsers;
