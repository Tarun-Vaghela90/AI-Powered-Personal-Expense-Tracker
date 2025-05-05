import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboardhome from './pages/DDashboardhome/Dashboardhome';

import Budget from './pages/Category';
import Expense from './pages/Expense';
import Reports from './pages/Reports';
import './App.css';
import Dashboard from './pages/Dashboard/Dashboard';

import Group from './pages/Group';

function App() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token); // ✅ true if token exists, false if not
  }, [location]); 
  // ✅ Whenever route changes (like after login), check again!

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard/home" /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard/home" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/dashboard/home" /> : <Signup />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        >
          <Route path="home" element={<Dashboardhome />} />
          <Route path="budget" element={<Budget />} />
          <Route path="expense" element={<Expense />} />
          <Route path="group" element={<Group />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
