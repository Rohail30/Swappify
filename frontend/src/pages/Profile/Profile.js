import { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import UserProfile from '../UserProfile/UserProfile';
import MyList from '../MyList/MyList';
import Wishlist from '../Wishlist/Wishlist';
import TradeManage from '../TradeManage/TradeManage';
import './profile.css';
import OrderList from '../TradeManage/OrderList';

const ProfilePage = () => {
  const [activePage, setActivePage] = useState('UserProfile');

  return (
    <div className="profilePage">
      <div className="bar">
        <Sidebar setActivePage={setActivePage} />
      </div>
      <div className="pages">
        {activePage === 'UserProfile' && <UserProfile />}
        {activePage === 'MyList' && <MyList />}
        {activePage === 'Wishlist' && <Wishlist />}
        {activePage === 'TradeManage' && <TradeManage />}
        {activePage === 'OrderList' && <OrderList />}
      </div>
    </div>
  );
};

export default ProfilePage;
