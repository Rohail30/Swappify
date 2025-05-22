// import React, { useEffect, useState, useContext } from 'react';
// import { Link } from 'react-router-dom';
// import { useNavigate, useParams } from 'react-router-dom';
// import './ChatSidebar.css';
// import apiRequest from '../../config/apiRequest';
// import { AuthContext } from '../../context/AuthContext';

// const ChatSidebarPage = () => {
//   // eslint-disable-next-line
//   const { currentUser } = useContext(AuthContext);
//   const [users, setUsers] = useState([]);
//   const navigate = useNavigate();
//   const { receiver } = useParams();

//   useEffect(() => {
//     const fetchChatUsers = async () => {
//       try {
//         const res = await apiRequest.get('/chat/users', {
//           withCredentials: true,
//         });

//         console.log('Fetched chat users:', res.data);
//         setUsers(res.data);
//       } catch (error) {
//         console.error('Failed to fetch chat users:', error);
//       }
//     };

//     fetchChatUsers();
//   }, []);

//   const goToChat = (receiverId) => {
//     navigate(`/chat/${receiverId}`);
//   };

//   return (
//     <div className="chat-sidebar-container">
//       <h2 className="sidebar-title">Chat Users</h2>
//       <ul className="user-list">
//         {users.map((user) => (
//           <Link to={`/chat/${user._id}`}>
//             <li
//               key={user._id}
//               className={`user-item ${receiver === user._id ? 'selected' : ''}`}
//               onClick={() => goToChat(user._id)}
//             >
//               <img
//                 src="/user-avatar.png"
//                 alt="user avatar"
//                 className="user-avatar"
//               />
//               <div>
//                 <strong>{user.name}</strong>
//                 <div className="user-email">{user.email}</div>
//               </div>
//             </li>
//           </Link>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ChatSidebarPage;
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ChatSidebar.css';
import apiRequest from '../../config/apiRequest';
import { AuthContext } from '../../context/AuthContext';

const ChatSidebarPage = () => {
  // eslint-disable-next-line
  const { currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { receiver } = useParams(); // current selected user

  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        const res = await apiRequest.get('/chat/users', {
          withCredentials: true,
        });
        setUsers(res.data);
      } catch (error) {
        console.error('Failed to fetch chat users:', error);
      }
    };

    fetchChatUsers();
  }, []);

  const goToChat = (receiverId) => {
    navigate(`/chat/${receiverId}`);
  };

  return (
    <div className="chat-sidebar-container">
      <h2 className="sidebar-title">Chat Users</h2>
      <ul className="user-list">
        {users.map((user) => (
          <li
            key={user._id}
            className={`user-item ${receiver === user._id ? 'selected' : ''}`}
            onClick={() => goToChat(user._id)}
          >
            <img
              src="/user-avatar.png"
              alt="user avatar"
              className="user-avatar"
            />
            <div>
              <strong>{user.name}</strong>
              <div className="user-email">{user.email}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatSidebarPage;
