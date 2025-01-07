import React, { useState } from 'react';
import ReceivedRequests from './ReceivedRequests';
import SentRequests from './SentRequests';
import './TradeManage.css';
import OrderList from './OrderList';

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

        <div className="head">
          <h1
            className={activePage === 'order-list' ? 'active' : ''}
            onClick={() => setActivePage('order-list')}
          >
            Order-List
          </h1>
        </div>
      </div>
      {activePage === 'received' && <ReceivedRequests />}
      {activePage === 'sent' && <SentRequests />}
      {activePage === 'order-list' && <OrderList />}
    </div>
  );
};

export default TradeManage;
