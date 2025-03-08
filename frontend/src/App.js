import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import UpdateProfile from './pages/UpdateProfile/UpdateProfile';
import Profile from './pages/Profile/Profile';
import AddItem from './pages/AddItem/AddItem';
import EditItem from './pages/EditItem/EditItem';
import DetailPage from './pages/DetailPage/DetailPage';
import ItemList from './pages/ItemList/ItemList';
import WishList from './pages/Wishlist/Wishlist';
import ForgetPassword from './pages/ForgetPassword/ForgetPass';
import Home from './pages/Home/Home';
import PublicProfile from './pages/PublicProfile/PublicProfile';
import Offer from './pages/TradeOffer/Offer';
import TradeManage from './pages/TradeManage/TradeManage';
import ReceivedRequests from './pages/TradeManage/ReceivedRequests';
import SentRequests from './pages/TradeManage/SentRequests';
import Sidebar from './pages/Sidebar/Sidebar';
import UserProfile from './pages/UserProfile/UserProfile';
import Footer from './components/Footer/Footer';
import AdminLogin from './pages/AdminLogin/AdminLogin';
import AdminNavbar from './admin/AdminNavbar/AdminNavbar';
import Dashboard from './pages/Dashboard/Dashboard';
import ViewUsers from './pages/ViewUsers/ViewUsers';
import ViewItems from './pages/ViewItems/ViewItems';
import ViewBannedUsers from './pages/ViewBannedUsers/ViewBannedUsers';
import CounterOffer from './pages/CounterOffer/CounterOffer';

function App() {
  const location = useLocation();

  return (
    <div className="App">
      {location.pathname.startsWith('/admin') ? (
        <>
          <AdminNavbar />
          <Routes>
            <Route exact path="/admin" element={<AdminLogin />} />
            <Route exact path="/admin/portal" element={<Dashboard />} />
            <Route exact path="/admin/users" element={<ViewUsers />} />
            <Route exact path="/admin/items" element={<ViewItems />} />
            <Route exact path="/admin/banned" element={<ViewBannedUsers />} />
          </Routes>
        </>
      ) : (
        <>
          <Navbar />
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/forget-password" element={<ForgetPassword />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/update-profile" element={<UpdateProfile />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route exact path="/add-item" element={<AddItem />} />
            <Route exact path="/edit-item/:id" element={<EditItem />} />
            <Route exact path="/detail-page/:id" element={<DetailPage />} />
            <Route exact path="/item-listing" element={<ItemList />} />
            <Route exact path="/wishlist" element={<WishList />} />
            <Route exact path="/" element={<Home />} />
            <Route exact path="/user/:id" element={<PublicProfile />} />
            <Route exact path="/trade-offer/:id" element={<Offer />} />
            <Route exact path="/counter-offer/:id" element={<CounterOffer />} />
            <Route exact path="/trade-manage" element={<TradeManage />} />
            <Route
              exact
              path="/trade-manage/rec"
              element={<ReceivedRequests />}
            />
            <Route exact path="/trade-manage/sent" element={<SentRequests />} />
            <Route exact path="/sidebar" element={<Sidebar />} />
            <Route exact path="/userprof" element={<UserProfile />} />
          </Routes>
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
