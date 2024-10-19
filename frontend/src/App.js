import './App.css';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import UpdateProfile from "./pages/UpdateProfile/UpdateProfile";
import Profile from "./pages/Profile/Profile";
import AddItem from './pages/AddItem/AddItem';
import EditItem from './pages/EditItem/EditItem';

function App() {
  return (
    <div className="App">

      <Navbar />

      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/update-profile" element={<UpdateProfile />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/add-item" element={<AddItem />} />
        <Route exact path="/edit-item/:id" element={<EditItem />} />
      </Routes>

    </div>
  );
}

export default App;