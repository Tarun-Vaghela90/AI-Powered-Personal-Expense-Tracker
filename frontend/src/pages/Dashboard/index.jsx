import { Link, Outlet, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { FaHome, FaMoneyBillWave, FaCreditCard, FaFileAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserGroup } from 'react-icons/fa6';

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null); // To store any errors
  const authToken = localStorage.getItem('authToken'); // Get token from localStorage
  const navigate = useNavigate(); // useNavigate for redirection

  // Fetch user data from backend
  useEffect(() => {
    if (authToken) {
      axios
        .post(
          'http://localhost:3001/api/users/getuser',
          {},
          {
            headers: {
              authToken: authToken, // Pass the token directly in headers
            },
          }
        )
        .then((response) => {
          console.log(response.data); // Log the entire response to see its structure

          // Ensure the response contains the expected user data
          if (response.data && response.data._id) {
            setUserData(response.data); // Set the user data in state
          } else {
            setError('Failed to fetch user data'); // Custom error message
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          setError('An error occurred while fetching user data');
        });
    } else {
      setError('Auth token is missing');
      navigate('/login'); // Redirect to login if authToken is missing
    }
  }, [authToken, navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear token from localStorage
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <h1 className={styles.heading}>Dashboard</h1>

        {/* Display error message if there's an error */}
        {error && <p className={styles.errorMessage}>{error}</p>}

        {/* Display user info before Home link */}
        {userData ? (
          <div className={styles.userDetails}>
            <p>
              Welcome, <mark>{userData.name}</mark>
            </p>
            <p>{userData.email}</p>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}

        <nav>
          <Link to="home" className={styles.Link_dash}>
            <FaHome /> Home
          </Link>
          <Link to="Budget" className={styles.Link_dash}>
            <FaMoneyBillWave /> Category
          </Link>
          <Link to="expense" className={styles.Link_dash}>
            <FaCreditCard /> Expense
          </Link>
          <Link to="group" className={styles.Link_dash}>
            <FaUserGroup /> Groups
          </Link>
          <Link to="reports" className={styles.Link_dash}>
            <FaFileAlt /> Reports
          </Link>
        </nav>

        {/* Show Logout button if token exists */}
        {authToken && (
          <button onClick={handleLogout} className={styles.Link_dash}>
            Logout
          </button>
        )}
      </div>

      <div className={styles.main_content}>
        <Outlet />
      </div>
    </div>
  );
}
