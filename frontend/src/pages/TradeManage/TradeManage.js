import React, { useState } from 'react';
import ReceivedRequests from './ReceivedRequests';
import SentRequests from './SentRequests';
import './TradeManage.css';

const TradeManage = () => {
  const [activePage, setActivePage] = useState('received');

  return (
    <div className="trade-manage">
      <h1>Trade Management</h1>
      <div className="top">
        <div className="head">
          <h1
            className={activePage === 'received' ? 'active' : ''}
            onClick={() => setActivePage('received')}
          >
            Received
          </h1>
        </div>

        <div className="head">
          <h1
            className={activePage === 'sent' ? 'active' : ''}
            onClick={() => setActivePage('sent')}
          >
            Sent
          </h1>
        </div>
      </div>
      {activePage === 'received' && <ReceivedRequests />}
      {activePage === 'sent' && <SentRequests />}
    </div>
  );
};

export default TradeManage;
