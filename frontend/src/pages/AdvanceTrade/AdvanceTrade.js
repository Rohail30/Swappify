import React, { useState } from 'react';
import './AdvanceTrade.css';
import CounterReceived from './CounterReceived';
import CounterSent from './CouterSent';

const AdvanceTrade = () => {
  const [activePage, setActivePage] = useState('received');

  return (
    <div className="advance-manage">
      <h1>Advance Trade</h1>
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
      {activePage === 'received' && <CounterReceived />}
      {activePage === 'sent' && <CounterSent />}
    </div>
  );
};

export default AdvanceTrade;
