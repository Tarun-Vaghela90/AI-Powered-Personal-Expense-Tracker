import { Link, Outlet } from 'react-router-dom';
import styles from './styles.module.css';
import {FaHome,FaMoneyBillWave,FaCreditCard,FaFileAlt}  from 'react-icons/fa'
export default function Dashboard() {
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <h1 className={styles.heading}>Dashboard</h1>
        
        <nav>
          <Link to="home" className={styles.Link_dash}><FaHome/>Home</Link>
          <Link to="Budget" className={styles.Link_dash}> <FaMoneyBillWave />Budget</Link>
          <Link to="expense" className={styles.Link_dash}><FaCreditCard/>Expense</Link>
          <Link to="reports" className={styles.Link_dash}><FaFileAlt/>Reports</Link>
        </nav>
      </div>
      
      <div className={styles.main_content}>
       
        
        {/* Define nested routes for dashboard */}
        <Outlet />
      </div>
    </div>
  );
}
