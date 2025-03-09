import './Sidebar.css';
import { CgProfile } from 'react-icons/cg';
import { FaRegHeart } from 'react-icons/fa';
import { FaList } from 'react-icons/fa';
import { FaExchangeAlt } from 'react-icons/fa';
import { FaInfinity } from 'react-icons/fa6';

const Sidebar = ({ setActivePage }) => {
  return (
    <div className="Sidebar">
      <div className="user-prof">
        <h1 onClick={() => setActivePage('UserProfile')}>
          <CgProfile />
          &nbsp; User Profile
        </h1>
        <h1 onClick={() => setActivePage('MyList')}>
          <FaList />
          &nbsp; MyList
        </h1>
        <h1 onClick={() => setActivePage('Wishlist')}>
          <FaRegHeart />
          &nbsp; WishList
        </h1>
        <h1 onClick={() => setActivePage('TradeManage')}>
          <FaExchangeAlt />
          &nbsp; Trade
        </h1>
        <h1 onClick={() => setActivePage('AdvanceTrade')}>
          <FaInfinity />
          &nbsp; Advance Trade
        </h1>
      </div>
    </div>
  );
};

export default Sidebar;
