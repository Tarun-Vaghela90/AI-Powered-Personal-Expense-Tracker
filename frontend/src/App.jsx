import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardHome from './pages/dashboardhome';
import Budget from './pages/Category';
import Expense from './pages/Expense';
import Reports from './pages/Reports';
import './App.css';
import Profile from './pages/profile';
import Dashboard from './pages/dashboard'; // Import Dashboard
import Group from './pages/Group';
// import JoinGroupPage from './pages/Group/JoinGroupPage'; // Import JoinGroupPage

function App() {
  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      const url = `${import.meta.env.VITE_REACT_APP_URL}/auth/login/success`;  // Ensure the correct environment variable is used
      const { data } = await axios.get(url, { withCredentials: true });

      // console.log('Response Data:', data); // Log response to verify data structure

      // Directly set the user object
      if (data.success && data.user) {
        setUser(data.user); // Set user object from the response
      } else {
        setUser(null); // Set to null if no user data
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setUser(null); // In case of error, reset user to null
    }
  };

  useEffect(() => {
    getUser();  // Fetch user data on initial render
  }, []);

  // Log user state once it's updated
  useEffect(() => {
    // console.log('User:', user); // This should log the user object or null
  }, [user]);

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
          <Route path="budget" element={<Budget />} />
          <Route path="expense" element={<Expense />} />
          <Route path="group" element={<Group />} />
          <Route path="reports" element={<Reports />} />
          {/* <Route path="joingroup/:groupId" element={<JoinGroupPage />} /> */}

        </Route>
      </Routes>
    </div>
  );
}

export default App;
