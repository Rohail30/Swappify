import './TradeHistory.css';
import { useContext, useEffect, useState } from 'react';
import apiRequest from '../../config/apiRequest';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa6';
import { IoIosStar } from 'react-icons/io';

const TradeHistory = () => {
  const [trades, setTrades] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await apiRequest.get(`/api/trades`);

        let filteredItems = res.data.trades;

        const currentUserId = currentUser._id;
        filteredItems = filteredItems.filter(
          (item) =>
            (String(item.toUser._id) === String(currentUserId) ||
              String(item.fromUser._id) === String(currentUserId)) &&
            (item.status === 'cancelled' ||
              item.status === 'accepted' ||
              item.status === 'rejected')
        );

        setTrades(filteredItems || []);
      } catch (error) {
        console.error('Error fetching trades:', error);
      }
    };

    fetchItems();
  }, [currentUser]);

  return (
    <div className="trade-history">
      <h1>TradeHistory</h1>
      <div className="container">
        {trades.length === 0 ? (
          <p className="empty-text">No Sent request</p>
        ) : (
          trades.map((trade) => (
            <div className="item-container" key={trade._id}>
              <span>
                <b>Order ID:</b> {trade._id}
              </span>
              <div className="item">
                <div className="left">
                  <div className="image">
                    <img
                      src={`http://localhost:5000${trade.ItemOffered.image}`}
                      alt="Item"
                    />
                  </div>
                  <div className="details">
                    <div className="head">
                      {/* <h2>
                        Item Offered By: <b>Rohail</b>
                      </h2> */}
                      <h3>{trade.ItemOffered.name}</h3>
                      <div className="owner">
                        <FaUser style={{ fontSize: '13px' }} />
                        <Link to={`/user/${trade.ItemOffered.owner._id}`}>
                          {trade.fromUser.name}
                        </Link>
                      </div>
                      <div className="rating">
                        <IoIosStar style={{ color: 'gold' }} />
                        <IoIosStar style={{ color: 'gold' }} />
                        <IoIosStar style={{ color: 'gold' }} />
                        <IoIosStar style={{ color: 'gold' }} />
                        <IoIosStar style={{ color: 'gold' }} />
                      </div>
                    </div>
                    <div className="tail">
                      <h4>
                        Request Type:{' '}
                        <b>
                          {currentUser._id === trade.fromUser._id
                            ? 'Sent'
                            : 'Received'}
                        </b>
                      </h4>

                      <h4>
                        Trade type:{' '}
                        <b>{trade.isCounterTrade ? 'Counter' : 'Normal'}</b>
                      </h4>

                      <h4>
                        Status: <b>{trade.status}</b>
                      </h4>
                      <h4>
                        Price Range:&nbsp;
                        <b>{`${trade.ItemOffered.price.min} Rs - ${trade.ItemOffered.price.max} Rs`}</b>
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="right">
                  <div className="date">
                    <p>{new Date(trade.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="buttons">
                    <Link to={`/detail-page/${trade.ItemOffered._id}`}>
                      <div className="button1">Item details</div>
                    </Link>
                    <Link to={`/history-detail/${trade._id}`}>
                      <div className="button2">Trade details</div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TradeHistory;
