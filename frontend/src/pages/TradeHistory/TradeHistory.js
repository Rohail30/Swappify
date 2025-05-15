import './TradeHistory.css';
import { useContext, useEffect, useState } from 'react';
import apiRequest from '../../config/apiRequest';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa6';
import { IoIosStar } from 'react-icons/io';

import { FaArrowDownLong } from 'react-icons/fa6';

const TradeHistory = () => {
  const [trades, setTrades] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [ratings, setRatings] = useState({});

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

        filteredItems.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        filteredItems.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        const sortedTrades = [];

        for (let i = 0; i < filteredItems.length; i++) {
          const trade = filteredItems[i];
          if (!trade.isCounterTrade) {
            sortedTrades.push(trade);

            for (let j = 0; j < filteredItems.length; j++) {
              const counter = filteredItems[j];
              if (
                counter.isCounterTrade &&
                counter.counteredFrom &&
                counter.counteredFrom._id === trade._id
              ) {
                sortedTrades.push(counter);
              }
            }
          }
        }

        setTrades(sortedTrades || []);

        const ratingMap = {};

        await Promise.all(
          sortedTrades.map(async (trade) => {
            try {
              const response = await apiRequest.get(
                `/api/rating/trade/${trade._id}`
              );
              ratingMap[trade._id] = response.data.ratingReview.rating;
            } catch (err) {
              ratingMap[trade._id] = 0;
            }
          })
        );

        setRatings(ratingMap);
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
          (() => {
            const rendered = [];
            const seen = new Set();

            for (let i = 0; i < trades.length; i++) {
              const trade = trades[i];
              if (!seen.has(trade._id)) {
                const group = [trade];
                seen.add(trade._id);

                // Find counters
                for (let j = 0; j < trades.length; j++) {
                  const counter = trades[j];
                  if (
                    counter.isCounterTrade &&
                    counter.counteredFrom &&
                    counter.counteredFrom._id === trade._id
                  ) {
                    group.push(counter);
                    seen.add(counter._id);
                  }
                }

                rendered.push(
                  <div className="trade-group" key={trade._id}>
                    {group.map((item, index) => (
                      <div className="item-container" key={item._id}>
                        {index === 1 && (
                          <div className="counter-label">
                            <FaArrowDownLong className="c-i" />
                            {/* <div className="v-line"></div> */}
                          </div>
                        )}

                        <div className="item">
                          <div className="left">
                            <div className="image">
                              <img
                                src={`http://localhost:5000${item.ItemOffered.image}`}
                                alt="Item"
                              />
                            </div>
                            <div className="details">
                              <div className="head">
                                <h3>
                                  {item.ItemOffered.name.length > 16
                                    ? item.ItemOffered.name.slice(0, 16) + '...'
                                    : item.ItemOffered.name}
                                </h3>
                                <div className="owner">
                                  <FaUser style={{ fontSize: '13px' }} />
                                  <Link to={`/user/${item.fromUser._id}`}>
                                    {item.fromUser.name}
                                  </Link>
                                </div>
                                <div className="rating">
                                  {[1, 2, 3, 4, 5].map((i) => (
                                    <IoIosStar
                                      key={i}
                                      style={{
                                        color:
                                          i <= (ratings[item._id] || 0)
                                            ? 'gold'
                                            : '#ccc',
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="tail">
                                <h4>
                                  Request Type:{' '}
                                  <b>
                                    {currentUser._id === item.fromUser._id
                                      ? 'Sent'
                                      : 'Received'}
                                  </b>
                                </h4>
                                <h4>
                                  Trade type:{' '}
                                  <b>
                                    {item.isCounterTrade ? 'Counter' : 'Normal'}
                                  </b>
                                </h4>

                                <h4>
                                  Status: <b>{item.status}</b>
                                </h4>
                                <h4>
                                  Price Range:&nbsp;
                                  <b>{`${item.ItemOffered.price.min} Rs - ${item.ItemOffered.price.max} Rs`}</b>
                                </h4>
                              </div>
                            </div>
                          </div>
                          <div className="right">
                            <div className="date">
                              <p>
                                {new Date(item.createdAt).toLocaleDateString()}
                              </p>
                              <p>
                                {new Date(item.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="buttons">
                              <Link to={`/detail-page/${item.ItemOffered._id}`}>
                                <div className="button1">Item details</div>
                              </Link>
                              <Link to={`/history-detail/${item._id}`}>
                                <div className="button2">Trade details</div>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }
            }

            return rendered;
          })()
        )}
      </div>
    </div>
  );
};

export default TradeHistory;
