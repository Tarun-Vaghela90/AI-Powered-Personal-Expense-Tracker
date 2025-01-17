import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardHome from './pages/dashboardhome';
import Budget from './pages/Budget';
import Expense from './pages/Expense';
import Reports from './pages/Reports';
import './App.css';
import Profile from './pages/profile';
import Dashboard from './pages/dashboard'; // Import Dashboard

function App() {
  const [user, setUser] = useState(null);
  console.log('User:', user);

  const getUser = async () => {
    try {
      const url = `${import.meta.env.VITE_REACT_APP_URL}/auth/login/success`;  // Ensure the correct environment variable is used
      const { data } = await axios.get(url, { withCredentials: true });

      // Log the response to check the structure
      console.log('Response Data:', data);

      // Adjust the following line depending on the actual response structure
      setUser(data.user ? data.user._json : null);
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="App">
      <Routes>
        {/* Route for Home/Profile page */}
        <Route
          path="/"
          element={user ? <Profile user={user} /> : <Navigate to="/login" />}
        />
        {/* Route for Login page */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login />}
        />
        {/* Route for Signup page */}
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <Signup />}
        />
        {/* Route for Dashboard, without login condition */}
        <Route path="/dashboard" element={<Dashboard />}>
          {/* Add nested routes for the dashboard here */}
          
        <Route path="home" element={<DashboardHome />} />
        <Route path="Budget" element={<Budget />} />
        <Route path="expense" element={<Expense />} />
        <Route path="reports" element={<Reports />} />
      
        </Route>
      </Routes>
    </div>
  );
}

export default App;