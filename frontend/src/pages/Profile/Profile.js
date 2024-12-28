// import Sidebar from '../Sidebar/Sidebar';
// import UserProfile from '../UserProfile/UserProfile';
// import MyList from '../MyList/MyList';
// import './profile.css';
// import Wishlist from '../Wishlist/Wishlist';
// import TradeManage from '../TradeManage/TradeManage';

// const ProfilePage = () => {
//   return (
//     <div className="profilePage">
//       <div className="bar">
//         <Sidebar />
//       </div>
//       <div className="pages">
//         <UserProfile />
//         <MyList />
//         <Wishlist />
//         <TradeManage />
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;
import { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import UserProfile from '../UserProfile/UserProfile';
import MyList from '../MyList/MyList';
import Wishlist from '../Wishlist/Wishlist';
import TradeManage from '../TradeManage/TradeManage';
import './profile.css';
import OrderList from '../OrderList/OrderList';

const ProfilePage = () => {
  const [activePage, setActivePage] = useState('UserProfile'); // Default to UserProfile

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
