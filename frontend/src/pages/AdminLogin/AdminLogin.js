import './AdminLogin.css';
import { useState, useContext } from 'react';
import apiRequest from '../../config/apiRequest';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminLogin = () => {
  const { updateUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = { email, password };
      const res = await apiRequest.post('/api/admin/login', body);

      setError(null);

      updateUser(res.data.user);

      navigate('/admin/portal');
    } catch (error) {
      setError(
        error.response?.data?.message || 'An error occurred. Please try again.'
      );
    }
  };

  return (
    <div className="admin-login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Swappify</h1>
          <img src="/logo1.png" alt="" />
          <h1>Admin Login</h1>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
          {error && <span>{error}</span>}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
