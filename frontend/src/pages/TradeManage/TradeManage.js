import React, { useState } from 'react';
import ReceivedRequests from './ReceivedRequests';
import SentRequests from './SentRequests';
import './TradeManage.css';

const TradeManage = () => {
  const [activePage, setActivePage] = useState('received');

  return (
    <div className="trade-manage">
      <div className="top">
        <div className="Rec">
          <h1
            className={activePage === 'received' ? 'active' : ''}
            onClick={() => setActivePage('received')}
          >
            Received Requests
          </h1>
        </div>

        <div className="button-Sent">
          <h1
            className={activePage === 'sent' ? 'active' : ''}
            onClick={() => setActivePage('sent')}
          >
            Sent Requests
          </h1>
        </div>
      </div>
      {activePage === 'received' && <ReceivedRequests />}
      {activePage === 'sent' && <SentRequests />}
    </div>
  );
};

export default TradeManage;
