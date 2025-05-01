import './TradeHistoryDetail.css';
import { FaLocationDot } from 'react-icons/fa6';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiRequest from '../../config/apiRequest';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { AiOutlineSwap } from 'react-icons/ai';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { GrFormPrevious } from 'react-icons/gr';

const TradeHistoryDetail = () => {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [trade, setTrade] = useState(null);
  const [wantedSlide, setWantedSlide] = useState(0);

  useEffect(() => {
    if (currentUser && id) {
      const fetchTrade = async () => {
        try {
          const res = await apiRequest.get(`/api/trades/${id}`);
          const tradeData = res.data.trade ? res.data.trade : res.data;
          setTrade(tradeData);
        } catch (error) {
          console.error('Error fetching trade:', error);
        }
      };
      fetchTrade();
    }
  }, [currentUser, id]);

  if (!trade) {
    return <p>Loading trade details...</p>;
  }

  const totalWanted = trade.ItemWanted ? trade.ItemWanted.length : 0;

  const nextWantedSlide = () => {
    if (totalWanted > 0) {
      setWantedSlide((prev) => (prev + 1) % totalWanted);
    }
  };

  const prevWantedSlide = () => {
    if (totalWanted > 0) {
      setWantedSlide((prev) => (prev - 1 + totalWanted) % totalWanted);
    }
  };

  return (
    <div className="historyDetailPage">
      <span>
        <h4 style={{ fontWeight: '600', marginBottom: '10px' }}>
          Trade History Details{' '}
        </h4>
        <div className="want-items">
          This trade is requested by:{' '}
          <Link to={`/user/${trade.ItemOffered.owner._id}`}>
            {trade.fromUser.name}
          </Link>
        </div>
        <div className="want-items">Total Wanted Items: {totalWanted}</div>
      </span>
      <div className="h-container">
        <div className="h-OfferedItem">
          <div className="other">
            <h4>Item Offered</h4>
            <div className="img-container">
              <img
                src={`http://localhost:5000${trade.ItemOffered?.image || ''}`}
                alt="Item"
              />
            </div>
            <div className="titles">
              <div className="left">
                <div className="detail">
                  <h1>{trade.ItemOffered?.name}</h1>
                  <h2>{`Est. Value in Pkr: ${trade.ItemOffered?.price?.min} - ${trade.ItemOffered?.price?.max}`}</h2>
                </div>
                <div className="icon">
                  <FaLocationDot size={14} />
                  <h3>{trade.ItemOffered?.location}</h3>
                </div>
              </div>
              <div className="right">
                <Link to={`/user/${trade.ItemOffered?.owner?._id}`}>
                  <h2>{trade.fromUser.name.split(' ')[0]}</h2>
                </Link>
                <h3>
                  {new Date(trade.ItemOffered?.createdAt).toLocaleDateString()}
                </h3>
              </div>
            </div>
            <div className="details">
              <div className="r1">
                <h3>Condition</h3>
                <h3>Category</h3>
                <h3>Status</h3>
              </div>
              <div className="r2">
                <h3>{trade.ItemOffered?.condition}</h3>
                <h3>{trade.ItemOffered?.category}</h3>
                <h3>{trade.ItemOffered?.status}</h3>
              </div>
            </div>
            <div className="description">
              <h2>Description</h2>
              <p>{trade.ItemOffered?.description}</p>
            </div>
          </div>
        </div>
        <div className="mid">
          <AiOutlineSwap style={{ fontSize: '45px' }} />
        </div>

        <div className="h-OfferedItem">
          <div className="other">
            <div className="wanted-is">
              {totalWanted > 1 && (
                <GrFormPrevious
                  onClick={prevWantedSlide}
                  className="h-slider-button h-prev-wanted"
                />
              )}
              Item Wanted
              {totalWanted > 1 && (
                <MdOutlineNavigateNext
                  onClick={nextWantedSlide}
                  className="h-slider-button h-next-wanted"
                />
              )}
            </div>

            <div className="img-container">
              {totalWanted > 0 && (
                <img
                  src={`http://localhost:5000${
                    trade.ItemWanted[wantedSlide]?.image || ''
                  }`}
                  alt="Item"
                />
              )}
            </div>
            <div className="titles">
              <div className="left">
                <div className="detail1">
                  {totalWanted > 0 && (
                    <h1>{trade.ItemWanted[wantedSlide]?.name}</h1>
                  )}
                  {totalWanted > 0 && (
                    <h2>{`Est. Value in Pkr: ${trade.ItemWanted[wantedSlide]?.price?.min} - ${trade.ItemWanted[wantedSlide]?.price?.max}`}</h2>
                  )}
                </div>
                <div className="icon">
                  <FaLocationDot size={14} />
                  {totalWanted > 0 && (
                    <h3>{trade.ItemWanted[wantedSlide]?.location}</h3>
                  )}
                </div>
              </div>
              <div className="right">
                {totalWanted > 0 && (
                  <Link
                    to={`/user/${trade.ItemWanted[wantedSlide]?.owner?._id}`}
                  >
                    <h2>{trade.toUser.name.split(' ')[0]}</h2>
                  </Link>
                )}
                {totalWanted > 0 && (
                  <h3>
                    {new Date(
                      trade.ItemWanted[wantedSlide]?.createdAt
                    ).toLocaleDateString()}
                  </h3>
                )}
              </div>
            </div>
            <div className="details">
              <div className="r1">
                <h3>Condition</h3>
                <h3>Category</h3>
                <h3>Status</h3>
              </div>
              <div className="r2">
                {totalWanted > 0 && (
                  <h3>{trade.ItemWanted[wantedSlide]?.condition}</h3>
                )}
                {totalWanted > 0 && (
                  <h3>{trade.ItemWanted[wantedSlide]?.category}</h3>
                )}
                {totalWanted > 0 && (
                  <h3>{trade.ItemWanted[wantedSlide]?.status}</h3>
                )}
              </div>
            </div>
            <div className="description">
              <h2>Description</h2>
              {totalWanted > 0 && (
                <p>{trade.ItemWanted[wantedSlide]?.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeHistoryDetail;
