import { Link, Outlet } from 'react-router-dom';
import styles from './styles.module.css';
import { FaHome, FaMoneyBillWave, FaCreditCard, FaFileAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null); // To store any errors
  const authToken = localStorage.getItem('authToken'); // Get token from localStorage

  // Fetch user data from backend
  useEffect(() => {
    if (authToken) {
      axios.post('http://localhost:3001/api/users/getuser', {}, {  // Adjusted for proper header config
        headers: {
          authToken: authToken // Pass the token directly in headers
        }
      })
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
    }
  }, [authToken]);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <h1 className={styles.heading}>Dashboard</h1>
        
        {/* Display error message if there's an error */}
        {error && <p className={styles.errorMessage}>{error}</p>}
        
        {/* Display user info before Home link */}
        {userData ? (
          <div className={styles.userDetails}>
            <p>Welcome, <mark> {userData.name}  </mark> </p>
            <p> {userData.email}</p>
            {/* <p>ID: {userData._id}</p> */}
          </div>
        ) : (
          <p>Loading user data...</p>
        )}

        <nav>
          <Link to="home" className={styles.Link_dash}><FaHome /> Home</Link>
          <Link to="Budget" className={styles.Link_dash}><FaMoneyBillWave /> Category</Link>
          <Link to="expense" className={styles.Link_dash}><FaCreditCard /> Expense</Link>
          <Link to="reports" className={styles.Link_dash}><FaFileAlt /> Reports</Link>
        </nav>
      </div>
      
      <div className={styles.main_content}>
        <Outlet />
      </div>
    </div>
  );
}
