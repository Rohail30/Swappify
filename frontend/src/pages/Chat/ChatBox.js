// import React, { useEffect, useState, useRef, useContext } from 'react';
// import './Chat.css';
// import { useParams } from 'react-router-dom';
// import io from 'socket.io-client';
// import apiRequest from '../../config/apiRequest';
// import { AuthContext } from '../../context/AuthContext';

// const socket = io('http://localhost:5000');
// const ChatBox = () => {
//   const { currentUser } = useContext(AuthContext);
//   const sender = currentUser._id;
//   const { receiver } = useParams();
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState('');
//   const bottomRef = useRef(null);

//   useEffect(() => {
//     socket.emit('joinRoom', { sender, receiver });

//     const fetchMessages = async () => {
//       try {
//         const res = await apiRequest.get(`/api/chat/${receiver}`, {
//           withCredentials: true,
//         });
//         setMessages(res.data);
//       } catch (error) {
//         console.error('Failed to fetch chat messages:', error);
//       }
//     };

//     fetchMessages();

//     socket.on('receiveMessage', (message) => {
//       setMessages((prev) => [...prev, message]);
//     });

//     return () => {
//       socket.off('receiveMessage');
//     };
//   }, [sender, receiver]);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const sendMessage = () => {
//     if (text.trim()) {
//       socket.emit('sendMessage', { sender, receiver, text });
//       setText('');
//     }
//   };

//   //     return (
//   //         <div style={styles.container}>
//   //             <h2 style={styles.header}>Chat between {sender} and {receiver}</h2>
//   //             <div style={styles.chatBox}>
//   //                 {messages.map((msg, idx) => {
//   //                     const date = new Date(msg.date);
//   //                     const formatted = date.toLocaleString(undefined, {
//   //                         hour: '2-digit',
//   //                         minute: '2-digit',
//   //                         day: 'numeric',
//   //                         month: 'short',
//   //                         year: 'numeric',
//   //                     });

//   //                     return (
//   //                         <div
//   //                             key={idx}
//   //                             style={{
//   //                                 ...styles.message,
//   //                                 alignSelf: msg.from._id === sender ? "flex-end" : "flex-start",
//   //                                 backgroundColor: msg.from._id === sender ? "#DCF8C6" : "#FFF",
//   //                             }}
//   //                         >
//   //                             <div style={styles.name}>{msg.from.name || msg.from}</div>
//   //                             <div>{msg.text}</div>
//   //                             <div style={styles.timestamp}>{formatted}</div>
//   //                         </div>
//   //                     );
//   //                 })}
//   //                 <div ref={bottomRef} />
//   //             </div>

//   //             <div style={styles.inputBox}>
//   //                 <input
//   //                     style={styles.input}
//   //                     value={text}
//   //                     onChange={(e) => setText(e.target.value)}
//   //                     placeholder="Type your message..."
//   //                 />
//   //                 <button style={styles.button} onClick={sendMessage}>Send</button>
//   //             </div>
//   //         </div>
//   //     );
//   // };

//   return (
//     <div className="chat-container">
//       <h2 className="chat-header">
//         Chat between {sender} and {receiver}
//       </h2>

//       <div className="chat-box">
//         {messages.map((msg, idx) => {
//           const date = new Date(msg.date);
//           const formatted = date.toLocaleString(undefined, {
//             hour: '2-digit',
//             minute: '2-digit',
//             day: 'numeric',
//             month: 'short',
//             year: 'numeric',
//           });

//           const isSender = msg.from._id === sender;

//           return (
//             <div
//               key={idx}
//               className={`chat-message ${isSender ? 'sent' : 'received'}`}
//             >
//               <div className="chat-name">{msg.from.name || msg.from}</div>
//               <div>{msg.text}</div>
//               <div className="chat-timestamp">{formatted}</div>
//             </div>
//           );
//         })}
//         <div ref={bottomRef} />
//       </div>

//       <div className="chat-input-box">
//         <input
//           className="chat-input"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           placeholder="Type your message..."
//         />
//         <button className="chat-button" onClick={sendMessage}>
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatBox;

import React, { useEffect, useState, useRef, useContext } from 'react';
import './Chat.css';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import apiRequest from '../../config/apiRequest';
import { AuthContext } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

const socket = io('http://localhost:5000');

const ChatBox = () => {
  const location = useLocation();
  const prefillText = location.state?.prefillText || '';
  const { currentUser } = useContext(AuthContext);
  const sender = currentUser._id;
  const { receiver } = useParams();
  const [messages, setMessages] = useState([]);
  // eslint-disable-next-line no-use-before-define
  const [text, setText] = useState(prefillText);
  const bottomRef = useRef(null);

  useEffect(() => {
    socket.emit('joinRoom', { sender, receiver });

    const fetchMessages = async () => {
      try {
        const res = await apiRequest.get(`/api/chat/${receiver}`, {
          withCredentials: true,
        });

        setMessages(res.data);
      } catch (error) {
        console.error('Failed to fetch chat messages:', error);
      }
    };

    fetchMessages();

    socket.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [sender, receiver]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (text.trim()) {
      socket.emit('sendMessage', { sender, receiver, text });
      setText('');
    }
  };

  return (
    <div className="chat-container">
      {/* <h2 className="chat-header">
        Chat between {sender} and {receiver}
      </h2> */}

      <div className="chat-box">
        {messages.map((msg, idx) => {
          const date = new Date(msg.date);
          const formatted = date.toLocaleString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });

          const isSender = msg.from._id === sender;

          return (
            <div
              key={idx}
              className={`chat-message ${isSender ? 'sent' : 'received'}`}
            >
              <div className="chat-name">{msg.from.name || msg.from}</div>
              <div>{msg.text}</div>
              <div className="chat-timestamp">{formatted}</div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-box">
        <input
          className="chat-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="chat-button" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
