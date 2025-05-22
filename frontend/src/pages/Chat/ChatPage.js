// ChatPage.jsx
import { Routes, Route } from 'react-router-dom';
import ChatSidebarPage from './ChatSidebarPage';
import ChatBox from './ChatBox';
import './Chat.css';

const ChatPage = () => {
  return (
    <div className="chat-page">
      <h2 className="chat-header">Messages</h2>
      <div className="chat-s-b">
        <ChatSidebarPage />

        <Routes>
          <Route path=":receiver" element={<ChatBox />} />
          <Route
            index
            element={
              <div className="chat-placeholder">
                <h2>Select a user to start chatting</h2>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default ChatPage;
