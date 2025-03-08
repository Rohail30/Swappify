import DoughnutChart from '../../admin/DoughnutChart/DoughnutChart';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { FaUser } from 'react-icons/fa';
import { FaClipboardList } from 'react-icons/fa6';
import { ImBlocked } from 'react-icons/im';
import BarChart from '../../admin/BarChart/BarChart';
import { useEffect, useState } from 'react';
import apiRequest from '../../config/apiRequest';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
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
    const fetchItems = async () => {
      try {
        const res = await apiRequest.get('/api/items/');
        setItems(res.data.items);
      } catch (error) {
        console.log(error);
      }
    };
    fetchItems();
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

  return (
    <div className="dashboard">
      {currentUser ? (
        <>
          <div className="layer1">
            <div className="l1-box">
              <div className="title">Recent Users</div>
              <div className="table">
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Total Items</th>
                      <th>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                      )
                      .slice(0, 3)
                      .map((user) => (
                        <tr>
                          <td>{user.name}</td>
                          <td>{itemCount[user._id] ?? 'Loading...'}</td>
                          <td>n/a</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="l1-box">
              <div className="title">Recent Items Added</div>
              <div className="table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Owner</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items
                      .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                      )
                      .slice(0, 3)
                      .map((item) => (
                        <tr>
                          <td>{item.name}</td>
                          <td>{item.owner.name}</td>
                          <td>{item.status}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="l1-box">
              <div className="title">Users Vs Items</div>
              <div className="chart">
                <DoughnutChart />
              </div>
            </div>
          </div>
          <div className="layer2">
            <div className="l2-box1">
              <div className="l2b1-lay1">
                <div className="boo">
                  <div className="icon">
                    <Link to="/admin/users">
                      <FaUser className="custom" />
                    </Link>
                  </div>
                </div>
                <div className="boo">
                  <div className="icon">
                    <Link to="/admin/items">
                      <FaClipboardList className="custom" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="l2b1-lay2">
                <Link to="/admin/banned">
                  <div className="ban">
                    <div className="icon-b">
                      <ImBlocked className="custom-b" />
                    </div>
                    <div className="text">
                      <p>Banned Users</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <div className="l2-box2">
              <div className="title">Number of Items per Location</div>
              <div className="bar-chart">
                <BarChart />
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Dashboard;
